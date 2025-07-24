
'use client';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  setCart, 
  removeFromCart, 
  updateCartItem, 
  clearCart, 
} from '@/redux/cart/cartSlice';
import { CartData, CartProduct } from '@/types/cart';
import { CartEmptyState } from '@/components/cart/CartEmptyState';
import { CartLoadingSkeleton } from '@/components/cart/CartLoadingSkeleton';
import { CartProductItem } from '@/components/cart/CartProductItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { CartHeader } from '@/components/cart/CartHeader';
import { useCartCalculations } from '@/components/cart/hooks/useCartCalculations';

interface Coupon {
  id: number;
  code: string;
  type: 'fixed' | 'percentage';
  value: number;
  valid_until: string;
}

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [removing, setRemoving] = useState<number | null>(null);
  const [updatingQuantity, setUpdatingQuantity] = useState<{
    id: number | null;
    type: 'inc' | 'dec' | null;
  }>({ id: null, type: null });

  const totals = useCartCalculations(cartData);
  const hasCoupon = cartData?.coupon_id !== null;

  const fetchCart = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get('api/my-cart', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      
      const data = res.data.data;
      setCartData(data);
      
      const coupon: Coupon | null = data.coupon_id ? {
        id: data.coupon_id,
        code: data.coupon_code || `COUPON_${data.coupon_id}`,
        type: data.coupon_type as 'percentage' | 'fixed',
        value: parseFloat(data.coupon_value || '0'),
        valid_until: data.coupon_valid_until || new Date().toISOString()
      } : null;

      dispatch(setCart({
        items: data.products.map((product: CartProduct) => ({
          id: product.id,
          quantity: product.quantity || 1,
          price: parseFloat(product.offer_price) || parseFloat(product.price) || 0,
          name: product.name,
          image: product.image
        })),
        vatRatio: data.vat_ratio || '0',
        coupon: coupon
      }));
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingQuantity({ 
      id: productId, 
      type: newQuantity > (cartData?.products.find(p => p.id === productId)?.quantity || 1) 
        ? 'inc' 
        : 'dec' 
    });
    
    try {
      const updatedProducts = cartData?.products.map(product => 
        product.id === productId ? { ...product, quantity: newQuantity } : product
      ) || [];
      
      setCartData(prev => prev ? { ...prev, products: updatedProducts } : null);
      
      await axiosInstance.post('api/update-cart', {
        products: [{
          product_id: productId,
          quantity: newQuantity
        }]
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      
      dispatch(updateCartItem({
        id: productId,
        quantity: newQuantity
      }));
      
      toast.success('Quantity updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
      await fetchCart();
    } finally {
      setUpdatingQuantity({ id: null, type: null });
    }
  };

  const handleIncreaseQuantity = async (productId: number) => {
    const currentQuantity = cartData?.products.find(p => p.id === productId)?.quantity || 1;
    await handleUpdateQuantity(productId, currentQuantity + 1);
  };

  const handleDecreaseQuantity = async (productId: number) => {
    const currentQuantity = cartData?.products.find(p => p.id === productId)?.quantity || 1;
    if (currentQuantity <= 1) {
      await handleRemoveItem(productId);
      return;
    }
    await handleUpdateQuantity(productId, currentQuantity - 1);
  };

  const handleRemoveItem = async (productId: number) => {
    setRemoving(productId);
    try {
      const updatedProducts = cartData?.products.filter(product => product.id !== productId) || [];
      setCartData(prev => prev ? { ...prev, products: updatedProducts } : null);
      
      await axiosInstance.post(`api/remove-from-cart/${productId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      
      dispatch(removeFromCart(productId));
      toast.success('Item removed');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
      await fetchCart();
    } finally {
      setRemoving(null);
    }
  };

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
      await fetchCart();
    }
  };

  if (!token) {
    return <CartEmptyState isLoggedIn={false} />;
  }

  if (loading) {
    return <CartLoadingSkeleton />;
  }

  if (!cartData || cartData.products.length === 0) {
    return <CartEmptyState isLoggedIn={true} />;
  }

  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <CartHeader itemCount={cartData.products.length} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {cartData.products.map((product) => (
              <CartProductItem
                key={product.id}
                product={product}
                isUpdating={updatingQuantity.id === product.id}
                updatingType={updatingQuantity.type}
                onRemove={handleRemoveItem}
                onIncrease={handleIncreaseQuantity}
                onDecrease={handleDecreaseQuantity}
              />
            ))}
          </div>

          <CartSummary
            subtotal={totals.subtotal}
            vat={totals.vat}
            discount={totals.discount}
            total={totals.total}
            vatRate={cartData.vat_ratio || '0'}
            hasCoupon={hasCoupon}
            onCheckout={() => router.push('/checkout')}
            onClearCart={handleClearCart}
          />
        </div>
      </div>
    </div>
  );
}
