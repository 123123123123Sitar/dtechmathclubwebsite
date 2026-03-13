import FlowSection from "../components/FlowSection";
import PageHero from "../components/PageHero";
import ProfileAuthPanel from "../components/ProfileAuthPanel";
import SectionHeader from "../components/SectionHeader";
import SurfaceCard from "../components/SurfaceCard";

export default function DPotDRegister() {
  return (
    <>
      <PageHero
        actions={[
          { label: "Open Profile Hub", to: "/profile" },
          { label: "D.PotD Overview", to: "/dpotd/about", variant: "ghost" },
        ]}
        aside={
          <ProfileAuthPanel
            defaultMode="register"
            redirectTo="/dpotd/portal"
            signedInCopy="This account is already active. You can continue into the D.PotD portal or return to your profile page."
          />
        }
        description="Create your Design Tech Math Club account here to access the Problem of the Day Challenge. This sign-in is not limited to D.PotD, so the same account can be reused anywhere the site adds student access later."
        eyebrow="Create Account"
        highlights={[
          "One Student Account",
          "D.PotD Access",
          "Reusable Across the Site",
        ]}
        title="Register Once, Use It Across the Website"
      />

      <FlowSection glow="muted">
        <section className="py-16">
          <div className="mx-auto w-[min(calc(100%-2rem),1080px)]">
            <SectionHeader
              align="center"
              description="The 2026 D.PotD competition is closed, but the profile flow is ready for future use. Students who already have an account can sign in from the profile hub or the portal access page."
              eyebrow="What To Expect"
              title="Registration Notes"
            />
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <NoticeCard title="Immediate Access">
                Once a profile is created, the student can enter the D.PotD portal right away.
              </NoticeCard>
              <NoticeCard title="Same Identity">
                The same account can later be reused by other student-facing pages without forcing
                a separate registration flow.
              </NoticeCard>
              <NoticeCard title="Support">
                If registration looks stuck or an account behaves unexpectedly, contact
                dtechmathclub@gmail.com.
              </NoticeCard>
            </div>
          </div>
        </section>
      </FlowSection>
    </>
  );
}

function NoticeCard({ title, children }) {
  return (
    <SurfaceCard className="p-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand">{title}</p>
      <p className="mt-3 text-sm leading-relaxed text-txt-muted">{children}</p>
    </SurfaceCard>
  );
}
