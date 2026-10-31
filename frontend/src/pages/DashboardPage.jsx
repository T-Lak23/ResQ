import { useEffect, useState } from "react";
import { useRestaurantStore } from "@/store/restaurantStore";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Loader } from "@/components/ui/Loader";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  Utensils,
  UtensilsCrossed,
  ArrowRight,
  Armchair,
  CalendarCheck,
  Clock,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import { CalendarDays, Plus, X } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import RestaurantOnboard from "@/components/RestaurantOnboard";
import DashboardCard from "@/components/DashboardCard";
import { useTableStore } from "@/store/tableStore";
import { useNavigate } from "react-router";
import { useBookingStore } from "@/store/bookingStore";
import Qrcode from "@/components/Qrcode";

const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    loadRestaurant,
    restaurant,
    createRestaurant,
    isRestaurantLoading,
    isRestaurantCreating,
    restaurantError,
    restaurantCreateError,
    settings,
    updateRestaurant,
    isRestaurantUpdating,
  } = useRestaurantStore();
  const { tables, fetchTables } = useTableStore();
  const { bookings, fetchBookings, isBookingLoading, bookingError } =
    useBookingStore();

  const { user } = useAuthStore();

  const [blockedDateInput, setBlockedDateInput] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    logo: "",
    capacity: "",
    openingTime: "09:00",
    closingTime: "22:00",
    blockedDates: [],
  });
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(settings?.isOpen ?? false);
  }, [settings?.isOpen]);

  useEffect(() => {
    loadRestaurant();
  }, [loadRestaurant, isRestaurantCreating]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const addBlockedDate = () => {
    if (!blockedDateInput) return;
    if (new Date(blockedDateInput) < new Date()) return;

    setFormData((prev) => ({
      ...prev,
      blockedDates: [
        ...new Set([...prev.blockedDates, blockedDateInput]),
      ].sort(),
    }));
    setBlockedDateInput("");
  };

  const removeBlockedDate = (dateToRemove) => {
    setFormData((prev) => ({
      ...prev,
      blockedDates: prev.blockedDates.filter((date) => date !== dateToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRestaurant(formData);
      await loadRestaurant();
    } catch (error) {
      console.error("Error creating restaurant:", error);
    }
  };
  const handleStatusChange = async (newStatus) => {
    try {
      await updateRestaurant({ isOpen: newStatus });
      setIsOnline(newStatus);
    } catch (error) {
      console.error("Error updating restaurant status:", error);
    }
  };
  return (
    <DashboardLayout>
      <div>
        {restaurantError && restaurantError !== "Restaurant not found" && (
          <p className="text-white bg-red-400/75 rounded-xl p-2 text-sm text-center">
            {restaurantError}
          </p>
        )}
        <div>
          {isRestaurantLoading ? (
            <Loader />
          ) : restaurant ? (
            <div>
              <div className="flex items-center gap-2 justify-between w-full mb-6">
                <div className="flex items-center gap-2 ">
                  <span className="text-xs text-gray-400">Status: </span>
                  <button
                    className={`bg-emerald-500 text-white text-xs px-2 py-1 rounded-lg ${isOnline ? "bg-emerald-500" : "bg-red-500"}`}
                  >
                    {isOnline ? "Open" : "Closed"}
                  </button>
                </div>
                <div>
                  <Toggle
                    variant="outline"
                    className="text-xs text-red-400 outline-red-400 border-red-400"
                    onPressedChange={handleStatusChange}
                    pressed={isOnline}
                    disabled={isRestaurantUpdating}
                  >
                    {isOnline ? "Go Offline" : "Go Online"}
                  </Toggle>
                </div>
              </div>
              <h1 className="text-2xl text-muted-foreground tracking-tight font-bold mb-4">
                Restaurant Details.
              </h1>
              <DashboardCard restaurant={restaurant} settings={settings} />

              <Qrcode
                url={`http://localhost:5173/book/${restaurant._id}`}
                size={100}
              />

              <div className="mt-6">
                {!tables || tables.length === 0 ? (
                  <div
                    className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border 
                  border-dashed border-primary  px-6 py-10 text-center sm:px-10"
                  >
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                      <UtensilsCrossed className="h-8 w-8" />
                    </div>

                    <h2 className="mb-2 text-2xl font-bold tracking-tight text-white">
                      Hi {user?.name || "there"}!
                    </h2>

                    <h3 className="mb-2 text-lg font-semibold text-muted-foreground">
                      No tables yet
                    </h3>

                    <p className="max-w-md text-sm leading-6 text-gray-500">
                      Your restaurant is ready to get started. Add your first
                      table to organize your seating and manage your restaurant
                      more efficiently.
                    </p>

                    <Button
                      onClick={() => navigate("/tables")}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 
                      shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Add Table
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold">
                        Restaurant Overview
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        A quick look at your restaurant's activity.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-xl border bg-card p-5">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Total Tables
                          </p>
                          <Armchair className="size-5 text-primary" />
                        </div>
                        <p className="mt-3 text-3xl font-bold">
                          {tables.length}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Tables in your restaurant
                        </p>
                      </div>

                      <div className="rounded-xl border bg-card p-5">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Total Bookings
                          </p>
                          <CalendarCheck className="size-5 text-primary" />
                        </div>
                        <p className="mt-3 text-3xl font-bold">
                          {bookings.length}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          All recorded reservations
                        </p>
                      </div>

                      <div className="rounded-xl border bg-card p-5">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Pending Bookings
                          </p>
                          <Clock className="size-5 text-amber-500" />
                        </div>
                        <p className="mt-3 text-3xl font-bold">
                          {
                            bookings.filter(
                              (booking) => booking.status === "pending",
                            ).length
                          }
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Awaiting confirmation
                        </p>
                      </div>

                      <div className="rounded-xl border bg-card p-5">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Confirmed Bookings
                          </p>
                          <CheckCircle2 className="size-5 text-emerald-500" />
                        </div>
                        <p className="mt-3 text-3xl font-bold">
                          {
                            bookings.filter(
                              (booking) => booking.status === "confirmed",
                            ).length
                          }
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Successfully confirmed
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border bg-card">
                      <div className="flex items-center justify-between gap-3 border-b p-5">
                        <div>
                          <h3 className="font-semibold">Recent Bookings</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Your latest reservations.
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate("/bookings")}
                        >
                          View all
                          <ArrowUpRight className="ml-2 size-4" />
                        </Button>
                      </div>

                      {isBookingLoading && bookings.length === 0 ? (
                        <p className="p-6 text-sm text-muted-foreground">
                          Loading bookings...
                        </p>
                      ) : bookingError && bookings.length === 0 ? (
                        <p className="p-6 text-sm text-destructive">
                          {bookingError}
                        </p>
                      ) : bookings.length === 0 ? (
                        <div className="p-8 text-center">
                          <CalendarCheck className="mx-auto mb-3 size-8 text-muted-foreground" />
                          <p className="font-medium">No bookings yet</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            New reservations will appear here.
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y">
                          {[...bookings]
                            .sort(
                              (a, b) =>
                                new Date(b.createdAt || b.startTime) -
                                new Date(a.createdAt || a.startTime),
                            )
                            .slice(0, 5)
                            .map((booking) => (
                              <div
                                key={booking._id || booking.bookingId}
                                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div className="min-w-0">
                                  <p className="font-medium">
                                    {booking.customerId?.name || "Customer"}
                                  </p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {booking.bookingId}
                                  </p>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    Table {booking.tableId?.tableNumber ?? "—"}
                                    {" · "}
                                    {booking.totalPeople || 1} guests
                                  </p>
                                </div>

                                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                                  <span className="text-sm text-muted-foreground">
                                    {booking.startTime
                                      ? new Date(
                                          booking.startTime,
                                        ).toLocaleDateString(undefined, {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        })
                                      : "Date unavailable"}
                                  </span>

                                  <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                                      booking.status === "confirmed"
                                        ? "bg-emerald-500/10 text-emerald-600"
                                        : booking.status === "pending"
                                          ? "bg-amber-500/10 text-amber-600"
                                          : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {booking.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <RestaurantOnboard
              handleSubmit={handleSubmit}
              formData={formData}
              setFormData={setFormData}
              user={user}
              blockedDateInput={blockedDateInput}
              setBlockedDateInput={setBlockedDateInput}
              addBlockedDate={addBlockedDate}
              removeBlockedDate={removeBlockedDate}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
