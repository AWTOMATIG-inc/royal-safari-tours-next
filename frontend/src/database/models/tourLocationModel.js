import mongoose, { models } from "mongoose";

const tourLocationSchema = new mongoose.Schema(
  {
    country: {
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

    packages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TourPackage",
      },
    ],
  },
  { timestamps: true }
);

// Generate slug from country
tourLocationSchema.pre("save", async function () {
  if (this.isModified("country")) {
    let baseSlug = this.country
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
delete mongoose.models.TourLocation;

export const TourLocationModel =
  mongoose.models.TourLocation ||
  mongoose.model("TourLocation", tourLocationSchema);