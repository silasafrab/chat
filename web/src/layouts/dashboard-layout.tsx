import { Outlet } from "react-router";

import { AppSidebar, SIDEBAR_WIDTH_CLASS } from "@/components/composites/app-sidebar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className={SIDEBAR_WIDTH_CLASS}>
        <main className="min-h-screen p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
