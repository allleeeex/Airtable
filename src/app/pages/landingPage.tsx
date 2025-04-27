import { LandingHeader } from "../_components/landingPage/header";
import { LandingAd }     from "../_components/landingPage/ad";
import { LowerPage }     from "../_components/landingPage/lowerPage";

export function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <LandingHeader />
      <LandingAd />
      <LowerPage />
    </div>
  );
}