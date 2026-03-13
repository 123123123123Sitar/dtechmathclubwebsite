import { Navigate, useLocation } from "react-router-dom";
import { useDpotdAuth } from "../context/DpotdAuthContext";
import { buildProfileNextHref } from "../lib/siteAccountRouting";

export default function RequireSiteAccount({ children }) {
  const { authReady, user } = useDpotdAuth();
  const location = useLocation();

  if (!authReady) {
    return (
      <div className="mx-auto w-[min(calc(100%-2rem),1180px)] py-24 text-center text-sm font-semibold text-txt-muted">
        Checking your account session...
      </div>
    );
  }

  if (!user) {
    const nextPath = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate replace to={buildProfileNextHref(nextPath)} />;
  }

  return children;
}
