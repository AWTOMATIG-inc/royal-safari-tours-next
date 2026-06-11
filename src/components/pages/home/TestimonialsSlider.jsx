"use client";
import maskSrc from "@/assets/testimonials/srilanka.png";
import Rating from "@/components/Rating";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const brushMaskStyle = {
  maskImage: `url(${maskSrc.src})`,
  maskSize: "contain",
  maskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskImage: `url(${maskSrc.src})`,
  WebkitMaskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
};

export default function TestimonialsSlider({ items }) {
  return (
    <div className="relative md:px-8 lg:px-20 py-20">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={false}
        navigation={{
          nextEl: ".custom-next2",
          prevEl: ".custom-prev2",
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
      >
        {items.map((item) => (
          <SwiperSlide key={item._id}>
            <div className="grid md:grid-cols-[3fr_2fr] gap-10">
              <div>
                <Image
                  className="w-full h-full object-contain"
                  style={brushMaskStyle}
                  src={`/api/uploads/testimonials/${item.backgroundImage}`}
                  alt={item.country}
                  width={700}
                  height={500}
                />
              </div>
              <div className="grid place-items-center">
                <Image
                  className="max-w-[130px] md:max-w-[170px] md:max-h-[170px] object-cover rounded-full"
                  src={`/api/uploads/testimonials/${item.avatarImage}`}
                  alt={item.name}
                  width={170}
                  height={170}
                />
                <h2 className="text-lg md:text-xl font-bold mt-4 capitalize">
                  {item.country}
                </h2>
                <p className="py-4 text-center text-sm md:text-base">
                  &ldquo;{item.feedback}&rdquo;
                </p>
                <h5 className="font-semibold capitalize">{item.name}</h5>
                <Rating
                  rating={item.rating}
                  className="size-4 md:size-5 text-green mt-2"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="hidden md:flex gap-x-4 justify-between w-full absolute left-0 -translate-y-1/2 top-1/2 z-10">
        <button className="custom-prev2 cursor-pointer border rounded-full bg-green hoverEffect border-none">
          <Icon
            icon="solar:arrow-left-linear"
            width="25"
            height="25"
            className="relative right-4"
          />
        </button>
        <button className="custom-next2 cursor-pointer border rounded-full bg-green hoverEffect border-none">
          <Icon
            icon="solar:arrow-right-linear"
            width="25"
            height="25"
            className="relative left-4"
          />
        </button>
      </div>
    </div>
  );
}
