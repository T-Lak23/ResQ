import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBookingStore } from "@/store/bookingStore";
import { useTableStore } from "@/store/tableStore";
import { CalendarDays, Pencil, Users } from "lucide-react";

const toDateTimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );

  return localDate.toISOString().slice(0, 16);
};

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getTableId = (table) => (typeof table === "object" ? table?._id : table);

const getStatusClass = (status) => {
  switch (status) {
    case "confirmed":
      return "bg-green-500/10 text-green-600";
    case "pending":
      return "bg-amber-500/10 text-amber-600";
    case "cancelled":
      return "bg-red-500/10 text-red-500";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const BookingPage = () => {
  const {
    bookings,
    fetchBookings,
    isBookingLoading,
    bookingError,
    updateBooking,
    isBookingUpdating,
  } = useBookingStore();

  // Adjust these names if your tableStore uses different names.
  const { tables, fetchTables } = useTableStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    status: "pending",
    startTime: "",
    endTime: "",
    tableId: "",
  });

  useEffect(() => {
    fetchBookings().catch(() => {});
    fetchTables().catch(() => {});
  }, [fetchBookings, fetchTables]);

  const filteredBookings = useMemo(() => {
    const term = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const customer = booking.customerId;
      const table = booking.tableId;

      const matchesSearch =
        !term ||
        booking.bookingId?.toLowerCase().includes(term) ||
        customer?.name?.toLowerCase().includes(term) ||
        customer?.email?.toLowerCase().includes(term) ||
        customer?.phone?.toLowerCase().includes(term) ||
        String(table?.tableNumber ?? "").includes(term);

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const openEditor = (booking) => {
    setSelectedBooking(booking);
    setFormError("");

    setFormData({
      status: booking.status || "pending",
      startTime: toDateTimeLocal(booking.startTime),
      endTime: toDateTimeLocal(booking.endTime),
      tableId: getTableId(booking.tableId) || "",
    });
  };

  const closeEditor = () => {
    setSelectedBooking(null);
    setFormError("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!selectedBooking) return;

    setFormError("");

    if (!formData.startTime || !formData.endTime) {
      setFormError("Please select both the start and end time.");
      return;
    }

    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setFormError("Please enter valid dates and times.");
      return;
    }

    if (end <= start) {
      setFormError("End time must be after start time.");
      return;
    }

    try {
      await updateBooking(selectedBooking.bookingId, {
        status: formData.status,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        tableId: formData.tableId,
      });

      closeEditor();
    } catch (error) {
      setFormError(
        error?.response?.data?.message || "Could not update this booking.",
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View reservations and manage their details.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Total bookings</p>
              <p className="mt-2 text-2xl font-bold">{bookings.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="mt-2 text-2xl font-bold">
                {bookings.filter((b) => b.status === "pending").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="mt-2 text-2xl font-bold">
                {bookings.filter((b) => b.status === "confirmed").length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-semibold">All reservations</h2>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search booking or customer..."
                  className="sm:w-64"
                />

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <Button
                  variant="outline"
                  onClick={() => fetchBookings().catch(() => {})}
                  disabled={isBookingLoading}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isBookingLoading && bookings.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Loading bookings...
              </p>
            ) : bookingError && bookings.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-destructive">{bookingError}</p>
                <Button
                  className="mt-3"
                  variant="outline"
                  onClick={() => fetchBookings().catch(() => {})}
                >
                  Try again
                </Button>
              </div>
            ) : filteredBookings.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No bookings found.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredBookings.map((booking) => {
                  const customer = booking.customerId;
                  const table = booking.tableId;

                  return (
                    <div
                      key={booking._id || booking.bookingId}
                      className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">
                            {customer?.name || "Customer"}
                          </p>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClass(booking.status)}`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        <p className="break-all text-xs text-muted-foreground">
                          {booking.bookingId}
                        </p>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                          <span>{customer?.email || "No email"}</span>
                          <span>{customer?.phone || "No phone"}</span>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="size-4 text-muted-foreground" />
                            {formatDateTime(booking.startTime)}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Users className="size-4 text-muted-foreground" />
                            {booking.totalPeople || 1} guests
                          </span>

                          <span className="text-muted-foreground">
                            Table {table?.tableNumber ?? "—"}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="shrink-0"
                        onClick={() => openEditor(booking)}
                      >
                        <Pencil className="mr-2 size-4" />
                        Edit booking
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm">
            <Card className="max-h-[90dvh] w-full max-w-lg overflow-y-auto">
              <CardHeader>
                <h2 className="text-lg font-semibold">Edit booking</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedBooking.bookingId}
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select
                      value={formData.status}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: event.target.value,
                        }))
                      }
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start time</label>
                    <Input
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          startTime: event.target.value,
                        }))
                      }
                      required
                      className={"[color-scheme:dark]"}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">End time</label>
                    <Input
                      type="datetime-local"
                      value={formData.endTime}
                      min={formData.startTime || undefined}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          endTime: event.target.value,
                        }))
                      }
                      required
                      className={"[color-scheme:dark]"}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Table</label>
                    <select
                      value={formData.tableId}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          tableId: event.target.value,
                        }))
                      }
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      required
                    >
                      <option value="">Select a table</option>
                      {(tables ?? []).map((table) => (
                        <option key={table._id} value={table._id}>
                          Table {table.tableNumber} · {table.capacity} seats
                        </option>
                      ))}
                    </select>
                  </div>

                  {formError && (
                    <p className="text-sm text-destructive">{formError}</p>
                  )}

                  <div className="flex justify-end gap-2 border-t pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeEditor}
                      disabled={isBookingUpdating}
                    >
                      Cancel
                    </Button>

                    <Button type="submit" disabled={isBookingUpdating}>
                      {isBookingUpdating ? "Saving..." : "Save changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BookingPage;
