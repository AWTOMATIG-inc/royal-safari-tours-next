"use client";

import Button from "@/components/Button";
import MediaGalleryModal from "@/components/dashboard/media/MediaGalleryModal";
import { tourPackageYupSchema } from "@/yup/tourPackageSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Editor = dynamic(() => import("@/components/dashboard/editor/Editor"), {
  ssr: false,
});

export default function TourPackageForm({ tourPackage, locations = [] }) {
  const [loading, setLoading] = useState(false);
  const path = usePathname();
  const isEdit = path.includes("edit");
  const router = useRouter();

  // Media Gallery Modal state
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState(null); // "featured", "gallery", or itinerary index

  // Dynamic Array States
  const [itinerary, setItinerary] = useState(tourPackage?.itinerary || []);
  const [inclusions, setInclusions] = useState(
    tourPackage?.inclusions?.length
      ? tourPackage.inclusions
      : [
          "Dedicated Professional Tour Leader & Local Guide",
          "All Local Transportation & Sightseeing Transfers",
        ]
  );
  const [exclusions, setExclusions] = useState(
    tourPackage?.exclusions?.length
      ? tourPackage.exclusions
      : ["Personal Expenses & Shopping", "International Airfare & Visa Fees"]
  );
  const [hotels, setHotels] = useState(tourPackage?.hotels || []);
  const [transportation, setTransportation] = useState(
    tourPackage?.transportation || ["Private"]
  );

  // Image File / Path State
  const [featuredImagePath, setFeaturedImagePath] = useState(
    tourPackage?.featuredImage || tourPackage?.image || ""
  );
  const [galleryImages, setGalleryImages] = useState(tourPackage?.galleryImages || []);

  const {
    reset,
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      location: "",
      price: "",
      discountPrice: "",
      hotelRating: 3,
      duration: "",
      description: "",
      additionalInfo: "",
    },
    resolver: yupResolver(tourPackageYupSchema(isEdit)),
  });

  // FIX EDIT FORM PRE-POPULATION BUG
  useEffect(() => {
    if (tourPackage) {
      const locString =
        typeof tourPackage.location === "object" && tourPackage.location?.country
          ? tourPackage.location.country
          : tourPackage.locationName || (typeof tourPackage.location === "string" ? tourPackage.location : "");

      reset({
        title: tourPackage.title || "",
        location: locString,
        price: tourPackage.price ?? "",
        discountPrice: tourPackage.discountPrice ?? "",
        hotelRating: tourPackage.hotelRating || tourPackage.rating || 4,
        duration: tourPackage.duration || "",
        description: tourPackage.description || "",
        additionalInfo: tourPackage.additionalInfo || "",
      });

      if (tourPackage.itinerary && Array.isArray(tourPackage.itinerary)) setItinerary(tourPackage.itinerary);
      if (tourPackage.inclusions && Array.isArray(tourPackage.inclusions)) setInclusions(tourPackage.inclusions);
      if (tourPackage.exclusions && Array.isArray(tourPackage.exclusions)) setExclusions(tourPackage.exclusions);
      if (tourPackage.hotels && Array.isArray(tourPackage.hotels)) setHotels(tourPackage.hotels);
      if (tourPackage.transportation && Array.isArray(tourPackage.transportation)) setTransportation(tourPackage.transportation);
      if (tourPackage.galleryImages && Array.isArray(tourPackage.galleryImages)) setGalleryImages(tourPackage.galleryImages);
      if (tourPackage.featuredImage || tourPackage.image) {
        setFeaturedImagePath(tourPackage.featuredImage || tourPackage.image);
      }
    }
  }, [tourPackage, reset]);

  // Transportation Checkbox Toggle
  const handleTransportToggle = (option) => {
    if (transportation.includes(option)) {
      setTransportation(transportation.filter((t) => t !== option));
    } else {
      setTransportation([...transportation, option]);
    }
  };

  // Itinerary Handlers
  const addItineraryDay = () => {
    const dayNumber = itinerary.length + 1;
    setItinerary([
      ...itinerary,
      {
        dayName: `Day ${dayNumber}`,
        title: "",
        description: "",
        image: "",
      },
    ]);
  };

  const updateItineraryDay = (index, field, value) => {
    const updated = [...itinerary];
    updated[index][field] = value;
    setItinerary(updated);
  };

  const removeItineraryDay = (index) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  // Inclusions & Exclusions Handlers
  const addInclusion = () => setInclusions([...inclusions, ""]);
  const updateInclusion = (idx, val) => {
    const updated = [...inclusions];
    updated[idx] = val;
    setInclusions(updated);
  };
  const removeInclusion = (idx) => setInclusions(inclusions.filter((_, i) => i !== idx));

  const addExclusion = () => setExclusions([...exclusions, ""]);
  const updateExclusion = (idx, val) => {
    const updated = [...exclusions];
    updated[idx] = val;
    setExclusions(updated);
  };
  const removeExclusion = (idx) => setExclusions(exclusions.filter((_, i) => i !== idx));

  // Hotels Handlers
  const addHotel = () => setHotels([...hotels, { city: "", hotelName: "" }]);
  const updateHotel = (idx, field, val) => {
    const updated = [...hotels];
    updated[idx][field] = val;
    setHotels(updated);
  };
  const removeHotel = (idx) => setHotels(hotels.filter((_, i) => i !== idx));

  // Remove individual gallery image
  const removeGalleryImage = (idx) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== idx));
  };

  // Media Selection Handler
  const handleSelectMedia = (selected) => {
    if (mediaTarget === "featured") {
      setFeaturedImagePath(Array.isArray(selected) ? selected[0] : selected);
    } else if (mediaTarget === "gallery") {
      const newUrls = Array.isArray(selected) ? selected : [selected];
      // append unique
      const combined = Array.from(new Set([...galleryImages, ...newUrls]));
      setGalleryImages(combined);
    } else if (typeof mediaTarget === "number") {
      const url = Array.isArray(selected) ? selected[0] : selected;
      updateItineraryDay(mediaTarget, "image", url);
    }
  };

  // Submit Handler
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        title: data.title,
        location: data.location,
        price: Number(data.price),
        discountPrice: data.discountPrice ? Number(data.discountPrice) : null,
        hotelRating: Number(data.hotelRating),
        duration: data.duration,
        description: data.description,
        additionalInfo: data.additionalInfo || "",
        featuredImage: featuredImagePath || "/images/placeholder.jpg",
        image: featuredImagePath || "/images/placeholder.jpg",
        galleryImages,
        transportation,
        itinerary,
        inclusions: inclusions.filter((i) => i.trim() !== ""),
        exclusions: exclusions.filter((e) => e.trim() !== ""),
        hotels: hotels.filter((h) => h.city.trim() !== "" && h.hotelName.trim() !== ""),
      };

      const packageId = tourPackage?.id;
      const url = isEdit ? `/api/tour-package/${packageId}` : "/api/tour-package";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || errorData.message || "Operation failed");
      }

      toast.success(isEdit ? "Tour package updated!" : "Tour package created!");
      router.push("/dashboard/tour-packages");
      router.refresh();
    } catch (error) {
      console.error("Form Submit Error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-inter">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 font-inter">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D231E]">
            {isEdit ? "Update Tour Package" : "Create New Tour Package"}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Fill in the tour information, itinerary breakdown, hotel list, and gallery photos.
          </p>
        </div>
        <Link
          href="/dashboard/tour-packages"
          className="px-4 py-2.5 rounded-xl bg-sand text-[#0D231E] hover:bg-gray-200 text-xs font-semibold transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          <span>Back to Packages</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 font-inter">
        {/* SECTION 1: CORE TOUR DETAILS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] space-y-6">
          <h3 className="text-base font-bold text-[#0D231E] flex items-center gap-2 border-b border-gray-100 pb-3">
            <Icon icon="lucide:map-pin" className="w-5 h-5 text-secondary" />
            <span>Core Expedition Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-700">Tour Title *</label>
              <input
                type="text"
                placeholder="e.g. Kathmandu & Pokhara Himalayan Odyssey"
                {...register("title")}
                className="w-full mt-1.5 bg-sand border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary font-inter"
              />
              {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
            </div>

            {/* Location Select */}
            <div>
              <label className="text-xs font-semibold text-gray-700">Location / Country *</label>
              <select
                {...register("location")}
                className="w-full mt-1.5 bg-sand border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary font-inter cursor-pointer"
              >
                <option value="">Select a location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.country}>
                    {loc.country}
                  </option>
                ))}
              </select>
              {errors.location && <p className="text-xs text-rose-500 mt-1">{errors.location.message}</p>}
            </div>

            {/* Duration */}
            <div>
              <label className="text-xs font-semibold text-gray-700">Duration *</label>
              <input
                type="text"
                placeholder="e.g. 5 Days / 4 Nights"
                {...register("duration")}
                className="w-full mt-1.5 bg-sand border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary font-inter"
              />
              {errors.duration && <p className="text-xs text-rose-500 mt-1">{errors.duration.message}</p>}
            </div>

            {/* Regular Price */}
            <div>
              <label className="text-xs font-semibold text-gray-700">Regular Price (BDT) *</label>
              <input
                type="number"
                placeholder="e.g. 45000"
                {...register("price")}
                className="w-full mt-1.5 bg-sand border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary font-inter"
              />
              {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price.message}</p>}
            </div>

            {/* Discounted Price */}
            <div>
              <label className="text-xs font-semibold text-gray-700">Discounted Price (BDT - Optional)</label>
              <input
                type="number"
                placeholder="e.g. 39900 (Leave empty if no discount)"
                {...register("discountPrice")}
                className="w-full mt-1.5 bg-sand border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary font-inter"
              />
            </div>

            {/* Hotel Rating (1-5 Star Dropdown) */}
            <div>
              <label className="text-xs font-semibold text-gray-700">Hotel Accommodation Rating *</label>
              <select
                {...register("hotelRating")}
                className="w-full mt-1.5 bg-sand border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary font-inter cursor-pointer"
              >
                <option value={3}>3 Star Accommodation</option>
                <option value={4}>4 Star Accommodation</option>
                <option value={5}>5 Star Accommodation</option>
                <option value={2}>2 Star Accommodation</option>
                <option value={1}>1 Star Accommodation</option>
              </select>
              {errors.hotelRating && <p className="text-xs text-rose-500 mt-1">{errors.hotelRating.message}</p>}
            </div>

            {/* Transportation Option Checkboxes */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">Transportation Included</label>
              <div className="flex items-center gap-4 pt-1 font-inter">
                {["Public", "Private", "Rental"].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={transportation.includes(type)}
                      onChange={() => handleTransportToggle(type)}
                      className="w-4 h-4 rounded text-secondary focus:ring-secondary cursor-pointer"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Image Box */}
          <div className="pt-2 border-t border-gray-100 font-inter">
            <label className="text-xs font-semibold text-gray-700 block mb-1">Featured Banner Image *</label>
            <div className="flex items-center gap-4">
              <div className="relative aspect-[16/9] w-40 rounded-2xl bg-sand overflow-hidden border border-gray-200">
                {featuredImagePath ? (
                  <Image src={featuredImagePath} alt="Banner" fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Icon icon="lucide:image" className="w-8 h-8" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setMediaTarget("featured");
                  setIsMediaModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-sand hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Icon icon="lucide:image" className="w-4 h-4 text-secondary" />
                <span>Select Featured Image</span>
              </button>
            </div>
          </div>

          {/* TOUR GALLERY IMAGES SELECTOR BOX */}
          <div className="pt-4 border-t border-gray-100 space-y-3 font-inter">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-gray-700 block">Tour Gallery Images</label>
                <p className="text-[11px] text-gray-400 font-light">
                  Add high-res photos to showcase the destination gallery on the package details page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMediaTarget("gallery");
                  setIsMediaModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Icon icon="lucide:plus" className="w-4 h-4" />
                <span>Add Gallery Images</span>
              </button>
            </div>

            {galleryImages.length === 0 ? (
              <div className="p-4 bg-sand/40 border border-gray-200 rounded-2xl text-center text-xs text-gray-400 font-medium">
                No gallery images added yet. Click "+ Add Gallery Images" to pick photos from Media Gallery.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="group relative aspect-square rounded-xl bg-sand overflow-hidden border border-gray-200 shadow-xs">
                    <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-rose-600/90 hover:bg-rose-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon icon="lucide:x" className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rich Description */}
          <div className="pt-2 border-t border-gray-100 font-inter">
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              Tour Description & Overview *
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Editor
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                />
              )}
            />
            {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description.message}</p>}
          </div>
        </div>

        {/* SECTION 2: DYNAMIC TOUR ITINERARY CARDS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] space-y-6 font-inter">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#0D231E] flex items-center gap-2">
                <Icon icon="lucide:calendar-days" className="w-5 h-5 text-secondary" />
                <span>Tour Itinerary Breakdown</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Add day-by-day itinerary cards with card background image, title, and description overlay.
              </p>
            </div>
            <button
              type="button"
              onClick={addItineraryDay}
              className="px-3.5 py-2 rounded-xl bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Icon icon="lucide:plus" className="w-4 h-4" />
              <span>Add Itinerary Day</span>
            </button>
          </div>

          {itinerary.length === 0 ? (
            <div className="text-center py-8 bg-sand/50 rounded-2xl border border-gray-200 space-y-2">
              <Icon icon="lucide:calendar-x" className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-xs text-gray-500">No itinerary days added yet. Click above to add Day 1.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {itinerary.map((day, idx) => (
                <div key={idx} className="p-4 bg-sand/60 border border-gray-200 rounded-2xl space-y-4 font-inter">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0D231E]">Itinerary Item #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeItineraryDay(idx)}
                      className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Icon icon="lucide:trash-2" className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600">Day Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Day 1"
                        value={day.dayName}
                        onChange={(e) => updateItineraryDay(idx, "dayName", e.target.value)}
                        className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-inter"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-gray-600">Day Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Arrival At Kathmandu & Hotel Transfer"
                        value={day.title}
                        onChange={(e) => updateItineraryDay(idx, "title", e.target.value)}
                        className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-inter"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600">Day Description</label>
                    <textarea
                      rows="3"
                      placeholder="Describe activities, sightseeing spots, meals, and overnight details..."
                      value={day.description}
                      onChange={(e) => updateItineraryDay(idx, "description", e.target.value)}
                      className="w-full mt-1 bg-white border border-gray-200 rounded-xl p-3 text-xs font-inter"
                    />
                  </div>

                  {/* Card Background Image Selector */}
                  <div className="flex items-center gap-3">
                    <div className="relative aspect-[4/3] w-20 rounded-xl bg-gray-200 overflow-hidden border border-gray-300 shrink-0">
                      {day.image ? (
                        <Image src={day.image} alt="Itinerary" fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <Icon icon="lucide:image" className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTarget(idx);
                        setIsMediaModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Icon icon="lucide:image" className="w-3.5 h-3.5 text-secondary" />
                      <span>Select Card Image</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 3: HOTELS LIST PER CITY */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] space-y-6 font-inter">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#0D231E] flex items-center gap-2">
                <Icon icon="lucide:building-2" className="w-5 h-5 text-secondary" />
                <span>Hotels & Accommodation List</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Specify hotels for each city or destination (e.g. Kathmandu - Hotel XYZ).
              </p>
            </div>
            <button
              type="button"
              onClick={addHotel}
              className="px-3.5 py-2 rounded-xl bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Icon icon="lucide:plus" className="w-4 h-4" />
              <span>Add Hotel</span>
            </button>
          </div>

          {hotels.length === 0 ? (
            <p className="text-xs text-gray-400 font-medium italic text-center py-4">
              No hotels specified yet. Click above to add hotel details per city.
            </p>
          ) : (
            <div className="space-y-3">
              {hotels.map((h, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-sand/50 p-3 rounded-2xl border border-gray-200">
                  <input
                    type="text"
                    placeholder="City (e.g. Kathmandu)"
                    value={h.city}
                    onChange={(e) => updateHotel(idx, "city", e.target.value)}
                    className="w-1/3 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-inter"
                  />
                  <input
                    type="text"
                    placeholder="Hotel Name (e.g. Hotel Himalaya 4-Star)"
                    value={h.hotelName}
                    onChange={(e) => updateHotel(idx, "hotelName", e.target.value)}
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-inter"
                  />
                  <button
                    type="button"
                    onClick={() => removeHotel(idx)}
                    className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Icon icon="lucide:trash-2" className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 4: INCLUSIONS & EXCLUSIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-inter">
          {/* Inclusions */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] space-y-4 font-inter">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                <Icon icon="lucide:check-circle" className="w-4 h-4 text-emerald-600" />
                <span>What's Included</span>
              </h4>
              <button
                type="button"
                onClick={addInclusion}
                className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-2">
              {inclusions.map((inc, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inc}
                    onChange={(e) => updateInclusion(idx, e.target.value)}
                    placeholder="e.g. Daily Buffet Breakfast & Dinner"
                    className="flex-1 bg-sand border border-gray-200 rounded-xl px-3 py-2 text-xs font-inter"
                  />
                  <button
                    type="button"
                    onClick={() => removeInclusion(idx)}
                    className="p-1.5 text-gray-400 hover:text-rose-600"
                  >
                    <Icon icon="lucide:trash-2" className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] space-y-4 font-inter">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="text-sm font-bold text-rose-800 flex items-center gap-2">
                <Icon icon="lucide:x-circle" className="w-4 h-4 text-rose-600" />
                <span>What's Excluded</span>
              </h4>
              <button
                type="button"
                onClick={addExclusion}
                className="text-xs font-semibold text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-2">
              {exclusions.map((exc, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={exc}
                    onChange={(e) => updateExclusion(idx, e.target.value)}
                    placeholder="e.g. Personal Expenses & Tips"
                    className="flex-1 bg-sand border border-gray-200 rounded-xl px-3 py-2 text-xs font-inter"
                  />
                  <button
                    type="button"
                    onClick={() => removeExclusion(idx)}
                    className="p-1.5 text-gray-400 hover:text-rose-600"
                  >
                    <Icon icon="lucide:trash-2" className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 5: ADDITIONAL INFO */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] space-y-4 font-inter">
          <h3 className="text-base font-bold text-[#0D231E] flex items-center gap-2 border-b border-gray-100 pb-3">
            <Icon icon="lucide:info" className="w-5 h-5 text-secondary" />
            <span>Good to Know & Additional Info</span>
          </h3>

          <Controller
            name="additionalInfo"
            control={control}
            render={({ field }) => (
              <Editor
                value={field.value}
                onChange={(val) => field.onChange(val)}
              />
            )}
          />
        </div>

        {/* SUBMIT BUTTON ROW */}
        <div className="flex items-center justify-end gap-4 pt-4 font-inter">
          <Link
            href="/dashboard/tour-packages"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3 rounded-xl bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-semibold transition-colors duration-300 shadow-md cursor-pointer flex items-center gap-2"
          >
            <Icon icon="lucide:check" className="w-4 h-4" />
            <span>{loading ? "Saving..." : isEdit ? "Update Tour Package" : "Create Tour Package"}</span>
          </button>
        </div>
      </form>

      {/* Media Gallery Selector Modal */}
      <MediaGalleryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelectImage={handleSelectMedia}
        multiple={mediaTarget === "gallery"}
        initialSelected={
          mediaTarget === "featured"
            ? watch("featuredImage")
            : mediaTarget === "gallery"
            ? galleryImages
            : typeof mediaTarget === "number"
            ? itinerary[mediaTarget]?.image
            : null
        }
        title={
          mediaTarget === "featured"
            ? "Select Featured Banner Image"
            : mediaTarget === "gallery"
            ? "Select Gallery Images"
            : "Select Itinerary Card Image"
        }
      />
    </div>
  );
}
