import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData()
    const imageFile = formData.get("image") as File | null
    const allergensJson = formData.get("allergens") as string | null

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Parse the allergens
    const allergens = allergensJson ? JSON.parse(allergensJson) : []

    // Check if API key is available
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        {
          error: "AI service temporarily unavailable",
          fallback: true,
          result: createFallbackResult(allergens),
        },
        { status: 503 },
      )
    }

    // Convert the image to a buffer
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer())

    // Convert buffer to base64
    const base64Image = imageBuffer.toString("base64")

    // Create a prompt that includes the user's allergens
    let allergensPrompt = ""
    if (allergens.length > 0) {
      allergensPrompt = `The user has the following allergies:\n${allergens
        .map((a: any) => `- ${a.name} (${a.severity} severity): ${a.comments}`)
        .join("\n")}\n\n`
    }

    const prompt = `${allergensPrompt}
Analyze this food image and identify:
1. What food item(s) are shown in the image
2. List all potential allergens present in the food
3. For each of the user's allergens, determine if it's likely present in the food and with what confidence level (high, medium, low)
4. Is this food safe for the user to eat based on their allergen profile?
5. Any additional warnings or considerations

Format your response as JSON with the following structure:
{
  "foodName": "Name of the food",
  "description": "Brief description of the food",
  "identifiedAllergens": [
    { "name": "Allergen name", "confidence": 95 }
  ],
  "userAllergenRisks": [
    { "name": "User's allergen", "likelihood": "high/medium/low", "confidence": 95, "userAllergen": true }
  ],
  "isSafe": true/false,
  "safetyExplanation": "Explanation of safety assessment",
  "additionalWarnings": "Any other warnings"
}

Only respond with the JSON object, no other text.`

    try {
      // Call Gemini with the image and prompt
      const result = await generateText({
        model: google("gemini-1.5-pro-latest"),
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image",
                image: Buffer.from(base64Image, "base64"),
              },
            ],
          },
        ],
      })

      // Parse the response as JSON
      let parsedResponse
      try {
        parsedResponse = JSON.parse(result.text)
      } catch (e) {
        console.error("Failed to parse AI response as JSON:", e)
        console.log("Raw response:", result.text)

        // Attempt to extract JSON from the response if it contains other text
        const jsonMatch = result.text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            parsedResponse = JSON.parse(jsonMatch[0])
          } catch (e) {
            throw new Error("Failed to parse AI response")
          }
        } else {
          throw new Error("Failed to parse AI response")
        }
      }

      return NextResponse.json(parsedResponse)
    } catch (aiError: any) {
      console.error("AI service error:", aiError)

      // Handle specific quota/rate limit errors
      if (
        aiError.message?.includes("quota") ||
        aiError.message?.includes("rate limit") ||
        aiError.message?.includes("exceeded")
      ) {
        return NextResponse.json(
          {
            error: "AI service quota exceeded. Please try again later.",
            fallback: true,
            result: createFallbackResult(allergens),
          },
          { status: 429 },
        )
      }

      // Handle other AI service errors
      return NextResponse.json(
        {
          error: "AI analysis temporarily unavailable",
          fallback: true,
          result: createFallbackResult(allergens),
        },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("Error analyzing food:", error)
    return NextResponse.json({ error: "Failed to analyze food image" }, { status: 500 })
  }
}

// Create a fallback result when AI service is unavailable
function createFallbackResult(allergens: any[]) {
  const commonAllergens = [
    "Milk",
    "Eggs",
    "Fish",
    "Shellfish",
    "Tree nuts",
    "Peanuts",
    "Wheat",
    "Soybeans",
    "Sesame",
    "Gluten",
  ]

  // Create mock allergen risks based on user's allergens
  const userAllergenRisks = allergens.map((allergen) => ({
    name: allergen.name,
    likelihood: "medium" as const,
    confidence: 50,
    userAllergen: true,
  }))

  // Add some common allergens with low likelihood
  const additionalRisks = commonAllergens
    .filter((common) => !allergens.some((user) => user.name.toLowerCase().includes(common.toLowerCase())))
    .slice(0, 3)
    .map((allergen) => ({
      name: allergen,
      likelihood: "low" as const,
      confidence: 25,
      userAllergen: false,
    }))

  const allRisks = [...userAllergenRisks, ...additionalRisks]
  const hasUserAllergens = userAllergenRisks.length > 0

  return {
    foodName: "Food Item",
    description: "Unable to analyze image details. Please manually check ingredients.",
    identifiedAllergens: commonAllergens.slice(0, 3).map((name) => ({ name, confidence: 30 })),
    userAllergenRisks: allRisks,
    isSafe: !hasUserAllergens,
    safetyExplanation: hasUserAllergens
      ? "Cannot determine safety - please check ingredients manually as this food may contain your allergens."
      : "No known allergens detected in your profile, but please verify ingredients manually.",
    additionalWarnings:
      "AI analysis unavailable. Always read ingredient labels and consult with healthcare providers for food safety.",
  }
}
