'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ShoppingCart } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { Product, ProductListProps } from '@/types';
import { Pagination } from 'antd';
import { useRouter } from 'next/navigation';

const PRODUCTS_PER_PAGE = 10;

const ProductList = ({ filters }: ProductListProps) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [products, setProducts] = useState<Product[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png';

  useEffect(() => {
    setPage(1);
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const params: Record<string, string> = {
          skip: String((page - 1) * PRODUCTS_PER_PAGE),
          take: String(PRODUCTS_PER_PAGE),
          sort:
            filters?.price === 'low'
              ? 'price'
              : filters?.price === 'high'
              ? '-price'
              : '-price',
        };

        if (filters?.brandIds?.length) {
          params['filter[brand_id]'] = filters.brandIds.join(',');
        }

        if (filters?.subCategoryIds?.length) {
          params['filter[sub_category_id]'] = filters.subCategoryIds.join(',');
        }

        if (filters?.rating) {
          params['filter[rates_avg_value]'] = String(filters.rating);
        }

        const res = await axiosInstance('api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          params,
        });

        setProducts(res.data.data || []);
        setTotal(res.data.count || 0);
        setImageErrors({});
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token, page, filters]);

  const handleImageError = (id: number) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="px-4">
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-xl shadow bg-white animate-pulse h-full overflow-hidden"
            >
              <div className="w-full aspect-[4/3] bg-gray-200 rounded-t-xl" />
              <div className="flex-1 p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-300 rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-red-600 mt-4">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const imageUrl = imageErrors[product.id]
                ? fallbackImage
                : product.image || fallbackImage;

              return (
                <div
                  key={product.id}
                   onClick={() => router.push(`/products/${product.id}`)}
                  className="flex flex-col rounded-xl shadow bg-white hover:shadow-md transition overflow-hidden"
                >
                  <div className="p-3 bg-gray-100 rounded-t-xl">
                    <Image
                      src={imageUrl}
                      alt={product.name || product.name_en || 'Product'}
                      width={300}
                      height={200}
                      unoptimized
                      className="object-cover w-full h-[200px] rounded"
                      onError={() => handleImageError(product.id)}
                    />
                  </div>

                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-sm text-gray-800 line-clamp-2 mb-1">
                        {product.name || product.name_en || 'Unnamed'}
                      </p>
                      <p className="text-blue-600 font-bold text-sm">
                        {product.price} <span className="text-xs">SAR</span>
                      </p>
                    </div>

                    <button className="mt-4 w-full bg-blue-600 text-white py-2 text-sm rounded hover:bg-blue-700 transition flex items-center justify-center gap-2">
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center items-center">
            <Pagination
              current={page}
              total={total}
              pageSize={PRODUCTS_PER_PAGE}
              onChange={(newPage) => setPage(newPage)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
