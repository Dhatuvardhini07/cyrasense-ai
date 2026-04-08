import { Skeleton } from "@/components/ui/skeleton";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy-loaded pages
const OnboardingPage = lazy(() => import("@/pages/Onboarding"));
const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const CalendarPage = lazy(() => import("@/pages/Calendar"));
const LogPage = lazy(() => import("@/pages/Log"));
const InsightsPage = lazy(() => import("@/pages/Insights"));
const SelfCarePage = lazy(() => import("@/pages/SelfCare"));
const ChatPage = lazy(() => import("@/pages/Chat"));
const SettingsPage = lazy(() => import("@/pages/Settings"));

function hasProfile(): boolean {
  try {
    const raw = localStorage.getItem("cyrasense_profile");
    return !!raw && raw !== "null";
  } catch {
    return false;
  }
}

function PageLoader() {
  return (
    <div className="flex flex-col gap-3 p-6 min-h-screen">
      <Skeleton className="h-10 w-2/3 rounded-xl" />
      <Skeleton className="h-6 w-1/2 rounded-xl" />
      <Skeleton className="h-40 w-full rounded-2xl mt-4" />
      <Skeleton className="h-32 w-full rounded-2xl" />
    </div>
  );
}

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  ),
});

// Index redirect
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    if (hasProfile()) {
      throw redirect({ to: "/dashboard" });
    }
    throw redirect({ to: "/onboarding" });
  },
});

// Onboarding — no auth guard
const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: OnboardingPage,
});

// Auth-guarded routes
function requireProfile() {
  if (!hasProfile()) {
    throw redirect({ to: "/onboarding" });
  }
  return;
}

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: requireProfile,
  component: DashboardPage,
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/calendar",
  beforeLoad: requireProfile,
  component: CalendarPage,
});

const logRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/log",
  beforeLoad: requireProfile,
  component: LogPage,
});

const insightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/insights",
  beforeLoad: requireProfile,
  component: InsightsPage,
});

const selfcareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/selfcare",
  beforeLoad: requireProfile,
  component: SelfCarePage,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat",
  beforeLoad: requireProfile,
  component: ChatPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  beforeLoad: requireProfile,
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  onboardingRoute,
  dashboardRoute,
  calendarRoute,
  logRoute,
  insightsRoute,
  selfcareRoute,
  chatRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
