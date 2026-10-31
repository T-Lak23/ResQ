import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  CheckCircle2,
  CalendarDays,
  Clock3,
  MapPin,
  UserRound,
  ArrowLeft,
} from "lucide-react";
import { useBookingStore } from "../store/bookingStore";

const BookingSuccess = () => {
  const { bookingId, restaurantId } = useParams();
  const navigate = useNavigate();

  const {
    publicGetBooking,
    publicBooking,
    isPublicBookingLoading,
    publicBookingError,
  } = useBookingStore();

  const [hasRequested, setHasRequested] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchBooking = async () => {
      setHasRequested(true);

      try {
        await publicGetBooking(restaurantId, bookingId);
      } catch (error) {
        if (!cancelled) {
          navigate(`/book/${restaurantId}`, { replace: true });
        }
      }
    };

    fetchBooking();

    return () => {
      cancelled = true;
    };
  }, [restaurantId, bookingId, publicGetBooking, navigate]);

  useEffect(() => {
    if (!hasRequested || isPublicBookingLoading) return;

    // Avoid displaying an old booking from another request.
    const bookingMatches = publicBooking?.bookingId === bookingId;

    if (publicBookingError || !bookingMatches) {
      navigate(`/book/${restaurantId}`, { replace: true });
    }
  }, [
    hasRequested,
    isPublicBookingLoading,
    publicBookingError,
    publicBooking,
    bookingId,
    restaurantId,
    navigate,
  ]);

  if (
    !hasRequested ||
    isPublicBookingLoading ||
    publicBooking?.bookingId !== bookingId
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">
            Confirming your booking...
          </p>
        </div>
      </div>
    );
  }

  const booking = publicBooking;
  const customer = booking.customerId;
  const table = booking.tableId;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-xl">
        <button
          type="button"
          onClick={() => navigate(`/book/${restaurantId}`)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to restaurant
        </button>

        <section className="overflow-hidden rounded-2xl border bg-background shadow-sm">
          <div className="flex flex-col items-center border-b px-6 py-10 text-center sm:px-10">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
              <CheckCircle2 size={38} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Booking Confirmed!
            </h1>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Your table has been booked successfully. We look forward to
              welcoming you!
            </p>

            <div className="mt-5 rounded-lg border bg-muted/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">Booking reference</p>
              <p className="mt-1 break-all font-mono text-sm font-semibold">
                {booking.bookingId}
              </p>
            </div>

            <span className="mt-4 rounded-full bg-green-100 px-3 py-1 text-xs font-medium capitalize text-green-800 dark:bg-green-950 dark:text-green-300">
              {booking.status}
            </span>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <h2 className="text-base font-semibold">Booking details</h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <CalendarDays
                  className="mt-0.5 shrink-0 text-primary"
                  size={20}
                />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="mt-1 text-sm font-medium">
                    {formatDate(booking.startTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 shrink-0 text-primary" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="mt-1 text-sm font-medium">
                    {formatTime(booking.startTime)} –{" "}
                    {formatTime(booking.endTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 shrink-0 text-primary" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Table</p>
                  <p className="mt-1 text-sm font-medium">
                    {table?.tableNumber ??
                      table?.name ??
                      table?.number ??
                      "Table reserved"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <UserRound className="mt-0.5 shrink-0 text-primary" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Booked by</p>
                  <p className="mt-1 text-sm font-medium">
                    {customer?.name ?? "Customer"}
                  </p>
                  {customer?.email && (
                    <p className="mt-1 break-all text-xs text-muted-foreground">
                      {customer.email}
                    </p>
                  )}
                  {customer?.phone && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {customer.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {booking.specialRequests && (
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-medium">Special requests</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {booking.specialRequests}
                </p>
              </div>
            )}

            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-900 dark:border-green-900 dark:bg-green-950/40 dark:text-green-200">
              Keep your booking reference handy in case you need to check your
              reservation later.
            </div>

            <button
              type="button"
              onClick={() => navigate(`/book/${restaurantId}`)}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Back to restaurant
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default BookingSuccess;
