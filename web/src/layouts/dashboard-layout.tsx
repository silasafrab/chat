import { Outlet } from "react-router";

import { AppSidebar } from "@/components/composites/app-sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="ml-64 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}