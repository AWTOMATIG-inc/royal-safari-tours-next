"use client";

import TourCard from "./TourCard";

export default function TourCard2({ tour_package }) {
  return (
    <TourCard
      tour_package={tour_package}
      showPrice={false}
      showLink={false}
      imageHeightClass="h-[150px] sm:h-[200px] md:h-[362px]"
      ratingColor="text-green"
    />
  );
}
