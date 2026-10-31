import transporter from "../config/nodemailer.js";
import { env } from "../config/env.js";

export const sendBookingEmail = async (
  email,
  name,
  restaurantName,
  tableNumber,
  status,
  bookingDetails = {},
) => {
  try {
    const statusContent = {
      pending: {
        subject: "Booking Request Received",
        heading: "Booking Request Received!",
        message:
          "Your booking request has been received and YOU WILL SOON RECEIVE AN EMAIL REGARDING THE CONFIRMATION OF YOUR BOOKING.",
        color: "#F59E0B",
      },
      confirmed: {
        subject: "Booking Confirmed",
        heading: "Your Booking is Confirmed!",
        message: "Great news! Your booking has been successfully confirmed.",
        color: "#16A34A",
      },
      cancelled: {
        subject: "Booking Cancelled",
        heading: "Your Booking Has Been Cancelled",
        message: "Unfortunately, your booking has been cancelled.",
        color: "#DC2626",
      },
    };

    const content = statusContent[status];

    if (!content) {
      throw new Error("Invalid booking status");
    }

    const { startTime, endTime, totalPeople, specialRequests } = bookingDetails;

    await transporter.sendMail({
      from: `"${env.NODEMAILER_USER_NAME}" <${env.NODEMAILER_USER}>`,
      to: email,
      subject: content.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">

          <h2 style="color: ${content.color};">
            ${content.heading}
          </h2>

          <p>Hello ${name},</p>

          <p>${content.message}</p>

          <h3>Booking Details</h3>

          <p><strong>Restaurant:</strong> ${restaurantName}</p>
          <p><strong>Table Number:</strong> ${tableNumber}</p>
          ${startTime ? `<p><strong>Start Time:</strong> ${new Date(startTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>` : ""}
          ${endTime ? `<p><strong>End Time:</strong> ${new Date(endTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>` : ""}
          ${totalPeople ? `<p><strong>Guests:</strong> ${totalPeople}</p>` : ""}
          ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ""}

          <p style="margin-top: 25px;">
            Thank you for choosing ${restaurantName}!
          </p>

        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending booking email:", error);
  }
};
