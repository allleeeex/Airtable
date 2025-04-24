import Link from "next/link";
import { LandingAd } from "./_components/landingPage/ad";
import { LandingHeader } from "./_components/landingPage/header";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();
  
  if (session?.user) {
    void api.post.getLatest.prefetch();
  }
  return (
    <HydrateClient>
      {!session ? 
        <div className="relative overflow-hidden">
          <LandingHeader />
          <LandingAd />
        </div>
      : 
        <div>
          "Logged iN"
          <button>
            <Link href="/api/auth/signout">Log out</Link>
          </button>
        </div>
      }
    </HydrateClient>
  );
}
