import mongoose, { models } from "mongoose";

const itineraryItemSchema = new mongoose.Schema({
  dayName: { type: String, required: true }, // e.g. "Day 1"
  title: { type: String, required: true },   // e.g. "Arrival At Kathmandu"
  description: { type: String, default: "" },
  image: { type: String, default: "" },
});

const hotelItemSchema = new mongoose.Schema({
  city: { type: String, required: true },     // e.g. "Kathmandu"
  hotelName: { type: String, required: true },// e.g. "Hotel XYZ"
});

const tourPackageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
      default: "",
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    duration: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    hotelRating: {
      type: Number,
      required: true,
      default: 3,
      min: 1,
      max: 5,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    shortDescription: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    transportation: {
      type: [String], // ["Public", "Private", "Rental"]
      default: [],
    },
    itinerary: {
      type: [itineraryItemSchema],
      default: [],
    },
    inclusions: {
      type: [String],
      default: [],
    },
    exclusions: {
      type: [String],
      default: [],
    },
    hotels: {
      type: [hotelItemSchema],
      default: [],
    },
    additionalInfo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Generate slug from title
tourPackageSchema.pre("save", async function () {
  if (this.isModified("title")) {
    let baseSlug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    let slug = baseSlug;
    let counter = 1;

    // Check duplicate slug
    while (
      await this.constructor.findOne({
        slug,
        _id: { $ne: this._id },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
});

// Force re-compilation of model to clear cached schemas
delete mongoose.models.TourPackage;

export const TourPackageModel =
  mongoose.models.TourPackage ||
  mongoose.model("TourPackage", tourPackageSchema);
