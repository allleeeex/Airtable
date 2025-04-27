"use client";
import DashboardLayout from "~/app/(dashboard)/layout";
import { DashboardBody } from "./dashboard/home";

export function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardBody />
    </DashboardLayout>
  );
}
