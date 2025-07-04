
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import axiosInstance from '@/lib/axios';
import ProductGallery from '@/components/ProductGallery';
import ProductInfo from '@/components/ProductInfo';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import ProductTabs from '@/components/ProductTabs';
import RateForm from '@/components/RateForm';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  barcode: string;
  rate_avg: string;
  rate_count: number;
  list_images: string[];
  brand_name: string;
  description?: string;
  category?: string;
  stock?: number;
  specifications?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rates: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rate_details: any[];
  is_rated: number;
  sub_category_id: number;
}

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchProduct = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      setProduct(res.data.data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id, fetchProduct]);

  if (loading) return <LoadingSpinner />;
  if (error || !product) return <ErrorDisplay error={error} />;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <ProductGallery 
            images={product.list_images.length > 0 ? product.list_images : [product.image]} 
            productName={product.name}
          />
          <ProductInfo product={product} />
        </div>

        <ProductTabs
          averageRating={parseFloat(product.rate_avg)}
          ratingCount={product.rate_count}
          rateDetails={product.rate_details}
          reviews={product.rates}
          specifications={product.specifications || ''}
          subCategoryId={product.sub_category_id}
          currentId={product.id}
        />


        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
         

          {token ? (
            product.is_rated === 0 ? (
              <RateForm 
                productId={product.id} 
                isRated={product.is_rated}
                setProduct={setProduct}
                onSubmitSuccess={() => fetchProduct()} 
              />
            ) : (
              <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-lg">
                <p className="text-green-700 font-medium">You have already reviewed this product</p>
              </div>
            )
          ) : (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex flex-col sm:flex-row items-center justify-between">
              <p className="text-blue-700 mb-2 sm:mb-0">Sign in to leave a review</p>
              <a 
                href="/login" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Sign In
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
