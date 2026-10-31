import { useEffect } from "react";
import { Users, Mail, Phone, CalendarDays } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import RestaurantLayout from "@/components/layout/DashboardLayout";

const CustomersPage = () => {
  const { customers, getAllCustomers, isCustomerLoading, customerError } =
    useBookingStore();

  useEffect(() => {
    getAllCustomers();
  }, [getAllCustomers]);

  return (
    <RestaurantLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Manage and view your restaurant customers.
          </p>
        </div>

        {/* Customer Count */}
        <div className="flex items-center gap-3 rounded-xl border bg-card p-5">
          <div className="rounded-lg bg-primary/10 p-3">
            <Users className="h-6 w-6 text-primary" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Total Customers</p>
            <h2 className="text-2xl font-bold">{customers.length}</h2>
          </div>
        </div>

        {/* Customers Table */}
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="border-b p-5">
            <h2 className="font-semibold">All Customers</h2>
          </div>

          {isCustomerLoading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Loading customers...
            </div>
          ) : customerError ? (
            <div className="py-12 text-center text-sm text-destructive">
              {customerError}
            </div>
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-3 h-10 w-10 text-muted-foreground" />
              <h3 className="font-medium">No customers yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Customers will appear here when they make a booking.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Phone</th>
                    <th className="px-5 py-3 font-medium">Total Visits</th>
                    <th className="px-5 py-3 font-medium">Joined On</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="border-b last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-5 py-4">
                        <div className="font-medium">{customer.name}</div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          {customer.phone}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {customer.totalVisits}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {new Date(customer.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </RestaurantLayout>
  );
};

export default CustomersPage;
