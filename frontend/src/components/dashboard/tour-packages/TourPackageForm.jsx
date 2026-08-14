"use client";
import Button from "@/components/Button";
import { tourPackageYupSchema } from "@/yup/tourPackageSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
const Editor = dynamic(() => import("@/components/dashboard/editor/Editor"), {
  ssr: false,
});

export default function TourPackageForm({ tourPackage, locations }) {
  const [loading, setLoading] = useState(false);
  const path = usePathname();
  const isEdit = path.includes("edit");
  const router = useRouter();

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: tourPackage?.title || "",
      description: tourPackage?.description || "",
      additionalInfo: tourPackage?.additionalInfo || "",
      price: tourPackage?.price || "",
      rating: tourPackage?.rating || "",
      location: tourPackage?.location || "",
      duration: tourPackage?.duration || "",
      shortDescription: tourPackage?.shortDescription || "",
      image: [],
    },
    resolver: yupResolver(tourPackageYupSchema(isEdit)),
  });
  const shortDescriptionField = useWatch({
    control,
    name: "shortDescription",
  });
  //for submitting the form
  const onSubmit = async (e) => {
    const formData = new FormData();
    formData.append("title", e.title);
    formData.append("price", e.price);
    formData.append("rating", e.rating);
    formData.append("location", e.location);
    formData.append("duration", e.duration);
    formData.append("shortDescription", e.shortDescription);
    formData.append("description", e.description);
    formData.append("additionalInfo", e.additionalInfo);
    if (e.image && e.image.length > 0) {
      formData.append("image", e.image[0]);
    }
    setLoading(true);

    if (isEdit) {
      formData.append("existingImage", tourPackage.image);

      try {
        const res = await fetch(`/api/tour-package/${tourPackage?._id}`, {
          method: "PUT",
          body: formData,
        });
        const data = await res.json();
        if (data) {
          reset();
          setLoading(false);
          toast.success("Tour package updated successfully!");
          router.push("/dashboard/tour-packages");
        }
      } catch (error) {
        toast.error(error.message);
        console.error("Error updating tour package:", error);
      }
    } else {
      try {
        const res = await fetch("/api/tour-package", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data) {
          reset();
          setLoading(false);
          toast.success("Tour package created successfully!");
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error(error.message);
      }
    }
  };
  return (
    <div className="md:w-4/5 mx-auto">
      <div className="mt-10">
        <div className="flex justify-between items-center mt-8">
          <h1 className="text-2xl font-bold">
            {isEdit ? "Update" : "Create new"} tour package
          </h1>
          <Link
            className="bg-orange text-white px-4 py-2 rounded-xl text-nowrap"
            href="/dashboard/tour-packages"
          >
            {" "}
            See packages
          </Link>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-y-8 mt-8"
          action="#"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="" className="mb-1 block">
                Title:
              </label>
              <input
                type="text"
                className="border border-gray-500 p-4 rounded-md w-full block"
                placeholder="Post Title"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500 ml-1 mt-1 block text-sm capitalize ">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="" className="mb-1 block">
                Locations:
              </label>
              <select
                {...register("location")}
                className={`border  p-4 rounded-md w-full focus:outline-none ${
                  errors.location ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a location</option>
                {locations.map((location, index) => (
                  <option key={index} value={location.country}>
                    {location.country}
                  </option>
                ))}
              </select>

              {errors.location && (
                <p className="text-red-500 text-sm mt-1 ml-1">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2  gap-4">
            <div>
              <label htmlFor="" className="mb-1 block">
                Price:
              </label>
              <input
                type="number"
                min="0"
                className="border border-gray-500 p-4 rounded-md w-full block"
                placeholder="Price"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-red-500 ml-1 mt-1 block text-sm capitalize ">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="" className="mb-1 block">
                Rating:
              </label>
              <select
                {...register("rating")}
                className={`border  p-4 rounded-md w-full focus:outline-none ${
                  errors.rating ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a rating</option>
                {Array.from({ length: 6 }).map((_, index) => (
                  <option key={index} value={index}>
                    {index}
                  </option>
                ))}
              </select>

              {errors.rating && (
                <p className="text-red-500 text-sm mt-1 ml-1">
                  {errors.rating.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="" className="mb-1 block">
                Duration:
              </label>
              <input
                type="text"
                className="border border-gray-500 p-4 rounded-md w-full block"
                placeholder="Ex: 1 days & 1 nights"
                {...register("duration")}
              />
              {errors.duration && (
                <p className="text-red-500 ml-1 mt-1 block text-sm capitalize ">
                  {errors.duration.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="" className="mb-1 block">
                Tour Package Image:
              </label>
              <input
                type="file"
                className="border border-gray-500 p-4 rounded-md accent-amber-50 w-full block"
                {...register("image")}
              />
              {errors.image && (
                <p className="text-red-500 ml-1 mt-1 block text-sm capitalize">
                  {errors.image.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="" className="mb-1 block">
              Short Description:
            </label>
            <textarea
              placeholder="Write something..."
              className={`border border-gray-300 w-full focus:outline-0 rounded-md p-3 min-h-24 focus:outline-none ${
                errors.shortDescription ? "border-red-500" : "border-gray-300"
              }`}
              {...register("shortDescription")}
            ></textarea>
            <div className="flex items-center justify-between">
              {errors.shortDescription && (
                <p className="text-red-500 text-sm mt-1 ml-1">
                  {errors.shortDescription.message}
                </p>
              )}
              <p
                className={`w-fit ml-auto ${shortDescriptionField.length > 150 && "text-red"}`}
              >
                {shortDescriptionField.length}
              </p>
            </div>
          </div>
          <div>
            <label className="mb-4 block">Description: </label>
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

            {errors.description && (
              <span className="text-red-500 ml-1 mt-1 block text-sm capitalize">
                {errors.description.message}
              </span>
            )}
          </div>
          <div>
            <label className="mb-4 block">Additional Info: </label>
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

            {errors.additionalInfo && (
              <span className="text-red-500 ml-1 mt-1 block text-sm capitalize">
                {errors.additionalInfo.message}
              </span>
            )}
          </div>

          {isEdit ? (
            <Button
              name={loading ? "Updating..." : "Update"}
              className="bg-blue-600! text-white rounded-lg  w-fit ml-auto"
            />
          ) : (
            <Button
              name={loading ? "Publishing..." : "Publish"}
              className="bg-green! text-white rounded-lg  w-fit ml-auto"
            />
          )}
        </form>
      </div>
    </div>
  );
}
