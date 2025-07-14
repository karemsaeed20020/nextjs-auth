'use client';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar, Autoplay } from 'swiper/modules'; 

import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay'; 

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative bg-white rounded-xl overflow-hidden">
        <Swiper
          modules={[Scrollbar, Autoplay]}
          scrollbar={{
            draggable: true,
            hide: false,
            snapOnRelease: true,
            dragSize: 'auto',
          }}
          autoplay={{
            delay: 3000, 
            disableOnInteraction: false,
            pauseOnMouseEnter: true, 
          }}
          spaceBetween={10}
          slidesPerView={1}
          className="h-full"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full aspect-square flex items-center justify-center p-4">
                <Image
                  src={img}
                  alt={`${productName} - Image ${idx + 1}`}
                  width={300}
                  height={300}
                  className="object-contain"
                  priority={idx === 0}
                  unoptimized
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-scrollbar {
          height: 4px !important;
          background: rgba(0, 0, 0, 0.1) !important;
          bottom: 10px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: 90% !important;
        }
        .swiper-scrollbar-drag {
          background: teal !important;
          height: 100% !important;
          border-radius: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default ProductGallery;
