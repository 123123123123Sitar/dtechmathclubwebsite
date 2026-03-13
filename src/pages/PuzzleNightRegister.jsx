import { Navigate } from "react-router-dom";
import FlowSection from "../components/FlowSection";
import HeroMediaPanel from "../components/HeroMediaPanel";
import PageHero from "../components/PageHero";
import PuzzleNightDashboardPanel from "../components/PuzzleNightDashboardPanel";
import SplitPanel from "../components/SplitPanel";
import { useDpotdAuth } from "../context/DpotdAuthContext";

export default function PuzzleNightRegister() {
  const { profile } = useDpotdAuth();
  const isCoachAccount = profile?.accountType === "coach";

  if (isCoachAccount) {
    return <Navigate replace to="/profile" />;
  }

  return (
    <>
      <PageHero
        actions={[
          { label: "Puzzle Night Overview", to: "/puzzle-night" },
          { label: "Profile", to: "/profile", variant: "ghost" },
        ]}
        aside={
          <HeroMediaPanel
            alt="Design Tech Math Club banner"
            badge="Puzzle Night"
            caption="This is the separate Puzzle Night registration page for student accounts."
            imageClassName="object-contain p-8 md:p-10"
            src="/dtechmathclublogolarger.jpg"
          />
        }
        description="Register for Puzzle Night here. This event is handled as an individual student signup, with an optional school field for extra context."
        highlights={["Separate Registration Page", "Student Accounts", "Register Here"]}
        title="Puzzle Night Registration"
      />

      <FlowSection>
        <section className="py-8">
          <SplitPanel
            left={
              <>
                <h2 className="text-3xl font-black text-txt">Register Here</h2>
                <p className="mt-4 leading-relaxed text-txt-muted">
                  This page holds the Puzzle Night forms so registration stays separate from the
                  profile page.
                </p>
              </>
            }
            right={
              <>
                <h2 className="text-3xl font-black text-txt">One Saved Submission</h2>
                <div className="mt-4 border-t border-border-subtle pt-4 leading-relaxed text-txt-muted">
                  This page keeps one Puzzle Night registration attached to the signed-in student
                  account. After you submit, return here to edit the same saved form.
                </div>
              </>
            }
          />
        </section>
      </FlowSection>

      <FlowSection glow="muted">
        <section className="py-16">
          <div className="mx-auto w-[min(calc(100%-2rem),1180px)]">
            <PuzzleNightDashboardPanel />
          </div>
        </section>
      </FlowSection>
    </>
  );
}
