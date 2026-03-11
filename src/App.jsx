import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import DPotD from "./pages/DPotD";
import DTMT from "./pages/DTMT";
import Home from "./pages/Home";
import PuzzleNight from "./pages/PuzzleNight";

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
    description: "Design Tech Problem of the Day portal placeholder page.",
  },
  "/dtmt": {
    title: "DTMT | Design Tech Math Club",
    description:
      "Design Tech Math Tournament information, schedule, registration, and problem archives.",
  },
  "/about-our-team": {
    title: "About | Design Tech Math Club",
    description:
      "Meet the Design Tech Math Club leadership, mission, sponsors, and activities.",
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
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/puzzle-night" element={<PuzzleNight />} />
              <Route path="/dpotd" element={<DPotD />} />
              <Route path="/dtmt" element={<DTMT />} />
              <Route path="/about-our-team" element={<About />} />
              <Route path="/competitions" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/dpotd" replace />} />
            </Routes>
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
