import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

const About = lazy(() => import("./pages/About"));
const AboutDonate = lazy(() => import("./pages/AboutDonate"));
const AboutSponsor = lazy(() => import("./pages/AboutSponsor"));
const DPotDAbout = lazy(() => import("./pages/DPotD"));
const DTMT = lazy(() => import("./pages/DTMT"));
const DTMTArchive = lazy(() => import("./pages/DTMTArchive"));
const Home = lazy(() => import("./pages/Home"));
const ProfileHub = lazy(() => import("./pages/ProfileHub"));
const PuzzleNight = lazy(() => import("./pages/PuzzleNight"));
const SiteAdminPortal = lazy(() => import("./pages/SiteAdminPortal"));

const routeMeta = {
  "/": {
    title: "Design Tech Math Club",
    description:
      "Welcome to the Design Tech Math Club. Learn about our competitions, events, and community.",
  },
  "/puzzle-night": {
    title: "Puzzle Night | Design Tech Math Club",
    description:
      "Explore Design Tech Puzzle Night, an interactive event for middle schoolers in the Bay Area.",
  },
  "/dpotd": {
    title: "D.PotD | Design Tech Math Club",
    description:
      "Learn about the Design Tech Problem of the Day Challenge, scoring, awards, and the 2026 archive layout.",
  },
  "/profile": {
    title: "Profile | Design Tech Math Club",
    description:
      "Manage your Design Tech Math Club account, event access, D.PotD dashboard, and DTMT role status from one profile page.",
  },
  "/dtmt": {
    title: "DTMT | Design Tech Math Club",
    description:
      "Design Tech Math Tournament information, schedule, registration, and problem archives.",
  },
  "/about/our-team": {
    title: "Our Team | Design Tech Math Club",
    description:
      "Meet the Design Tech Math Club leadership, mission, sponsors, and activities.",
  },
  "/about/donate": {
    title: "Donate | Design Tech Math Club",
    description:
      "Support Design Tech Math Club programs through the new donation page template.",
  },
  "/about/sponsor-us": {
    title: "Sponsor Us | Design Tech Math Club",
    description:
      "Explore sponsorship opportunities and contact the Design Tech Math Club through the sponsor page.",
  },
  "/internal/club-admin": {
    title: "Site Admin | Design Tech Math Club",
    description:
      "Internal Design Tech Math Club admin page for reviewing website signups and incoming messages.",
  },
};

function usePageMeta() {
  const location = useLocation();
  const meta = routeMeta[location.pathname] ?? routeMeta["/"];

  document.title = meta.title;

  const descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag) {
    descriptionTag.setAttribute("content", meta.description);
  }
}

function useScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function AppShell() {
  usePageMeta();
  useScrollToTop();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-[72px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Suspense
              fallback={
                <div className="mx-auto w-[min(calc(100%-2rem),1180px)] py-24 text-center text-sm font-semibold text-txt-muted">
                  Loading page...
                </div>
              }
            >
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/puzzle-night" element={<PuzzleNight />} />
                <Route path="/puzzle-night/register" element={<Navigate to="/profile?view=puzzle-night" replace />} />
                <Route path="/dpotd" element={<Navigate to="/dpotd/about" replace />} />
                <Route path="/dpotd/about" element={<DPotDAbout />} />
                <Route path="/dpotd/register" element={<Navigate to="/profile?view=dpotd" replace />} />
                <Route path="/profile" element={<ProfileHub />} />
                <Route path="/dtmt" element={<DTMT />} />
                <Route path="/dtmt/archive" element={<DTMTArchive />} />
                <Route path="/dtmt/register" element={<Navigate to="/profile?view=dtmt" replace />} />
                <Route path="/about" element={<Navigate to="/about/our-team" replace />} />
                <Route path="/about/our-team" element={<About />} />
                <Route path="/about/donate" element={<AboutDonate />} />
                <Route path="/about/sponsor-us" element={<AboutSponsor />} />
                <Route path="/internal/club-admin" element={<SiteAdminPortal />} />
                <Route path="/about-our-team" element={<Navigate to="/about/our-team" replace />} />
                <Route path="/competitions" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
