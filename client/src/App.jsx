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

function App() {
  return (
    <div className="min-h-screen bg-blue-gray-50/50 flex flex-col">
      <DashboardNavbar />
      <SecondNavbar />

      <div className="flex flex-1 mt-28">
        <div className="flex-1">
          <Routes>
            {/* <Route path="/dashboard/*" element={<Dashboard />} /> */}
            <Route path="/auth/*" element={<Auth />} />
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
            <Route path="/sales/create" element={<CreateSales />} />
            <Route path="/sales/history" element={<SalesHistory />} />
            {/* <Route path="/dashboard/" element={<Dashboard />}>
              <Route path="/dashboard/purchase/create" element={<Purchase />} />
              <Route path="/dashboard/sales/create" element={<Sales />} />
            </Route> */}
          </Routes>

          <div className="text-blue-gray-600">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
