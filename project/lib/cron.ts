import cron from "node-cron";
import Reminder from "@/models/CRMReminder";
import nodemailer from "nodemailer";
import { getDatabase } from "./mongodb";

cron.schedule("* * * * *", async () => {
  await getDatabase();

  const now = new Date();

  const reminders = await Reminder.find({
    reminder_datetime: { $lte: now },
    status: "pending",
  }).populate("influencer_id staff_id");

  for (const reminder of reminders) {
    if (reminder.type === "email") {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        to: (reminder.staff_id as any)?.email,
        subject: "CRM Reminder",
        text: reminder.message,
      });
    }

    reminder.status = "sent";
    await reminder.save();
  }
});