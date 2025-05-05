import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { LandingPage } from "./pages/landingPage"
import { DashboardPage } from "./_components/dashboard/dashboardPage";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      {!session ? 
        <LandingPage />
      : 
        <DashboardPage />
      }
    </HydrateClient>
  );
}
