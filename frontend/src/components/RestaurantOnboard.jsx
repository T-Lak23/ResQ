import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import { Plus, X } from "lucide-react";

const RestaurantOnboard = ({
  handleSubmit,
  formData,
  setFormData,
  user,
  blockedDateInput,
  setBlockedDateInput,
  addBlockedDate,
  removeBlockedDate,
}) => {
  return (
    <form
      className="lg:w-2xl mx-auto lg:px-6 px-4 lg:py-12 py-12"
      onSubmit={handleSubmit}
    >
      <div className="text-xl mb-4">
        Hi <span className="font-bold text-sidebar-primary">{user?.name}.</span>
        <p className="text-sm text-muted-foreground">
          Welcome to your dashboard
        </p>
        <p className="text-base font-medium tracking-tight text-muted-foreground mt-9">
          Get started by adding your restaurant
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <FieldLabel htmlFor="restaurant-name" className={"text-xs pb-1"}>
              Restaurant Name
            </FieldLabel>
            <Input
              id="restaurant-name"
              type="text"
              placeholder="Bob's Burgers"
              className="text-sm py-5"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="flex-1">
            <FieldLabel htmlFor="restaurant-phone" className={"text-xs pb-1"}>
              Restaurant Phone
            </FieldLabel>
            <Input
              id="restaurant-phone"
              type="text"
              placeholder="+91 9999999999"
              className="text-sm py-5"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex-1">
          <FieldLabel htmlFor="restaurant-address" className={"text-xs pb-1"}>
            Address
          </FieldLabel>
          <Input
            id="restaurant-address"
            type="text"
            placeholder="123 Main St"
            className="text-sm py-5"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <FieldLabel htmlFor="restaurant-email" className={"text-xs pb-1"}>
              Email
            </FieldLabel>
            <Input
              id="restaurant-email"
              type="email"
              placeholder="email@example.com"
              className="text-sm py-5"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="flex-1">
            <FieldLabel
              htmlFor="restaurant-capacity"
              className={"text-xs pb-1"}
            >
              Capacity
            </FieldLabel>
            <Input
              id="restaurant-capacity"
              type="number"
              min="1"
              max="1000"
              placeholder="100"
              className="text-sm py-5"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <FieldLabel htmlFor="blocked-date" className="text-xs pb-1">
              Blocked Dates (Days Off)
            </FieldLabel>

            <p className="text-xs text-muted-foreground mb-2">
              Add individual dates when your restaurant is closed.
            </p>

            <div className="flex items-center flex-wrap gap-2">
              <Input
                id="blocked-date"
                type="date"
                value={blockedDateInput}
                onChange={(e) => setBlockedDateInput(e.target.value)}
                className="min-w-0 flex-1 text-sm py-5 dark:[color-scheme:dark]"
              />

              <Button
                type="button"
                onClick={addBlockedDate}
                disabled={
                  !blockedDateInput ||
                  formData.blockedDates.includes(blockedDateInput)
                }
                className="gap-2 py-5"
              >
                <Plus size={16} />
                Add
              </Button>
            </div>
          </div>

          {formData.blockedDates.length > 0 && (
            <div className="rounded-xl border border-border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Selected dates</p>
                <span className="text-xs text-muted-foreground">
                  {formData.blockedDates.length}{" "}
                  {formData.blockedDates.length === 1 ? "date" : "dates"}
                </span>
              </div>

              {formData.blockedDates.map((date) => (
                <div
                  key={date}
                  className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2"
                >
                  <span className="text-sm">
                    {new Date(`${date}T12:00:00`).toLocaleDateString(
                      undefined,
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${date}`}
                    onClick={() => removeBlockedDate(date)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <FieldLabel
              htmlFor="restaurant-opening-time"
              className={"text-xs pb-1"}
            >
              Opening Time
            </FieldLabel>
            <Input
              id="restaurant-opening-time"
              type="time"
              placeholder="09:00"
              defaultValue="09:00"
              className="text-sm py-5"
              value={formData.openingTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  openingTime: e.target.value,
                })
              }
            />
          </div>

          <div className="flex-1">
            <FieldLabel
              htmlFor="restaurant-closing-time"
              className={"text-xs pb-1"}
            >
              Closing Time
            </FieldLabel>
            <Input
              id="restaurant-closing-time"
              type="time"
              placeholder="22:00"
              defaultValue="22:00"
              className="text-sm py-5"
              value={formData.closingTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  closingTime: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full py-5 mt-4 hover:opacity-90 transition-opacity cursor-pointer"
      >
        Create Restaurant
      </Button>
    </form>
  );
};

export default RestaurantOnboard;
