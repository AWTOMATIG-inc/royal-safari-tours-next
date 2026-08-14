"use client";
import Button from "@/components/Button";
import { locationYupSchema } from "@/yup/locationYupSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function TourLocationForm({ location }) {
  const [loading, setLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const path = usePathname();
  const isEdit = path.includes("edit");
  const router = useRouter();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      country: location?.country || "",
      image: [],
    },
    resolver: yupResolver(locationYupSchema(isEdit)),
  });
  //for submitting the form
  const onSubmit = async (e) => {
    const formData = new FormData();
    formData.append("country", e.country);
    if (e.image && e.image.length > 0) {
      formData.append("image", e.image[0]);
    }
    setLoading(true);

    if (isEdit) {
      formData.append("existingImage", location.image);

      try {
        const res = await fetch(`/api/tour-location/${location?._id}`, {
          method: "PUT",
          body: formData,
        });
        const data = await res.json();
        if (data) {
          reset({
            country: "",
            image: [],
          });
          setLoading(false);
          setIsRefresh(!isRefresh);
          toast.success("Tour location updated successfully!");
          router.push("/dashboard/tour-locations");
        }
      } catch (error) {
        toast.error(error.message);
        console.error("Error updating tour location:", error);
      }
    } else {
      try {
        const res = await fetch("/api/tour-location", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data) {
          reset();
          setLoading(false);
          setIsRefresh(!isRefresh);
          toast.success("Tour location created successfully!");
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
        <div className="flex justify-between items-center gap-4 mt-8">
          <h1 className="text-2xl font-bold">
            {isEdit ? "Update" : "Create new"} tour locations
          </h1>
          <Link
            className="bg-orange text-white px-4 py-2 rounded-xl text-nowrap"
            href="/dashboard/tour-locations"
          >
            {" "}
            See locations
          </Link>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-y-8 mt-8"
          action="#"
        >
          <div>
            <label htmlFor="" className="mb-1 block">
              Country:
            </label>
            <input
              type="text"
              className="border border-gray-500 p-4 rounded-md w-full block"
              placeholder="Country"
              {...register("country")}
            />
            {errors.country && (
              <p className="text-red-500 ml-1 mt-1 block text-sm capitalize ">
                {errors.country.message}
              </p>
            )}
          </div>
         
          <div>
            <label htmlFor="" className="mb-1 block">
              Tour Location Image:
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
