import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";

// Pages
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Home from "./pages/Home";
import MealPlanner from "./pages/MealPlanner";
import Restaurants from "./pages/Restaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import Cart from "./pages/Cart";
import Tracking from "./pages/Tracking";
import Orders from "./pages/Orders";
import Groceries from "./pages/Groceries";
import GroceryShopDetail from "./pages/GroceryShopDetail";
import Medical from "./pages/Medical";
import Vehicle from "./pages/Vehicle";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import SavedAddresses from "./pages/SavedAddresses";
import PaymentMethods from "./pages/PaymentMethods";
import BudgetSettings from "./pages/BudgetSettings";
import NotificationSettings from "./pages/NotificationSettings";
import HelpSupport from "./pages/HelpSupport";
import AppSettings from "./pages/AppSettings";
import Explore from "./pages/Explore";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isOnboarded, isLoggedIn } = useApp();

  return (
    <Routes>
      {/* Redirect based on auth state */}
      <Route
        path="/"
        element={
          !isOnboarded ? (
            <Navigate to="/onboarding" replace />
          ) : !isLoggedIn ? (
            <Navigate to="/login" replace />
          ) : (
            <Navigate to="/home" replace />
          )
        }
      />

      {/* Auth Routes */}
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />

      {/* Main App Routes */}
      <Route path="/home" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/meal-planner" element={<MealPlanner />} />
      <Route path="/restaurants" element={<Restaurants />} />
      <Route path="/restaurant/:id" element={<RestaurantDetail />} />
      <Route path="/homemade" element={<Restaurants />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/tracking" element={<Tracking />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/groceries" element={<Groceries />} />
      <Route path="/grocery/:id" element={<GroceryShopDetail />} />
      <Route path="/medical" element={<Medical />} />
      <Route path="/vehicle" element={<Vehicle />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/addresses" element={<SavedAddresses />} />
      <Route path="/payments" element={<PaymentMethods />} />
      <Route path="/budget" element={<BudgetSettings />} />
      <Route path="/notifications" element={<NotificationSettings />} />
      <Route path="/help" element={<HelpSupport />} />
      <Route path="/settings" element={<AppSettings />} />
      <Route path="/subscriptions" element={<SubscriptionPlans />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
