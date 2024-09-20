import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Dialog,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon, // Icon for Organization Profile
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import {
  OrganizationProfile,
  RedirectToOrganizationProfile,
  SignedIn,
  UserButton,
} from "@clerk/clerk-react";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  const [openOrgProfile, setOpenOrgProfile] = useState(false);

  const handleOpenOrgProfile = () => setOpenOrgProfile(!openOrgProfile);

  return (
    <>
      <Navbar
        color="white"
        className="bg-[#38454A] fixed top-0 left-0 right-0 z-40 py-3 shadow-md shadow-blue-gray-500/5 z-[105]"
        fullWidth
        blurred
      >
        <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
          {/* Brand Name */}
          <div className="flex items-center gap-16">
            <Link to={`/${layout}`}>
              <h1 className="text-[1.5rem] px-8 font-semibold text-white">
                Bargainwale
              </h1>
            </Link>
            {/* Search Bar */}
            <div className="flex items-center w-[400px] max-w-md">
              <div className="relative w-full">
                <input
                  type="search"
                  placeholder="Search"
                  className="w-full py-2 pl-4 pr-10 text-white bg-transparent placeholder-white border border-gray-300 rounded-lg focus:outline-none shadow-inner-custom"
                />
                <MagnifyingGlassIcon className="absolute top-1/2 right-3 h-5 w-5 text-white transform -translate-y-1/2" />
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
              <UserButton />
              <IconButton
                variant="text"
                color="white"
                onClick={handleOpenOrgProfile} // Toggle modal on click
              >
                <BuildingOfficeIcon className="h-6 w-6 text-white" />{" "}
                {/* Icon next to UserButton */}
              </IconButton>
            </SignedIn>
            <IconButton
              variant="text"
              color="white"
              onClick={() => setOpenConfigurator(dispatch, true)}
            >
              <Cog6ToothIcon className="h-5 w-5 text-white" />
            </IconButton>
          </div>
        </div>
      </Navbar>

      {/* Organization Profile Modal */}
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
