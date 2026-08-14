import mongoose, { models } from "mongoose";
const contactSchema = new mongoose.Schema(
  {    
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      minlength: 10,
    },
    destination: {
      type: String,
    },
    date: {
      type: String,
    },
    people: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    
  },
  { timestamps: true },
);

export const ContactModel =
  models.Contact || mongoose.model("Contact", contactSchema);
