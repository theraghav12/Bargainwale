import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Navbar, IconButton, Dialog } from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import {
  OrganizationProfile,
  SignedIn,
  useOrganization,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

import BargainwaleIcon from "@/assets/logo.png";
import WhatsappIcon from "@/assets/whatsapp_icon.svg";
import GmailIcon from "@/assets/gmail_icon.svg";
import BitbucketIcon from "@/assets/bitbucket_icon.svg";
import EmailIcon from "@/assets/google_icon.svg";
import GithubIcon from "@/assets/github_icon.svg";
import FirebaseIcon from "@/assets/firebase_icon.svg";

// icons
import {
  Bars3Icon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  ArrowsPointingOutIcon,
  Squares2X2Icon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { API_BASE_URL } from "@/services/api";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const [openOrgProfile, setOpenOrgProfile] = useState(false);
  const [showAppMenu, setShowAppMenu] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(0);
  const { user, isSignedIn } = useUser();
  const { organization } = useOrganization();
  const navigate = useNavigate();

  const handleOpenOrgProfile = () => setOpenOrgProfile(!openOrgProfile);
  const toggleAppMenu = () => setShowAppMenu(!showAppMenu);

  // Function to reset sync time, fetch data, and reload the page
  const handleSync = async () => {
    setLastSyncTime(0); // Reset timer on sync
    await fetchData(); // Fetch data on sync
    window.location.reload(); // Reload the page
  };

  // Function to fetch organization data
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${user?.organizationMemberships[0]?.organization.id}/organization`
      );
      if (response.status === 200) {
        if (!localStorage.getItem("organizationId")) {
          localStorage.setItem("organizationId", response.data[0]._id);
          navigate("/dashboard");
        }
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

  // Update sync timer every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSyncTime((prevTime) => prevTime + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (organization !== null) {
      fetchData();
    } else {
      navigate("/auth/create-organization");
    }
  }, [organization, navigate]);

  useEffect(() => {
    if (!user) {
      navigate("/auth/sign-in");
    }
  }, [user]);

  useEffect(() => {
    if (!localStorage.getItem("clerk_active_org")) {
      localStorage.removeItem("organizationId");
      localStorage.removeItem("isFirstLoad");
    }
    if (!isSignedIn) {
      localStorage.removeItem("organizationId");
      localStorage.removeItem("isFirstLoad");
    }
  }, [isSignedIn, navigate]);

  return (
    <>
      <Navbar
        color="#183EC2"
        className="bg-gradient-to-b from-[#183EC2] to-[#0B1D5C] fixed top-0 left-0 right-0 z-40 py-3 shadow-md shadow-blue-gray-500/5"
        fullWidth
        blurred
      >
        <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-16">
            <Link to={`/${layout}`}>
              <img
                src={BargainwaleIcon}
                alt="Bargainwale"
                className="h-8 w-auto px-8"
              />
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

          <div className="flex items-center gap-2 relative">
            <IconButton
              variant="text"
              color="white"
              className="grid sm:hidden"
              onClick={() => setOpenSidenav(dispatch, !openSidenav)}
            >
              <Bars3Icon strokeWidth={3} className="h-6 w-6 text-white" />
            </IconButton>

            <SignedIn>
              {/* Sync button styled according to uploaded image */}
              <button
                onClick={handleSync}
                className="flex items-center gap-2 px-3 py-2 border rounded-full text-black border-gray-300 bg-white hover:bg-gray-100 transition"
              >
                <ArrowPathIcon className="h-5 w-5 text-black" />
                <span className="text-sm">Sync {lastSyncTime} mins ago</span>
              </button>

              <IconButton
                variant="text"
                color="white"
                onClick={toggleFullScreen}
              >
                <ArrowsPointingOutIcon className="h-6 w-6 text-white" />
              </IconButton>

              <IconButton variant="text" color="white" onClick={toggleAppMenu}>
                <Squares2X2Icon className="h-6 w-6 text-white" />
              </IconButton>

              {/* Web Apps Dropdown */}
              {showAppMenu && (
                <div
                  style={{ zIndex: 100 }}
                  className="absolute top-12 right-0 bg-white p-4 rounded-md shadow-lg w-72"
                >
                  {" "}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Web Apps
                    </h3>
                    <button className="text-blue-500 text-sm hover:underline">
                      View all
                    </button>
                  </div>
                  {/* Divider */}
                  <div className="border-t border-gray-300 mb-4"></div>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Icons for Web Apps */}
                    <button
                      className="flex flex-col items-center p-4 cursor-pointer hover:bg-gray-100 rounded-md"
                      onClick={() =>
                        window.open("https://web.whatsapp.com", "_blank")
                      }
                    >
                      <img
                        src={WhatsappIcon}
                        alt="WhatsApp"
                        className="h-6 w-6"
                      />
                      <span className="text-[12px] font-medium text-gray-700 p-1">
                        WhatsApp
                      </span>
                    </button>
                    <button
                      className="flex flex-col items-center p-4 cursor-pointer hover:bg-gray-100 rounded-md"
                      onClick={() =>
                        window.open("https://mail.google.com", "_blank")
                      }
                    >
                      <img src={GmailIcon} alt="Gmail" className="h-6 w-6" />
                      <span className="text-[12px] font-medium text-gray-700 p-1">
                        Gmail
                      </span>
                    </button>
                    <button
                      className="flex flex-col items-center p-4 cursor-pointer hover:bg-gray-100 rounded-md"
                      onClick={() =>
                        window.open("https://bitbucket.org", "_blank")
                      }
                    >
                      <img
                        src={BitbucketIcon}
                        alt="Bitbucket"
                        className="h-6 w-6"
                      />
                      <span className="text-[12px] font-medium text-gray-700 p-1">
                        Bitbucket
                      </span>
                    </button>
                    <button
                      className="flex flex-col items-center p-4 cursor-pointer hover:bg-gray-100 rounded-md"
                      onClick={() => window.open("https://mail.com", "_blank")}
                    >
                      <img src={EmailIcon} alt="Email" className="h-6 w-6" />
                      <span className="text-[12px] font-medium text-gray-700 p-1">
                        Email
                      </span>
                    </button>
                    <button
                      className="flex flex-col items-center p-4 cursor-pointer hover:bg-gray-100 rounded-md"
                      onClick={() =>
                        window.open("https://github.com", "_blank")
                      }
                    >
                      <img src={GithubIcon} alt="GitHub" className="h-6 w-6" />
                      <span className="text-[12px] font-medium text-gray-700 p-1">
                        GitHub
                      </span>
                    </button>
                    <button
                      className="flex flex-col items-center p-4 cursor-pointer hover:bg-gray-100 rounded-md"
                      onClick={() =>
                        window.open("https://firebase.google.com", "_blank")
                      }
                    >
                      <img
                        src={FirebaseIcon}
                        alt="Firebase"
                        className="h-6 w-6"
                      />
                      <span className="text-[12px] font-medium text-gray-700 p-1">
                        Firebase
                      </span>
                    </button>
                  </div>
                </div>
              )}

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
