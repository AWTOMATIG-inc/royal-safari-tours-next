"use client";

import frame from "@/assets/frame.png";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import Rating from "./Rating";

export default function TourCard({
  tour_package,
  showPrice = true,
  showLink = true,
  imageHeightClass = "h-[150px] sm:h-[200px] md:h-[462px]",
  ratingColor = "text-orange",
}) {
  if (!tour_package) return null;

  const imageUrl = tour_package.image?.startsWith("/")
    ? tour_package.image
    : `/api/uploads/tour-packages/${tour_package.image}`;

  const linkHref = tour_package.slug ? `/packages/${tour_package.slug}` : "#";

  const ImageContent = (
    <div className="max-w-[570px] relative block">
      <Image
        width={500}
        height={300}
        src={imageUrl}
        alt={tour_package.title || "Tour Package"}
        className={`w-full ${imageHeightClass} object-cover`}
      />
      <Image
        width={500}
        height={300}
        src={frame}
        alt="frame"
        className="absolute top-0 w-full h-full"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-md px-3 sm:px-4 pt-3 pb-5 shadow-sm hover:shadow-md transition-shadow">
      <div>
        {showLink && tour_package.slug ? (
          <Link href={linkHref} className="block">
            {ImageContent}
          </Link>
        ) : (
          ImageContent
        )}

        <div className="mt-2">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm xxs:text-base sm:text-xl capitalize">
              {tour_package.title}
            </h4>

            <Rating
              rating={tour_package.rating}
              className={`${ratingColor} size-3 sm:size-4 hidden sm:block`}
            />
          </div>

          <div>
            <Rating
              rating={tour_package.rating}
              className={`${ratingColor} size-3 sm:size-4 sm:hidden`}
            />

            {showPrice && tour_package.price != null && (
              <div className="flex gap-4 mt-2 text-sm sm:text-base">
                <p className="flex items-center">
                  <Icon icon="tabler:currency-taka" width="20" height="20" />
                  {tour_package.price}
                </p>

                {tour_package?.priceOff && (
                  <p className="line-through text-gray-400 flex items-center">
                    <Icon icon="tabler:currency-taka" width="20" height="20" />
                    {tour_package?.priceOff}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
