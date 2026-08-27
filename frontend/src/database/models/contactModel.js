import mongoose, { models } from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
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
      enum: ["New", "Contacted", "Follow-up", "Converted", "Closed", "pending", "approved", "rejected"],
      default: "New",
    },
  },
  { timestamps: true }
);

// Clear cached Mongoose model to force re-compilation
delete mongoose.models.Contact;

export const ContactModel =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);
