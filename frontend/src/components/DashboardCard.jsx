import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Utensils } from "lucide-react";

const DashboardCard = ({ restaurant, settings }) => {
  return (
    <Card>
      <CardHeader className="flex items-center w-full justify-between gap-2">
        <div className="text-xl font-bold uppercase tracking-tight">
          <Utensils className="inline-block mr-2 bg-emerald-500 w-15 h-15 p-4 rounded-2xl" />{" "}
          {restaurant?.name}
        </div>
        <div className="text-sm flex items-center gap-2">
          <span className="text-muted-foreground font-semibold">Address:</span>
          <span>{restaurant?.address}</span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 ">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-muted-foreground">Contact:</span>
          <span className="flex  gap-2">{restaurant?.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-muted-foreground">Email:</span>
          <span className="flex  gap-2">{restaurant?.email}</span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start">
        <div className={"flex items-center gap-3"}>
          <p className="font-semibold text-muted-foreground">Opening Hours:</p>
          <p>
            {settings.openingTime} - {settings.closingTime}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DashboardCard;
