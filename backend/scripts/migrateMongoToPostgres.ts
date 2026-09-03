import "dotenv/config";
import mongoose from "mongoose";
import { prisma } from "../src/app/utils/prisma";

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/royal-safari-tours";

async function runMigration() {
  console.log("🚀 Starting MongoDB to PostgreSQL ETL Data Migration...");
  console.log(`Connecting to MongoDB at: ${mongoUri.replace(/:[^:@]+@/, ":***@")}`);

  await mongoose.connect(mongoUri);
  console.log("✓ Connected to MongoDB successfully.");

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Failed to get MongoDB database instance.");
  }

  // 1. MIGRATE TOUR LOCATIONS
  console.log("\n📍 Phase 1: Migrating Tour Locations...");
  const rawLocations = await db.collection("tourlocations").find({}).toArray();
  const locationIdMap = new Map<string, string>(); // mongoId -> pgId

  for (const loc of rawLocations) {
    const countryName = loc.country || loc.name || "Unknown Location";
    const slug = loc.slug || countryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    
    // Check if location already exists by slug or country
    const existing = await prisma.tourLocation.findFirst({
      where: { OR: [{ slug }, { country: countryName }] },
    });

    let pgLocId = existing?.id;

    if (!existing) {
      const created = await prisma.tourLocation.create({
        data: {
          country: countryName,
          slug,
          image: loc.image || null,
          description: loc.description || null,
          isFeatured: loc.isFeatured !== false,
        },
      });
      pgLocId = created.id;
      console.log(`  + Inserted Location: ${countryName} (${pgLocId})`);
    } else {
      console.log(`  ~ Found existing Location: ${countryName} (${pgLocId})`);
    }

    if (loc._id) {
      locationIdMap.set(loc._id.toString(), pgLocId!);
    }
  }

  // 2. MIGRATE TOUR PACKAGES, ITINERARIES & HOTELS
  console.log("\n📦 Phase 2: Migrating Tour Packages & Child Details...");
  const rawPackages = await db.collection("tourpackages").find({}).toArray();
  const packageIdMap = new Map<string, string>(); // mongoId -> pgId

  for (const pkg of rawPackages) {
    const title = pkg.title || "Untitled Package";
    const slug = pkg.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Resolve locationId
    let locationId: string | null = null;
    if (pkg.locationId && locationIdMap.has(pkg.locationId.toString())) {
      locationId = locationIdMap.get(pkg.locationId.toString())!;
    } else if (pkg.location && typeof pkg.location === "string") {
      const locMatch = await prisma.tourLocation.findFirst({
        where: { country: { equals: pkg.location, mode: "insensitive" } },
      });
      if (locMatch) locationId = locMatch.id;
    }

    const existingPkg = await prisma.tourPackage.findFirst({ where: { slug } });
    let pgPkgId = existingPkg?.id;

    const price = typeof pkg.price === "number" ? pkg.price : parseFloat(pkg.price) || 0;
    const discountPrice = pkg.discountPrice ? parseFloat(pkg.discountPrice) : null;
    const duration = pkg.duration || "5 Days / 4 Nights";

    const transportation = Array.isArray(pkg.transportation) ? pkg.transportation : [];
    const inclusions = Array.isArray(pkg.inclusions) ? pkg.inclusions : [];
    const exclusions = Array.isArray(pkg.exclusions) ? pkg.exclusions : [];
    const galleryImages = Array.isArray(pkg.galleryImages) ? pkg.galleryImages : [];

    if (!existingPkg) {
      const createdPkg = await prisma.tourPackage.create({
        data: {
          title,
          slug,
          image: pkg.image || pkg.featuredImage || null,
          featuredImage: pkg.featuredImage || pkg.image || null,
          galleryImages,
          price,
          discountPrice,
          duration,
          locationId,
          locationName: pkg.locationName || pkg.location || null,
          hotelRating: pkg.hotelRating ? parseInt(pkg.hotelRating) : 4,
          rating: pkg.rating ? parseFloat(pkg.rating) : 4.8,
          description: pkg.description || null,
          shortDescription: pkg.shortDescription || null,
          additionalInfo: pkg.additionalInfo || null,
          transportation,
          inclusions,
          exclusions,
          isFeatured: pkg.isFeatured !== false,
          isPublished: pkg.isPublished !== false,
        },
      });
      pgPkgId = createdPkg.id;
      console.log(`  + Inserted TourPackage: ${title} (${pgPkgId})`);
    } else {
      console.log(`  ~ Found existing TourPackage: ${title} (${pgPkgId})`);
    }

    if (pkg._id) {
      packageIdMap.set(pkg._id.toString(), pgPkgId!);
    }

    // Insert Itineraries if present
    if (Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0 && pgPkgId) {
      await prisma.packageItinerary.deleteMany({ where: { packageId: pgPkgId } });
      let order = 0;
      for (const item of pkg.itinerary) {
        order++;
        await prisma.packageItinerary.create({
          data: {
            packageId: pgPkgId,
            dayName: item.dayName || `Day ${order}`,
            title: item.title || `Itinerary Day ${order}`,
            description: item.description || "",
            image: item.image || null,
            sortOrder: order,
          },
        });
      }
      console.log(`    ↳ Inserted ${pkg.itinerary.length} Itinerary Days for package ${title}`);
    }

    // Insert Hotels if present
    if (Array.isArray(pkg.hotels) && pkg.hotels.length > 0 && pgPkgId) {
      await prisma.packageHotel.deleteMany({ where: { packageId: pgPkgId } });
      for (const h of pkg.hotels) {
        await prisma.packageHotel.create({
          data: {
            packageId: pgPkgId,
            city: h.city || "Destination",
            hotelName: h.hotelName || "Luxury Hotel",
            roomType: h.roomType || null,
            rating: h.rating ? parseInt(h.rating) : 4,
          },
        });
      }
      console.log(`    ↳ Inserted ${pkg.hotels.length} Hotel Stays for package ${title}`);
    }
  }

  // 3. MIGRATE TESTIMONIALS
  console.log("\n💬 Phase 3: Migrating Testimonials...");
  const rawTestimonials = await db.collection("testimonials").find({}).toArray();
  for (const item of rawTestimonials) {
    const name = item.name || "Happy Traveler";
    const feedback = item.feedback || item.comment || "";
    if (!feedback) continue;

    const rating = item.rating ? parseInt(item.rating) : 5;

    await prisma.testimonial.create({
      data: {
        name,
        country: item.country || "Bangladesh",
        feedback,
        rating,
        backgroundImage: item.backgroundImage || null,
        avatarImage: item.avatarImage || item.image || null,
        isPublished: item.isPublished !== false,
        sortOrder: item.sortOrder || 0,
      },
    });
    console.log(`  + Inserted Testimonial from ${name}`);
  }

  // 4. MIGRATE MEDIA ITEMS
  console.log("\n🖼️ Phase 4: Migrating Media Library Items...");
  const rawMedia = await db.collection("media").find({}).toArray();
  for (const item of rawMedia) {
    const name = item.name || item.filename || "file";
    const folderPath = item.folderPath || "";

    await prisma.mediaItem.create({
      data: {
        name,
        type: item.type === "folder" ? "FOLDER" : "FILE",
        url: item.url || null,
        folderPath,
        size: item.size || 0,
        mimeType: item.mimeType || item.type || null,
        width: item.width || null,
        height: item.height || null,
      },
    });
    console.log(`  + Inserted MediaItem: ${name} [Folder: ${folderPath || "root"}]`);
  }

  // 5. MIGRATE CONTACT INQUIRIES
  console.log("\n📬 Phase 5: Migrating Contact Inquiries...");
  const rawContacts = await db.collection("contacts").find({}).toArray();
  for (const c of rawContacts) {
    await prisma.contactInquiry.create({
      data: {
        name: c.name || "Anonymous",
        email: c.email || "no-email@royalsafari.tours",
        phone: c.phone || "N/A",
        message: c.message || "",
        destination: c.destination || null,
        travelDate: c.travelDate || null,
        guestCount: c.guestCount ? parseInt(c.guestCount) : 1,
        status: "PENDING",
        notes: c.notes || null,
      },
    });
    console.log(`  + Inserted Contact Inquiry from ${c.name}`);
  }

  // 6. MIGRATE SUBSCRIBERS
  console.log("\n📧 Phase 6: Migrating Newsletter Subscribers...");
  const rawSubscribers = await db.collection("subscribers").find({}).toArray();
  for (const s of rawSubscribers) {
    if (!s.email) continue;
    try {
      await prisma.newsletterSubscriber.upsert({
        where: { email: s.email },
        update: { isActive: true },
        create: {
          name: s.name || null,
          email: s.email,
          isActive: true,
        },
      });
      console.log(`  + Inserted/Updated Subscriber: ${s.email}`);
    } catch {
      // Ignore duplicates
    }
  }

  // 7. MIGRATE GALLERY ITEMS
  console.log("\n📸 Phase 7: Migrating Gallery Items...");
  const rawGallery = await db.collection("galleryimages").find({}).toArray();
  for (const g of rawGallery) {
    let locationId: string | null = null;
    let packageId: string | null = null;

    if (g.locationId && locationIdMap.has(g.locationId.toString())) {
      locationId = locationIdMap.get(g.locationId.toString())!;
    }
    if (g.packageId && packageIdMap.has(g.packageId.toString())) {
      packageId = packageIdMap.get(g.packageId.toString())!;
    }

    await prisma.galleryItem.create({
      data: {
        title: g.title || "Safari Gallery Item",
        caption: g.caption || null,
        imageUrl: g.imageUrl || g.image || "/images/banners/home_hero.webp",
        destination: g.destination || null,
        locationId,
        packageId,
        isPublished: g.isPublished !== false,
      },
    });
    console.log(`  + Inserted Gallery Item: ${g.title || "Untitled"}`);
  }

  console.log("\n✅ ETL Data Migration Finished Successfully!");
  await mongoose.disconnect();
  await prisma.$disconnect();
}

runMigration().catch((err) => {
  console.error("❌ Migration failed with error:", err);
  process.exit(1);
});
