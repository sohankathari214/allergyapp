"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface AppHeaderProps {
  title: string;
  action?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, action }) => {
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {action}
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
