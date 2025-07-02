'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import ProductGallery from '@/components/ProductGallery';
import ProductInfo from '@/components/ProductInfo';
import ProductBreadcrumb from '@/components/ProductBreadcrumb';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import ProductTabs from '@/components/ProductTabs';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import RateForm from '@/components/RateForm';
import axiosInstance from '@/lib/axios';

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
    <section className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ProductBreadcrumb 
          category={product.category} 
          productName={product.name} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
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

        <RateForm productId={product.id} isRated={product.is_rated} />
      </div>
    </section>
  );
};

export default ProductDetails;
