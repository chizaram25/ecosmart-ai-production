import type { ComponentType, Key } from "react";

export type Status = "Recycled" | "Pending";

export type ActivityItem = {
  _id: Key | null | undefined;
  id: number;
  title: string;
  time: string;
  status: Status;
  amount: number;
};

export type QuickAction = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export type NavItem = {
  id: "home" | "scan" | "activity" | "profile";
  label: string;
  icon: ComponentType<{ className?: string }>;
};