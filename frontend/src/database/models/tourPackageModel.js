import mongoose, { models } from "mongoose";

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
    price: {
      type: Number,
      required: true,
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 800,
    },
    description: {
      type: String,
      required: true,
    },
    additionalInfo: {
      type: String,
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
