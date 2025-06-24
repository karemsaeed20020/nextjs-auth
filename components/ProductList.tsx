'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ShoppingCart } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { Product, ProductListProps } from '@/types';

const PRODUCTS_PER_PAGE = 10;

const ProductList = ({ filters }: ProductListProps) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

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

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

  return (
    <div className="px-4">
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
            <div key={i} className="flex flex-col border rounded-xl shadow-sm bg-white animate-pulse h-full overflow-hidden">
              <div className="w-full aspect-[4/3] bg-gray-200" />
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
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col border rounded-xl shadow-sm bg-white hover:shadow-md transition overflow-hidden"
              >
                <div className="relative w-full aspect-[4/3] bg-gray-100">
                  <Image
                    src={
                      product.image?.startsWith('http')
                        ? product.image
                        : 'https://via.placeholder.com/300x200?text=No+Image'
                    }
                    alt={product.name || product.name_en || 'Product'}
                    fill
                    className="object-cover"
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
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2 flex-wrap">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 text-black"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 border rounded text-black  ${
                    page === i + 1 ? 'bg-blue-600 text-white' : ''
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 text-black"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
