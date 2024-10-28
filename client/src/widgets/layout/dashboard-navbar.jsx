import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Navbar, IconButton, Dialog } from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import {
  OrganizationProfile,
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

// icons
import {
  Cog6ToothIcon,
  Bars3Icon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { API_BASE_URL } from "@/services/api";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const [openOrgProfile, setOpenOrgProfile] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleOpenOrgProfile = () => setOpenOrgProfile(!openOrgProfile);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${user?.organizationMemberships[0]?.organization.id}/organization`
      );
      if (response.status === 200) {
        localStorage.setItem("organizationId", response.data[0]._id);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("organizationId");
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    if (user && user?.organizationMemberships?.length > 0) {
      fetchData();
    } else if (user?.organizationMemberships?.length === 0) {
      navigate("/auth/create-organization");
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/auth/sign-in");
    }
  }, [user, navigate]);

  return (
    <>
      <Navbar
        color="white"
        className="bg-gradient-to-b from-[#183EC2] to-[#0B1D5C] fixed top-0 left-0 right-0 z-40 py-3 shadow-md shadow-blue-gray-500/5 z-[105]"
        fullWidth
        blurred
      >
        <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-16">
            <Link to={`/${layout}`}>
              <h1 className="text-[1.5rem] px-8 font-semibold text-white">
                Bargainwale
              </h1>
            </Link>
            <div className="flex items-center w-[400px] max-w-md">
              <div className="relative w-full">
                <input
                  type="search"
                  placeholder="Search"
                  className="w-full py-2 pl-4 pr-10 text-black bg-white placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none shadow-inner-custom"
                />
                <MagnifyingGlassIcon className="absolute top-1/2 right-3 h-5 w-5 text-gray-500 transform -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <IconButton
              variant="text"
              color="white"
              className="grid sm:hidden"
              onClick={() => setOpenSidenav(dispatch, !openSidenav)}
            >
              <Bars3Icon strokeWidth={3} className="h-6 w-6 text-white" />
            </IconButton>

            <SignedIn>
              <IconButton
                variant="text"
                color="white"
                onClick={toggleFullScreen}
              >
                <ArrowsPointingOutIcon className="h-6 w-6 text-white" />
              </IconButton>

              <UserButton
                afterSignOutUrl="/auth/sign-in"
                signOutCallback={handleSignOut}
              />

              <IconButton
                variant="text"
                color="white"
                onClick={handleOpenOrgProfile}
              >
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              </IconButton>
            </SignedIn>
          </div>
        </div>
      </Navbar>

      <Dialog
        open={openOrgProfile}
        handler={handleOpenOrgProfile}
        size="lg"
        className="p-5"
      >
        <OrganizationProfile />
      </Dialog>
    </>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
