import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

const Qrcode = ({ url, size = 250, showShare = true }) => {
  const navigate = useNavigate();
  const [restaurantId, setRestaurantId] = useState("");

  useEffect(() => {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const pathParts = path.split("/");
    const restaurantId = pathParts[pathParts.length - 1];
    setRestaurantId(restaurantId);
  }, []);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  const downloadQR = () => {
    const canvas = document.getElementById("restaurant-qr");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "bookme-qr-code.png";
    downloadLink.click();
  };
  return (
    <div className="flex flex-col items-center gap-4 mt-5">
      <QRCodeCanvas id="restaurant-qr" value={url} size={size} level="H" />

      <Button className="cursor-pointer" onClick={downloadQR}>
        Download QR Code
      </Button>
      <div className="flex gap-2">
        <Button className="cursor-pointer" onClick={copyToClipboard}>
          Copy URL
        </Button>
        {showShare && (
          <Button
            className="cursor-pointer"
            onClick={() => navigate(`/restaurant/${restaurantId}/qr`)}
          >
            Share QR
          </Button>
        )}
      </div>
    </div>
  );
};

export default Qrcode;
