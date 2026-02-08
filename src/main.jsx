import { Toaster } from "react-hot-toast";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import AppRoutes from "./config/Routes";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster position="top-center" toastOptions={{ duration: 1500 }} />
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>,
);
