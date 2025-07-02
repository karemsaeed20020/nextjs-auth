'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  return (
    <div className="relative">
      <div className="relative  rounded-xl shadow-sm overflow-hidden border">
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={10}
          slidesPerView={1}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="rounded-xl h-full"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full aspect-square">
                <Image
                  src={img}
                  alt={`${productName} - Image ${idx + 1}`}
                  fill
                  className="object-contain p-10"
                  priority={idx === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          onClick={toggleFavorite}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full shadow-md transition-all ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-700'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="mt-4 px-2">
        <Swiper
          spaceBetween={8}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          className="thumbnail-slider"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <button
                onClick={() => setActiveIndex(idx)}
                className={`relative block w-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  activeIndex === idx ? 'border-blue-500' : 'border-transparent'
                }`}
                aria-label={`View ${productName} image ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                  unoptimized
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductGallery;