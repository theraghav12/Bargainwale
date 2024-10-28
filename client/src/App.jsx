import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Auth } from "@/layouts";
import CreatePurchase from "./pages/purchase/CreatePurchase";
import { DashboardNavbar, Footer } from "./widgets/layout";
import SecondNavbar from "./widgets/layout/SecNavbar";
import CreateOrder from "./pages/orders/CreateOrder";
import Master from "./pages/dashboard/Master";
import Inventory from "./pages/inventory/InventoryManagement";
import { OrderHistory } from "./pages/orders/OrderHistory";
import CreateBooking from "./pages/booking/CreateBooking";
import { BookingHistory } from "./pages/booking/BookingHistory";
import PurchaseHistory from "./pages/purchase/PurchaseHistory";
import CreateSales from "./pages/sales/CreateSales";
import SalesHistory from "./pages/sales/SalesHistory";
import Home from "./pages/dashboard/home";
import SignIn from "./pages/auth/sign-in";
import BuyersList from "./pages/sales/BuyersList";
import CreateOrganizationPage from "./pages/auth/CreateOrganization";
import { SlSizeFullscreen } from "react-icons/sl";
import largeScreen from "./assets/large-screen.png";
import { useUser } from "@clerk/clerk-react";

const App = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1250);
  const { isSignedIn } = useUser();

  useEffect(() => {
    function handleResize() {
      setIsLargeScreen(window.innerWidth >= 1250);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isLargeScreen) {
    return (
      <div className="flex flex-col p-4 gap-4 bg-[#38454A] items-center justify-center h-screen text-center">
        <img src={largeScreen} className="w-14 md:w-24" />
        <p className="text-[1.3rem] md:text-[1.5rem] flex flex-col font-semibold text-white">
          Please use a larger screen to access the dashboard.
          <span className="text-[0.9rem] md:text-[1.2rem] font-normal text-white">
            (Device width {">"} 1200px)
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-gray-50/50 flex flex-col">
      {isSignedIn && (
        <>
          <DashboardNavbar />
          <SecondNavbar />
        </>
      )}

      <div className="flex flex-1 mt-28">
        <div className="flex-1">
          <Routes>
            <Route path="/auth/sign-in" element={<SignIn />} />
            <Route
              path="/auth/create-organization"
              element={<CreateOrganizationPage />}
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/master" element={<Master />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/orders/create" element={<CreateOrder />} />
            <Route path="/orders/history" element={<OrderHistory />} />
            <Route path="/bookings/create" element={<CreateBooking />} />
            <Route path="/bookings/history" element={<BookingHistory />} />
            <Route path="/purchase/create" element={<CreatePurchase />} />
            <Route path="/purchase/history" element={<PurchaseHistory />} />
            <Route path="/sales/create" element={<BuyersList />} />
            <Route path="/sales/create/:id" element={<CreateSales />} />
            <Route path="/sales/history" element={<SalesHistory />} />
          </Routes>

          <div className="text-blue-gray-600">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
