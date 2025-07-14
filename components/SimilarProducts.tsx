'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Product {
  id: number;
  name: string;
  image: string;
  price: string;
  rate_avg: string;
  rate_count: number;
}

interface Props {
  subCategoryId: number;
  currentId: number;
}

const SimilarProducts = ({ subCategoryId, currentId }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await fetch(`https://backend.outletplus.sa/api/products?sub_category_id=${subCategoryId}`);
        const data = await res.json();
        const filtered = data.data.filter((p: Product) => p.id !== currentId);
        setProducts(filtered.slice(0, 15));
      } catch (err) {
        console.error('Failed to load similar products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (subCategoryId) fetchSimilar();
  }, [subCategoryId, currentId]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (products.length === 0) return null;

  return (
    <section className="mt-2">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Similar Products</h3>

      <div className="relative pb-10">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          navigation
          pagination={{ clickable: true }}
          className="!pb-12"
          autoplay={{
            delay: 3000, 
            disableOnInteraction: false, 
            pauseOnMouseEnter: true, 
          }}
          loop={true}
          breakpoints={{
            320: { slidesPerView: 1.2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="border border-gray-200 rounded-lg p-4 shadow-lg hover:shadow-md transition">
                <div className="relative w-full h-40 mb-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <p className="text-sm font-semibold text-teal-400 line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </p>
                <div className="flex items-center gap-1 mt-0">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={`${
                        i < Math.round(Number(product.rate_avg))
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">({product.rate_count})</span>
                </div>
                <p className="text-sm font-bold text-teal-600 mt-2">
                  {Number(product.price).toFixed(2)} 
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <style jsx global>{`
          .swiper-pagination {
            bottom: 0 !important;
            text-align: center;
          }
          .swiper-pagination-bullet {
            background: #14b8a6;
            opacity: 0.5;
          }
          .swiper-pagination-bullet-active {
            background: #0f766e;
            opacity: 1;
          }
        `}</style>
      </div>
    </section>
  );
};

export default SimilarProducts;
