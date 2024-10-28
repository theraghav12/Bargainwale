import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { setOpenConfigurator } from "@/context";
import { useUser } from "@clerk/clerk-react";
import { useEffect, Suspense, lazy } from "react";

// Lazy loading components for improved performance
const DashboardNavbar = lazy(() => import("@/widgets/layout/DashboardNavbar"));
const SecondNavbar = lazy(() => import("@/widgets/layout/SecNavbar"));
const Footer = lazy(() => import("@/widgets/layout/Footer"));

// icons
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";

export function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user?.organizationMemberships?.length > 0) {
      localStorage.setItem(
        "organizationId",
        user?.organizationMemberships[0]?.id
      );
    } else if (user?.organizationMemberships?.length === 0) {
      navigate("/auth/create-organization");
    }
  }, [user, navigate]);

  return (
    <>
      <div className="min-h-screen bg-blue-gray-50/50 flex flex-col">
        {/* Suspense to wrap lazy-loaded components with a loading fallback */}
        <Suspense fallback={<div>Loading...</div>}>
          {/* Navbar at the top */}
          <DashboardNavbar />

          {/* Secondary Navbar below the main Navbar */}
          <SecondNavbar />

          <div className="flex flex-1 mt-28">
            <div className="flex-1">
              {/* Footer */}
              <div className="text-blue-gray-600">
                <Footer />
              </div>
            </div>
          </div>
        </Suspense>
      </div>
    </>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
