import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import routes from "@/routes";
import { setOpenConfigurator } from "@/context";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

// components
import { DashboardNavbar, Footer } from "@/widgets/layout";
import SecondNavbar from "@/widgets/layout/SecNavbar";

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
  }, [user]);

  return (
    <>
      <div className="min-h-screen bg-blue-gray-50/50 flex flex-col">
        {/* Navbar at the top */}
        <DashboardNavbar />

        {/* Second Navbar below the main one */}
        <SecondNavbar />

        <div className="flex flex-1 mt-28">
          <div className="flex-1">
            {/* Main content */}
            <Routes>
              {routes.map(
                ({ layout, pages }) =>
                  layout === "dashboard" &&
                  pages.map(({ path, element }) => (
                    <Route key={path} exact path={path} element={element} />
                  ))
              )}
            </Routes>
            <Outlet />

            {/* Footer */}
            <div className="text-blue-gray-600">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
