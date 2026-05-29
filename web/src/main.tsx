import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { Toaster } from "sonner";

import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { PrivateRoute } from "@/routes/private-route";
import { PublicRoute } from "@/routes/public-route";

import LoginPage from "./pages/login/loginPage";
import RegisterPage from "./pages/register/register-page";
import DashboardLayout from "./layouts/dashboard-layout";
import ConnectionsPage from "./pages/dashboard/connections/connections-page";
import ContactsPage from "./pages/dashboard/contacts/contacts-page";
import MessagesPage from "./pages/dashboard/messages/messages-page";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="connections" replace />,
          },
          {
            path: "connections",
            element: <ConnectionsPage />,
          },
          {
            path: "contacts",
            element: <ContactsPage />,
          },
          {
            path: "messages",
            element: <MessagesPage />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster richColors closeButton position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);