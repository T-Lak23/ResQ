import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useRestaurantStore } from "@/store/restaurantStore";
import { FullPageLoader } from "@/components/ui/Loader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dot,
  TriangleAlert,
  UtensilsCrossed,
  MapPin,
  Mail,
  Phone,
  Clock,
  CalendarDays,
  Timer,
  X,
  UserRound,
  Users,
  MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useTableStore } from "@/store/tableStore";
import { TableCard } from "./TablesPage";
import { useBookingStore } from "@/store/bookingStore";
import { useNavigate } from "react-router";

const formatTime = (time) => {
  if (!time) return "Not specified";

  // Supports both "HH:mm" and full date/time strings.
  const match = String(time).match(/^(\d{1,2}):(\d{2})/);

  if (!match) return time;

  const date = new Date();
  date.setHours(Number(match[1]), Number(match[2]), 0, 0);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatDate = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return String(dateValue);

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const InfoRow = ({ icon: Icon, label, value }) => {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-lg bg-sidebar-primary/10 p-2">
        <Icon className="h-4 w-4 text-sidebar-primary" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="break-words text-sm font-medium">{value}</p>
      </div>
    </div>
  );
};

const PublicBookingPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const {
    publicGetRestaurant,
    publicRestaurant,
    publicRestaurantSettings,
    isPublicRestaurantLoading,
    publicRestaurantError,
  } = useRestaurantStore();

  const {
    publicTables,
    getPublicTables,
    isPublicTablesLoading,
    publicTablesError,
  } = useTableStore();

  const {
    publicGetBooking,
    isPublicBookingLoading,
    publicBooking,
    publicBookingError,
    createBooking,
    isBookingCreating,
    bookingCreatingError,
  } = useBookingStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    startTime: "",
    endTime: "",
    totalPeople: 1,
    specialRequests: "",
    tableId: "",
    restaurantId: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!restaurantId) return;

    publicGetRestaurant(restaurantId);
    getPublicTables(restaurantId);
  }, [restaurantId, publicGetRestaurant, getPublicTables]);

  if (isPublicRestaurantLoading || isPublicTablesLoading) {
    return <FullPageLoader />;
  }

  if (publicRestaurantError) {
    if (publicRestaurantError?.toLowerCase().includes("closed")) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-lg">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
              <UtensilsCrossed className="h-8 w-8 text-red-500" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight">
              Restaurant is Closed
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              This restaurant is currently not accepting bookings. Please check
              back later.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-lg">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <UtensilsCrossed className="h-8 w-8 text-red-500" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight">
            {publicRestaurantError}
          </h2>
        </div>
      </div>
    );
  }

  if (publicTablesError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-lg">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <UtensilsCrossed className="h-8 w-8 text-red-500" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight">
            {publicTablesError}
          </h2>
        </div>
      </div>
    );
  }

  if (!publicRestaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-lg">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <UtensilsCrossed className="h-8 w-8 text-red-500" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight">
            Restaurant not found.
          </h2>
        </div>
      </div>
    );
  }

  const settings = publicRestaurantSettings;
  const isOpen = settings?.isOpen;
  const blockedDates = settings?.blockedDates ?? [];

  const bookingCreation = async (e) => {
    e.preventDefault();
    try {
      const form = { ...formData, restaurantId, tableId: selectedTable?._id };
      const booking = await createBooking(form);

      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        startTime: "",
        endTime: "",
        totalPeople: 1,
        specialRequests: "",
        tableId: "",
        restaurantId: "",
      });
      navigate(
        `/restaurant/${restaurantId}/booking-success/${booking.bookingId}`,
      );
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sidebar-primary/10">
              <UtensilsCrossed className="h-8 w-8 text-sidebar-primary" />
            </div>

            <h1 className="text-2xl font-bold capitalize tracking-tight">
              {publicRestaurant.name}
            </h1>

            <div
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm ${
                isOpen
                  ? "bg-green-500/10 text-green-600"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              <Dot className="h-5 w-5" />
              {isOpen ? "Open for bookings" : "Closed for bookings"}
            </div>
          </CardHeader>
        </Card>

        {/* Closed notice */}
        {!isOpen && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-500 shadow-lg shadow-red-500/5 backdrop-blur-md">
            <TriangleAlert className="h-8 w-8 shrink-0" />

            <div>
              <p className="font-semibold">
                Bookings are currently unavailable
              </p>
              <p className="mt-1 text-sm opacity-80">
                Please check our opening hours or come back later.
              </p>
            </div>
          </div>
        )}

        {/* Contact information */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Restaurant Information</h2>
          </CardHeader>

          <CardContent className="grid gap-5 sm:grid-cols-2">
            <InfoRow
              icon={MapPin}
              label="Address"
              value={publicRestaurant.address}
            />

            <InfoRow
              icon={Phone}
              label="Phone"
              value={publicRestaurant.phone}
            />

            <InfoRow icon={Mail} label="Email" value={publicRestaurant.email} />
          </CardContent>
        </Card>

        {/* Booking schedule */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Booking Information</h2>
            <p className="text-sm text-muted-foreground">
              Our regular booking schedule
            </p>
          </CardHeader>

          <CardContent className="grid gap-5 sm:grid-cols-2">
            <InfoRow
              icon={Clock}
              label="Opening Time"
              value={formatTime(settings?.openingTime)}
            />

            <InfoRow
              icon={Clock}
              label="Closing Time"
              value={formatTime(settings?.closingTime)}
            />

            {/* <InfoRow
              icon={Timer}
              label="Booking Slot Duration"
              value={
                settings?.slotDuration != null
                  ? `${settings.slotDuration} minutes`
                  : null
              }
            /> */}
          </CardContent>
        </Card>

        {blockedDates.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-red-500" />
                <h2 className="font-semibold">Upcoming Closures</h2>
              </div>

              <p className="text-sm text-muted-foreground">
                Bookings are unavailable on these dates.
              </p>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-2">
                {blockedDates.map((date, index) => (
                  <span
                    key={`${date}-${index}`}
                    className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500"
                  >
                    {formatDate(date)}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        <div className="">
          <h3 className="text-lg font-semibold mb-3">Tables</h3>
          <div className="mb-4 flex items-center">
            {/* <div className="flex flex-col justify-center items-center text-xs gap-2 mb-3">
              <p className="flex items-center gap-2 text-muted-foreground">
                Available:
                <span className="bg-primary rounded-full w-5 h-5 inline-block" />
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                Booked:
                <span className="bg-primary/10 rounded-full w-5 h-5 inline-block" />
              </p>
            </div> */}
            <div className="text-xs text-muted-foreground">
              {/* <p>T = Table Name</p> */}
              {/* <p>(4) = Table Capacity</p> */}
              <p>How it works?</p>
              <p>Click on a table to book it</p>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-5 lg:grid-cols-8 xl:grid-cols-10">
            {publicTables.map((table) => (
              <div
                key={table._id}
                onClick={() => {
                  if (table.status !== "available") return;

                  setSelectedTable(table);
                  setFormData((prev) => ({
                    ...prev,
                    tableId: table._id,
                  }));
                  setIsModalOpen(true);
                }}
                className="cursor-pointer"
              >
                <div
                  className={`flex items-center justify-center w-14 h-14 rounded-lg ${
                    table.status !== "available"
                      ? "bg-primary/10 text-primary-foreground/50"
                      : "bg-primary text-primary-foreground hover:scale-105 hover:bg-primary/90"
                  }`}
                >
                  <span className="text-sm  font-semibold">
                    T{table.tableNumber}
                  </span>
                </div>

                <div className="mt-2">
                  <p className="md:text-sm text-xs font-medium text-center">
                    {table.capacity} seats
                  </p>
                </div>
              </div>
            ))}
          </div>
          <CreateBookingModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTable(null);
            }}
            modalRef={modalRef}
            table={selectedTable}
            formData={formData}
            setFormData={setFormData}
            createBooking={bookingCreation}
            isBookingCreating={isBookingCreating}
            bookingCreatingError={bookingCreatingError}
            bookingCreation={bookingCreation}
          />
        </div>
      </div>
    </div>
  );
};

export default PublicBookingPage;

const CreateBookingModal = ({
  isOpen,
  onClose,
  modalRef,
  table,
  formData,
  setFormData,
  createBooking,
  isBookingCreating,
  bookingCreatingError,
  bookingCreation,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, modalRef, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalPeople" ? Number(value) : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 p-3 backdrop-blur-sm sm:p-6">
      <div
        ref={modalRef}
        className="relative max-h-[90dvh] w-full max-w-xl overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-xl border border-sidebar-primary bg-background p-5 shadow-xl sm:p-7"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              Book Table {table?.tableNumber}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Enter your details to create a reservation.
            </p>

            <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-sm">
              <Users className="size-4 text-muted-foreground" />
              Capacity: {table?.capacity} guests
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={bookingCreation} className="space-y-5">
          <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Customer name */}
            <Field>
              <FieldLabel htmlFor="name">
                <UserRound className="size-4" />
                Customer name
              </FieldLabel>

              <Input
                id="name"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </Field>

            {/* Phone */}
            <Field>
              <FieldLabel htmlFor="phone">
                <Phone className="size-4" />
                Phone number
              </FieldLabel>

              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                required
              />
            </Field>

            {/* Email */}
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="email">
                <Mail className="size-4" />
                Email address
              </FieldLabel>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="customer@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </Field>

            {/* Start time */}
            <Field>
              <FieldLabel htmlFor="startTime">
                <CalendarDays className="size-4" />
                Start date & time
              </FieldLabel>

              <Input
                id="startTime"
                name="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="[color-scheme:dark]"
              />
            </Field>

            {/* End time */}
            <Field>
              <FieldLabel htmlFor="endTime">
                <Clock className="size-4" />
                End date & time
              </FieldLabel>

              <Input
                id="endTime"
                name="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={handleChange}
                min={formData.startTime || undefined}
                required
                className="[color-scheme:dark]"
              />
            </Field>

            {/* Guest count */}
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="totalPeople">
                <Users className="size-4" />
                Number of guests
              </FieldLabel>

              <Input
                id="totalPeople"
                name="totalPeople"
                type="number"
                min={1}
                max={table?.capacity}
                value={formData.totalPeople}
                onChange={handleChange}
                required
              />

              <p className="text-xs text-muted-foreground">
                This table accommodates up to {table?.capacity} guests.
              </p>
            </Field>

            {/* Special requests */}
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="specialRequests">
                <MessageSquare className="size-4" />
                Special requests
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </FieldLabel>

              <Textarea
                id="specialRequests"
                name="specialRequests"
                placeholder="Any preferences or special instructions?"
                value={formData.specialRequests}
                onChange={handleChange}
                rows={3}
                className="resize-none"
              />
            </Field>
          </FieldGroup>

          {/* Error */}
          {bookingCreatingError && (
            <p
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
            >
              {bookingCreatingError}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isBookingCreating}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isBookingCreating || !table}
              className="w-full sm:w-auto"
            >
              {isBookingCreating ? "Creating booking..." : "Create booking"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
