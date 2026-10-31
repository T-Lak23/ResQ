import Qrcode from "@/components/Qrcode";
import { useParams } from "react-router";
import { useRestaurantStore } from "@/store/restaurantStore";
import { useEffect } from "react";
import { FullPageLoader } from "@/components/ui/Loader";
import { toast } from "react-hot-toast";
import { Store } from "lucide-react";

const PublicQR = () => {
  const { restaurantId } = useParams();
  const {
    publicGetRestaurant,
    publicRestaurant,
    isPublicRestaurantLoading,
    publicRestaurantError,
  } = useRestaurantStore();

  useEffect(() => {
    publicGetRestaurant(restaurantId);
  }, [restaurantId]);

  if (isPublicRestaurantLoading) {
    return <FullPageLoader />;
  }

  if (!publicRestaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Store className="h-7 w-7 text-muted-foreground" />
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">
            Restaurant QR Not Found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Sorry, we couldn't find the restaurant QR code you're looking for.
            It may have been removed or the link might be incorrect.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 rounded-xl border bg-card p-6 text-center">
      <h3 className="text-lg font-semibold">Scan to Book a Table</h3>

      <p className="text-sm text-muted-foreground">
        Scan this QR code with your phone camera to book your table.
      </p>

      <Qrcode
        showShare={false}
        url={`http://localhost:5173/book/${restaurantId}`}
      />
    </div>
  );
};

export default PublicQR;
