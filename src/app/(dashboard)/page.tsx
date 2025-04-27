"use client";
import DashboardLayout from "~/app/(dashboard)/layout";
import { DashboardBody } from "../_components/dashboard/home";

export function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardBody />
    </DashboardLayout>
  );
}
