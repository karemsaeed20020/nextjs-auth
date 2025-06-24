"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import axiosInstance from "@/lib/axios";

interface SliderItem {
  id: number;
  slider_image: string;
}

const Slider = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [slides, setSlides] = useState<SliderItem[]>([]);

  useEffect(() => {
    if (!token) return;

    axiosInstance
      .get("api/sliders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setSlides(res.data.data))
      .catch((err) => console.error("Slider fetch error:", err));
  }, [token]);

  return (
    <div className="w-full">
      {slides.length === 0 ? (
        <p className="text-center text-muted-foreground">Not Found</p>
      ) : (
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          loop
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          modules={[Pagination, Navigation, Autoplay]}
          className="rounded-xl shadow-lg"
        >
          {slides.map((slide) =>
            slide.slider_image ? (
              <SwiperSlide key={slide.id}>
                <div className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] rounded-xl overflow-hidden">
                  <Image
                    src={slide.slider_image}
                    alt={`Slide ${slide.id}`}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              </SwiperSlide>
            ) : null
          )}
        </Swiper>
      )}
    </div>
  );
};

export default Slider;
