
  import { createRoot } from "react-dom/client";
  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import App from "./App.tsx";
  import { AdminDashboard } from "./pages/AdminDashboard";
  import { LoginPage } from "./pages/LoginPage";
  import { CartPage } from "./pages/CartPage";
  import "./index.css";
  import { SiteConfigProvider } from "./context/SiteConfigContext";
  import { CartProvider } from "./context/CartContext";

  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <SiteConfigProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </CartProvider>
      </SiteConfigProvider>
    </BrowserRouter>
  );
  