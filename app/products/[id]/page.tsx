
'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import axiosInstance from '@/lib/axios';

import ProductGallery from '@/components/ProductGallery';
import ProductInfo from '@/components/ProductInfo';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import ProductTabs from '@/components/ProductTabs';

import { setProductData, resetProduct } from '@/redux/product/productSlice';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.auth.token);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = token ? {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      } : { Accept: 'application/json' };

      const res = await axiosInstance.get(`api/products/${id}`, { headers });

      const fetchedProduct = res.data.data;
      setProduct(fetchedProduct);

      dispatch(setProductData({
        productId: fetchedProduct.id,
        rate_avg: fetchedProduct.rate_avg,
        rate_count: fetchedProduct.rate_count,
        rates: fetchedProduct.rates,
        rate_details: fetchedProduct.rate_details,
        is_rated: fetchedProduct.is_rated,
      }));
    } catch {
      setError('Failed to load product details.');
    } finally {
      setLoading(false);
    }
  }, [id, token, dispatch]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }

    return () => {
      dispatch(resetProduct());
    };
  }, [id, fetchProduct, dispatch]);

  if (loading) return <LoadingSpinner />;
  if (error || !product) return <ErrorDisplay error={error || 'Product not found'} />;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ProductGallery
            images={product.list_images.length > 0 ? product.list_images : [product.image]}
            productName={product.name}
          />
          <ProductInfo product={product} />
        </div>

        {token && (
          <ProductTabs
            specifications={product.specifications || ''}
            subCategoryId={product.sub_category_id}
            currentId={product.id}
            averageRating={parseFloat(product.rate_avg)}
            ratingCount={product.rate_count}
            rateDetails={product.rate_details}
            reviews={product.rates} 
            isRated={product.is_rated}
            token={token}
            setProduct={setProduct}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
