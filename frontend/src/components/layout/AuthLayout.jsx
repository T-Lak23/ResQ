import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QrCode } from "lucide-react";

const AuthLayout = ({
  children,

  footerText,
  footerLink,
  footerLinkText,
  title,
  description,
}) => {
  return (
    <div className="w-full min-h-screen">
      <header className="border-b flex justify-between items-center">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold flex items-center">
            <QrCode className="inline-block mr-2" /> ResQ
          </h1>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] overflow-y-auto w-[90%] md:w-[80%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] mx-auto dark:bg-background">
        <div className="text-md font-bold italic font-serif mb-4">
          Managing is Easy.
        </div>
        <Card className="p-8 max-w-md w-full">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="md:text-sm text-xs">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
          <CardFooter className="flex justify-center w-full mb-8">
            <p className="md:text-sm text-xs text-muted-foreground">
              {footerText}{" "}
              <a href={footerLink} className="text-emerald-600 hover:underline">
                {footerLinkText}
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
