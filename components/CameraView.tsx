import React, { useRef } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import type { CameraCapturedPicture } from "expo-camera";

interface CameraProps {
  onCapture: (photo: CameraCapturedPicture) => void;
  onError: (error: string) => void;
}

export function CameraView({ onCapture, onError }: CameraProps) {
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(
    null
  );
  // @ts-ignore
  const cameraRef = useRef<Camera>(null);

  React.useEffect(() => {
    (async () => {
      // @ts-ignore
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      if (status !== "granted") {
        onError("Camera permission denied. Please enable it in your settings.");
      }
    })();
  }, [onError]);

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync();
      onCapture(photo);
    } catch (e) {
      onError("Failed to capture image");
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* @ts-ignore */}
      <Camera ref={cameraRef} style={styles.camera} type="back">
        <View style={styles.overlay}>
          <View style={styles.frame} />
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto} />
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    width: "75%",
    height: "75%",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
    borderRadius: 12,
  },
  captureButton: {
    position: "absolute",
    bottom: 32,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fff",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
  },
});
