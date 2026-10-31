import {
  CalendarCheck,
  Clock3,
  QrCode,
  Table2,
  Users,
  Mail,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "../store/authStore";

const features = [
  {
    icon: QrCode,
    title: "QR Code Booking",
    description:
      "Allow customers to scan your restaurant's QR code and book a table directly.",
  },
  {
    icon: CalendarCheck,
    title: "Booking Management",
    description:
      "View, confirm, and manage all your restaurant reservations from one place.",
  },
  {
    icon: Table2,
    title: "Table Management",
    description:
      "Create tables, manage seating capacity, and keep track of availability.",
  },
  {
    icon: Clock3,
    title: "Time Slot Management",
    description:
      "Manage restaurant timings and prevent overlapping reservations.",
  },
  {
    icon: Users,
    title: "Customer Management",
    description: "Keep customer information and booking history organized.",
  },
  {
    icon: Mail,
    title: "Email Notifications",
    description:
      "Keep customers updated with booking confirmations and status changes.",
  },
];

const steps = [
  {
    number: "01",
    title: "Register your restaurant",
    description:
      "Create your account and add your restaurant details, timings, and tables.",
  },
  {
    number: "02",
    title: "Share your booking page",
    description:
      "Share your restaurant's booking link or QR code with your customers.",
  },
  {
    number: "03",
    title: "Manage reservations",
    description:
      "Receive bookings and manage your reservations through your dashboard.",
  },
];

const HomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CalendarCheck size={20} />
            </div>

            <span className="text-xl font-bold tracking-tight">ResQ</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-foreground">
              How it works
            </a>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <Button asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Log in</Link>
                </Button>

                <Button asChild>
                  <Link to="/register" className="flex items-center">
                    Get started <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-md p-2 hover:bg-muted md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-border bg-background px-5 py-5 md:hidden">
            <div className="flex flex-col gap-4 text-sm">
              <a href="#features" onClick={() => setMenuOpen(false)}>
                Features
              </a>
              <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
                How it works
              </a>
              {isAuthenticated ? (
                <Button asChild>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    Log in
                  </Link>
                  <Button asChild>
                    <Link to="/register" onClick={() => setMenuOpen(false)}>
                      Get started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
            <div>
              <p className="mb-4 text-sm font-semibold text-primary">
                RESTAURANT RESERVATION MANAGEMENT
              </p>

              <h1 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
                Restaurant reservations, made simple.
              </h1>

              <p className="mt-5 max-w-lg leading-7 text-muted-foreground">
                ResQ helps restaurants manage table reservations, organize
                seating, and provide customers with a simple online booking
                experience.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  {isAuthenticated ? (
                    <Link to="/dashboard">Dashboard</Link>
                  ) : (
                    <Link to="/register" className="flex items-center">
                      Get started <ArrowRight className="ml-2 size-4" />
                    </Link>
                  )}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="flex items-center"
                >
                  <a href="#features">Explore features</a>
                </Button>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  Easy setup
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  Simple management
                </span>
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Dashboard overview
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">
                    Restaurant Dashboard
                  </h2>
                </div>

                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <CalendarCheck className="size-5" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Total Tables",
                    value: "12",
                    icon: Table2,
                  },
                  {
                    label: "Total Bookings",
                    value: "48",
                    icon: CalendarCheck,
                  },
                  {
                    label: "Pending Bookings",
                    value: "08",
                    icon: Clock3,
                  },
                  {
                    label: "Confirmed Bookings",
                    value: "32",
                    icon: CheckCircle2,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-muted-foreground">
                          {item.label}
                        </p>
                        <Icon className="size-4 shrink-0 text-primary" />
                      </div>

                      <p className="mt-3 text-2xl font-bold">{item.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-lg border border-border">
                <div className="border-b border-border p-4">
                  <h3 className="font-semibold">Recent Bookings</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    A quick look at your reservations.
                  </p>
                </div>

                {[
                  ["Alex Johnson", "Table 04", "Confirmed"],
                  ["Sarah Wilson", "Table 02", "Pending"],
                  ["Michael Brown", "Table 06", "Confirmed"],
                ].map(([name, table, status]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between gap-3 border-b border-border p-4 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {table}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        status === "Confirmed"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight">
                Everything you need to manage reservations
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                ResQ brings your restaurant's essential reservation management
                tools together in one place.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
                  >
                    <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>

                    <h3 className="font-semibold">{feature.title}</h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="scroll-mt-20 border-y border-border bg-muted/30 px-5 py-20 sm:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight">
                Get started in three simple steps
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                Set up your restaurant and start managing reservations without a
                complicated process.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <p className="text-sm font-semibold text-primary">
                    STEP {step.number}
                  </p>

                  <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl rounded-xl border border-border bg-card px-6 py-12 text-center sm:px-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to simplify your restaurant reservations?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Get started with ResQ and manage your restaurant bookings from one
              simple dashboard.
            </p>

            <Button size="lg" className="mt-7" asChild>
              <Link to="/register" className="flex items-center">
                Create your account <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-5 py-7 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link to="/" className="text-lg font-bold">
            ResQ
          </Link>

          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ResQ. All rights reserved.
          </p>

          <div className="flex gap-5 text-sm text-muted-foreground">
            {isAuthenticated ? (
              <Link to="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="hover:text-foreground">
                  Log in
                </Link>
                <Link to="/register" className="hover:text-foreground">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
