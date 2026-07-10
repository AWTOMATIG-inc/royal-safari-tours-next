"use client";
import { Autoplay, FreeMode, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function GallerySlider({ items }) {
  return (
    <div className="py-8 hidden md:block">
      <div className="relative">
        <Swiper
          modules={[FreeMode, Navigation, Pagination, Autoplay]}
          slidesPerView={3}
          loop={true}
          spaceBetween={10}
          autoplay={{ delay: 0, disableOnInteraction: false }}
          pagination={false}
          freeMode={true}
          speed={4000}
          breakpoints={{
            1024: { slidesPerView: 4, spaceBetween: 10 },
            1280: { slidesPerView: 5, spaceBetween: 10 },
            1536: { slidesPerView: 6, spaceBetween: 20 },
          }}
        >
          {items.map((item) => (
            <SwiperSlide key={item._id}>
              <div>
                <img
                  className="w-full h-[350px] object-cover"
                  src={`/api/uploads/gallery/${item.filename}`}
                  alt="gallery"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
