import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Store, Clock, User, LogOut } from "lucide-react";

import { useRestaurantStore } from "@/store/restaurantStore";
import RestaurantLayout from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/store/authStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router";

const Settings = () => {
  const navigate = useNavigate();
  const {
    settings,
    restaurant,
    updateRestaurant,
    isRestaurantUpdating,
    isRestaurantLoading,
    loadRestaurant,
  } = useRestaurantStore();

  const { user, logout, isAuthLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    openingTime: "09:00",
    closingTime: "22:00",
    isOpen: true,
  });

  useEffect(() => {
    loadRestaurant();
  }, [loadRestaurant]);

  useEffect(() => {
    if (restaurant && settings) {
      setFormData({
        name: restaurant.name || "",
        address: restaurant.address || "",
        phone: restaurant.phone || "",
        email: restaurant.email || "",
        openingTime: settings.openingTime || "09:00",
        closingTime: settings.closingTime || "22:00",
        isOpen: settings.isOpen ?? true,
      });
    }
  }, [restaurant, settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateRestaurant({
        ...formData,
        capacity: Number(formData.capacity),
      });
    } catch (error) {
      console.error("Failed to update restaurant:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (isRestaurantLoading) {
    return (
      <RestaurantLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </RestaurantLayout>
    );
  }

  return (
    <RestaurantLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your restaurant and account settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Restaurant Details */}
          <div className="rounded-xl border bg-card p-5 space-y-5">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Restaurant Details</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Restaurant Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Restaurant name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Restaurant email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Restaurant address"
                  required
                />
              </div>
            </div>
          </div>

          {/* Booking Settings */}
          <div className="rounded-xl border bg-card p-5 space-y-5">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Booking Settings</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Opening Time</Label>
                <Input
                  type="time"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleChange}
                  required
                  className="[color-scheme:dark]"
                />
              </div>

              <div className="space-y-2">
                <Label>Closing Time</Label>
                <Input
                  type="time"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleChange}
                  required
                  className="[color-scheme:dark]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Restaurant Status</p>
                <p className="text-sm text-muted-foreground">
                  {formData.isOpen
                    ? "Your restaurant is accepting bookings."
                    : "Your restaurant is currently closed."}
                </p>
              </div>

              <Switch
                checked={formData.isOpen}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isOpen: checked,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isRestaurantUpdating}>
              {isRestaurantUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>

        {/* Account */}
        <div className="rounded-xl border bg-card p-5 space-y-5">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Account</h2>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Logged in as</p>
            <p className="font-medium">{user?.name || "User"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>

          <div className="border-t pt-4">
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isAuthLoading}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isAuthLoading ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </div>
    </RestaurantLayout>
  );
};

export default Settings;
