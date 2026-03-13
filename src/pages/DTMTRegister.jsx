import DtmtDashboardPanel from "../components/DtmtDashboardPanel";
import FlowSection from "../components/FlowSection";
import HeroMediaPanel from "../components/HeroMediaPanel";
import PageHero from "../components/PageHero";
import SplitPanel from "../components/SplitPanel";
import { useDpotdAuth } from "../context/DpotdAuthContext";

export default function DTMTRegister() {
  const { dtmtSchool, profile, user } = useDpotdAuth();
  const isCoachAccount = profile?.accountType === "coach";

  return (
    <>
      <PageHero
        actions={[
          { label: "DTMT Overview", to: "/dtmt" },
          { label: "Profile", to: "/profile", variant: "ghost" },
        ]}
        aside={
          <HeroMediaPanel
            alt="Design Tech Math Club banner"
            badge="DTMT"
            caption="This is the separate DTMT registration page for both coach and student accounts."
            imageClassName="object-contain p-8 md:p-10"
            src="/dtechmathclublogolarger.jpg"
          />
        }
        description="Register for DTMT here. Coaches submit school registration, choose who handles student payment, and manage rosters. Students submit their competition form, choose a school when available, and follow the payment flow assigned by that school."
        highlights={["Separate Registration Page", "Coach and Student Roles", "Register Here"]}
        title="DTMT Registration"
      />

      <FlowSection>
        <section className="py-8">
          <SplitPanel
            left={
              <>
                <h2 className="text-3xl font-black text-txt">Register Here</h2>
                <p className="mt-4 leading-relaxed text-txt-muted">
                  This page holds the full DTMT registration flow. It is separate from the profile
                  page so coaches and students can work directly inside the event page.
                </p>
              </>
            }
            right={
              <>
                <h2 className="text-3xl font-black text-txt">
                  {profile?.name || (isCoachAccount ? "Coach" : "Student")}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-txt-muted">
                  {profile?.email || user?.email || ""}
                </p>
                <div className="mt-5 border-t border-border-subtle pt-4 leading-relaxed text-txt-muted">
                  {isCoachAccount
                    ? dtmtSchool
                      ? `School on file: ${dtmtSchool.schoolName}`
                      : "No DTMT school registration saved yet."
                    : "Choose a coach-registered school or continue as an individual."}
                </div>
              </>
            }
          />
        </section>
      </FlowSection>

      <FlowSection glow="muted">
        <section className="py-16">
          <div className="mx-auto w-[min(calc(100%-2rem),1180px)]">
            <DtmtDashboardPanel />
          </div>
        </section>
      </FlowSection>
    </>
  );
}
