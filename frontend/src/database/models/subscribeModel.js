import mongoose, { models } from "mongoose";
const subscriberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
  },
  { timestamps: true }
);

export const SubscriberModel =
  models.Subscriber || mongoose.model("Subscriber", subscriberSchema);
