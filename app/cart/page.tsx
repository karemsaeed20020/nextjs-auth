  // // src/app/cart/page.tsx
  // 'use client';

  // import { useEffect, useState } from 'react';
  // import { useSelector, useDispatch } from 'react-redux';
  // import { RootState } from '@/redux/store';
  // import axiosInstance from '@/lib/axios';
  // import Image from 'next/image';
  // import { Trash2, ShoppingCart, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
  // import Link from 'next/link';
  // import { useRouter } from 'next/navigation';
  // import { setCart, removeFromCart, updateCartItem, clearCart, applyCoupon, removeCoupon } from '@/redux/cart/cartSlice';
  // import { toast } from 'react-hot-toast';

  // interface CartProduct {
  //   id: number;
  //   image: string;
  //   name: string;
  //   quantity: number;
  //   brand_name: string;
  //   price: string;
  //   offer_price: string;
  //   is_favorite: number;
  //   list_images: string[];
  //   specifications: string;
  // }

  // interface CartData {
  //   id: number;
  //   vat_ratio: string;
  //   coupon_id: number | null;
  //   coupon_type: string | null;
  //   coupon_value: string | null;
  //   products: CartProduct[];
  // }

  // export default function CartPage() {
  //   const router = useRouter();
  //   const dispatch = useDispatch();
  //   const token = useSelector((state: RootState) => state.auth.token);
  //   const [cartData, setCartData] = useState<CartData | null>(null);
  //   const [loading, setLoading] = useState(true);
  //   const [updating, setUpdating] = useState<number | null>(null);
  //   const [removing, setRemoving] = useState<number | null>(null);
  //   const [couponCode, setCouponCode] = useState('');
  //   const [isCouponApplied, setIsCouponApplied] = useState(false);

  //   const fetchCart = async () => {
  //     if (!token) return;
  //     setLoading(true);
  //     try {
  //       const res = await axiosInstance.get('api/my-cart', {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           Accept: 'application/json',
  //         },
  //       });
        
  //       const data = res.data.data;
  //       setCartData(data);
  //       setIsCouponApplied(data.coupon_id !== null);
        
  //       dispatch(setCart({
  //         items: data.products.map((product: CartProduct) => ({
  //           id: product.id,
  //           quantity: product.quantity
  //         })),
  //         vatRatio: data.vat_ratio,
  //         couponId: data.coupon_id,
  //         couponType: data.coupon_type,
  //         couponValue: data.coupon_value
  //       }));
  //     } catch (error) {
  //       console.error('Error fetching cart:', error);
  //       toast.error('Failed to load cart');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchCart();
  //   }, [token]);

  //   const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
  //     if (newQuantity < 1) return;
      
  //     setUpdating(productId);
  //     try {
  //       await axiosInstance.post('api/update-cart', {
  //         products: [{
  //           product_id: productId,
  //           quantity: newQuantity
  //         }]
  //       }, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           Accept: 'application/json',
  //         },
  //       });
        
  //       dispatch(updateCartItem({id: productId, quantity: newQuantity}));
  //       await fetchCart();
  //       toast.success('Quantity updated');
  //     } catch (error) {
  //       console.error('Error updating cart:', error);
  //       toast.error('Failed to update quantity');
  //     } finally {
  //       setUpdating(null);
  //     }
  //   };

  //   const handleRemoveItem = async (productId: number) => {
  //     setRemoving(productId);
  //     try {
  //       await axiosInstance.post(`api/remove-from-cart/${productId}`, {}, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           Accept: 'application/json',
  //         },
  //       });
        
  //       dispatch(removeFromCart(productId));
  //       await fetchCart();
  //       toast.success('Item removed');
  //     } catch (error) {
  //       console.error('Error removing item:', error);
  //       toast.error('Failed to remove item');
  //     } finally {
  //       setRemoving(null);
  //     }
  //   };

  //   const handleApplyCoupon = async () => {
  //     if (!couponCode.trim()) {
  //       toast.error('Please enter a coupon code');
  //       return;
  //     }
      
  //     try {
  //       const res = await axiosInstance.post('api/apply-coupon', {
  //         coupon_code: couponCode
  //       }, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           Accept: 'application/json',
  //         },
  //       });
        
  //       const coupon = res.data.data;
  //       dispatch(applyCoupon({
  //         couponId: coupon.id,
  //         couponType: coupon.type,
  //         couponValue: coupon.value
  //       }));
  //       await fetchCart();
  //       toast.success('Coupon applied');
  //       setCouponCode('');
  //     } catch (error) {
  //       console.error('Error applying coupon:', error);
  //       toast.error(error.response?.data?.message || 'Invalid coupon code');
  //     }
  //   };

  //   const handleRemoveCoupon = async () => {
  //     try {
  //       await axiosInstance.post('api/remove-coupon', {}, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           Accept: 'application/json',
  //         },
  //       });
        
  //       dispatch(removeCoupon());
  //       await fetchCart();
  //       toast.success('Coupon removed');
  //     } catch (error) {
  //       console.error('Error removing coupon:', error);
  //       toast.error('Failed to remove coupon');
  //     }
  //   };

  //   const calculateTotals = () => {
  //     if (!cartData) return null;
      
  //     const subtotal = cartData.products.reduce((sum, product) => {
  //       const price = product.offer_price && parseFloat(product.offer_price) > 0 
  //         ? parseFloat(product.offer_price) 
  //         : parseFloat(product.price);
  //       return sum + (price * product.quantity);
  //     }, 0);
      
  //     const vatAmount = subtotal * (parseFloat(cartData.vat_ratio) / 100);
  //     const discount = cartData.coupon_value 
  //       ? cartData.coupon_type === 'percentage'
  //         ? subtotal * (parseFloat(cartData.coupon_value) / 100)
  //         : parseFloat(cartData.coupon_value)
  //       : 0;
      
  //     const total = subtotal + vatAmount - discount;
      
  //     return {
  //       subtotal: subtotal.toFixed(2),
  //       vat: vatAmount.toFixed(2),
  //       discount: discount.toFixed(2),
  //       total: total.toFixed(2)
  //     };
  //   };

  //   const totals = calculateTotals();

  //   if (!token) {
  //     return (
  //       <div className="bg-white min-h-screen py-12 px-4">
  //         <div className="max-w-md mx-auto text-center">
  //           <ShoppingCart size={64} className="mx-auto text-gray-400 mb-6" />
  //           <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
  //           <p className="text-gray-600 mb-8">Please login to view your cart</p>
  //           <button 
  //             onClick={() => router.push('/login')}
  //             className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
  //           >
  //             Login to Continue
  //           </button>
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (loading) {
  //     return (
  //       <div className="bg-white min-h-screen py-12 px-4">
  //         <div className="max-w-7xl mx-auto">
  //           <div className="animate-pulse space-y-8">
  //             <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
  //             {[...Array(3)].map((_, i) => (
  //               <div key={i} className="flex gap-6 p-6 border border-gray-200 rounded-lg">
  //                 <div className="w-32 h-32 bg-gray-200 rounded"></div>
  //                 <div className="flex-1 space-y-4">
  //                   <div className="h-5 bg-gray-200 rounded w-3/4"></div>
  //                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  //                   <div className="flex gap-4">
  //                     <div className="h-10 bg-gray-200 rounded w-24"></div>
  //                     <div className="h-10 bg-gray-200 rounded w-32"></div>
  //                   </div>
  //                 </div>
  //               </div>
  //             ))}
  //             <div className="h-40 bg-gray-200 rounded-lg"></div>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (!cartData || cartData.products.length === 0) {
  //     return (
  //       <div className="bg-white min-h-screen py-12 px-4">
  //         <div className="max-w-md mx-auto text-center">
  //           <ShoppingCart size={64} className="mx-auto text-gray-400 mb-6" />
  //           <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
  //           <p className="text-gray-600 mb-8">Looks like you haven't added any items yet</p>
  //           <button 
  //             onClick={() => router.push('/products')}
  //             className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
  //           >
  //             Continue Shopping
  //           </button>
  //         </div>
  //       </div>
  //     );
  //   }

  //   return (
  //     <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
  //       <div className="max-w-7xl mx-auto">
  //         <div className="mb-8">
  //           <button 
  //             onClick={() => router.back()}
  //             className="flex items-center text-gray-700 hover:text-black transition"
  //           >
  //             <ArrowLeft size={20} className="mr-2" />
  //             Continue Shopping
  //           </button>
  //         </div>

  //         <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart ({cartData.products.length})</h1>

  //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  //           <div className="lg:col-span-2 space-y-6">
  //             {cartData.products.map((product) => (
  //               <div key={product.id} className="flex flex-col sm:flex-row gap-6 p-6 border border-gray-200 rounded-lg">
  //                 <div className="relative w-full sm:w-40 h-40 bg-gray-100 rounded-lg overflow-hidden">
  //                   <Image
  //                     src={product.image || '/placeholder-product.jpg'}
  //                     alt={product.name}
  //                     fill
  //                     className="object-contain"
  //                     sizes="(max-width: 640px) 100vw, 160px"
  //                   />
  //                 </div>
                  
  //                 <div className="flex-1 flex flex-col">
  //                   <div className="flex justify-between items-start">
  //                     <div>
  //                       <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
  //                       <p className="text-sm text-gray-600 mt-1">{product.brand_name}</p>
  //                     </div>
  //                     <button 
  //                       onClick={() => handleRemoveItem(product.id)}
  //                       disabled={removing === product.id}
  //                       className="text-gray-400 hover:text-red-500 transition"
  //                       aria-label="Remove item"
  //                     >
  //                       {removing === product.id ? (
  //                         <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
  //                       ) : (
  //                         <Trash2 size={20} />
  //                       )}
  //                     </button>
  //                   </div>

  //                   <div className="mt-4 flex items-center justify-between">
  //                     <div className="flex items-center gap-2">
  //                       <button
  //                         onClick={() => handleUpdateQuantity(product.id, product.quantity - 1)}
  //                         disabled={product.quantity <= 1 || updating === product.id}
  //                         className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition"
  //                         aria-label="Decrease quantity"
  //                       >
  //                         <ChevronDown size={16} />
  //                       </button>
  //                       <span className="w-12 text-center text-gray-900 font-medium">
  //                         {updating === product.id ? (
  //                           <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
  //                         ) : (
  //                           product.quantity
  //                         )}
  //                       </span>
  //                       <button
  //                         onClick={() => handleUpdateQuantity(product.id, product.quantity + 1)}
  //                         disabled={updating === product.id}
  //                         className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition"
  //                         aria-label="Increase quantity"
  //                       >
  //                         <ChevronUp size={16} />
  //                       </button>
  //                     </div>

  //                     <div className="text-right">
  //                       {product.offer_price && parseFloat(product.offer_price) > 0 ? (
  //                         <>
  //                           <span className="text-gray-500 line-through mr-2 text-sm">
  //                             {parseFloat(product.price).toFixed(2)} SAR
  //                           </span>
  //                           <span className="font-bold text-gray-900">
  //                             {parseFloat(product.offer_price).toFixed(2)} SAR
  //                           </span>
  //                         </>
  //                       ) : (
  //                         <span className="font-bold text-gray-900">
  //                           {parseFloat(product.price).toFixed(2)} SAR
  //                         </span>
  //                       )}
  //                     </div>
  //                   </div>
  //                 </div>
  //               </div>
  //             ))}

  //             <div className="flex justify-end pt-4">
  //               <button
  //                 onClick={() => {
  //                   if (confirm('Are you sure you want to clear your cart?')) {
  //                     dispatch(clearCart());
  //                     fetchCart();
  //                   }
  //                 }}
  //                 className="text-red-600 hover:text-red-800 flex items-center gap-2 transition"
  //               >
  //                 <Trash2 size={18} />
  //                 Clear Cart
  //               </button>
  //             </div>
  //           </div>

  //           <div className="lg:col-span-1">
  //             <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
  //               <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

  //               {isCouponApplied ? (
  //                 <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
  //                   <div className="flex justify-between items-center">
  //                     <div>
  //                       <p className="text-green-800 font-medium">Coupon Applied</p>
  //                       <p className="text-green-600 text-sm">
  //                         {cartData.coupon_type === 'percentage' 
  //                           ? `${cartData.coupon_value}% off` 
  //                           : `${cartData.coupon_value} SAR off`}
  //                       </p>
  //                     </div>
  //                     <button 
  //                       onClick={handleRemoveCoupon}
  //                       className="text-green-600 hover:text-green-800 text-sm font-medium transition"
  //                     >
  //                       Remove
  //                     </button>
  //                   </div>
  //                 </div>
  //               ) : (
  //                 <div className="mb-6">
  //                   <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
  //                     Apply Coupon
  //                   </label>
  //                   <div className="flex gap-2">
  //                     <input
  //                       type="text"
  //                       id="coupon"
  //                       value={couponCode}
  //                       onChange={(e) => setCouponCode(e.target.value)}
  //                       placeholder="Enter coupon code"
  //                       className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-black focus:border-black"
  //                     />
  //                     <button
  //                       onClick={handleApplyCoupon}
  //                       disabled={!couponCode.trim()}
  //                       className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
  //                     >
  //                       Apply
  //                     </button>
  //                   </div>
  //                 </div>
  //               )}

  //               <div className="space-y-4 mb-6">
  //                 <div className="flex justify-between">
  //                   <span className="text-gray-600">Subtotal</span>
  //                   <span className="font-medium text-gray-900">{totals?.subtotal} SAR</span>
  //                 </div>
  //                 <div className="flex justify-between">
  //                   <span className="text-gray-600">VAT ({cartData.vat_ratio}%)</span>
  //                   <span className="font-medium text-gray-900">{totals?.vat} SAR</span>
  //                 </div>
  //                 {isCouponApplied && (
  //                   <div className="flex justify-between text-green-600">
  //                     <span>Discount</span>
  //                     <span className="font-medium">-{totals?.discount} SAR</span>
  //                   </div>
  //                 )}
  //                 <div className="border-t border-gray-200 pt-4 flex justify-between">
  //                   <span className="font-bold text-gray-900">Total</span>
  //                   <span className="font-bold text-gray-900 text-xl">
  //                     {totals?.total} SAR
  //                   </span>
  //                 </div>
  //               </div>

  //               <button 
  //                 onClick={() => router.push('/checkout')}
  //                 className="w-full py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition"
  //               >
  //                 Proceed to Checkout
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

//   'use client';

// import { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '@/redux/store';
// import axiosInstance from '@/lib/axios';
// import Image from 'next/image';
// import { Trash2, ShoppingCart, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-hot-toast';
// import { 
//   setCart, 
//   removeFromCart, 
//   updateCartItem, 
//   clearCart, 
//   applyCoupon, 
//   removeCoupon 
// } from '@/redux/cart/cartSlice';

// interface CartProduct {
//   id: number;
//   image: string;
//   name: string;
//   quantity: number;
//   brand_name: string;
//   price: string;
//   offer_price: string;
// }

// interface CartData {
//   id: number;
//   vat_ratio: string;
//   coupon_id: number | null;
//   coupon_type: string | null;
//   coupon_value: string | null;
//   products: CartProduct[];
// }

// export default function CartPage() {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const token = useSelector((state: RootState) => state.auth.token);
//   const [cartData, setCartData] = useState<CartData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState<number | null>(null);
//   const [removing, setRemoving] = useState<number | null>(null);
//   const [couponCode, setCouponCode] = useState('');
//   const [isCouponApplied, setIsCouponApplied] = useState(false);

//   const fetchCart = async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get('api/my-cart', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       const data = res.data.data;
//       setCartData(data);
//       setIsCouponApplied(data.coupon_id !== null);
      
//       dispatch(setCart({
//         items: data.products.map((product: CartProduct) => ({
//           id: product.id,
//           quantity: product.quantity || 1,
//           price: parseFloat(product.offer_price) || parseFloat(product.price) || 0,
//           name: product.name,
//           image: product.image
//         })),
//         vatRatio: data.vat_ratio || '0',
//         couponId: data.coupon_id,
//         couponType: data.coupon_type,
//         couponValue: data.coupon_value
//       }));
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//       toast.error('Failed to load cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, [token]);

//   const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
//     if (newQuantity < 1) {
//       toast.error('Quantity cannot be less than 1');
//       return;
//     }

//     setUpdating(productId);
//     try {
//       const response = await axiosInstance.post(
//         'api/update-cart',
//         {
//           products: [
//             {
//               product_id: productId,
//               quantity: newQuantity
//             }
//           ]
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: 'application/json',
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (!response.data.status) {
//         throw new Error(response.data.message || 'Failed to update quantity');
//       }

//       dispatch(updateCartItem({ id: productId, quantity: newQuantity }));
//       await fetchCart();
//       toast.success('Quantity updated successfully');
//     } catch (error) {
//       console.error('Update quantity error:', error);
//       const errorMessage = error.response?.data?.message || 
//                           error.message || 
//                           'Failed to update quantity';
//       toast.error(errorMessage);
//       await fetchCart(); // Refresh to show correct quantity
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const handleRemoveItem = async (productId: number) => {
//     setRemoving(productId);
//     try {
//       await axiosInstance.post(`api/remove-from-cart/${productId}`, {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       dispatch(removeFromCart(productId));
//       await fetchCart();
//       toast.success('Item removed');
//     } catch (error) {
//       console.error('Error removing item:', error);
//       toast.error('Failed to remove item');
//     } finally {
//       setRemoving(null);
//     }
//   };

//   const handleApplyCoupon = async () => {
//     if (!couponCode.trim()) {
//       toast.error('Please enter a coupon code');
//       return;
//     }
    
//     try {
//       const res = await axiosInstance.post('api/apply-coupon', {
//         coupon_code: couponCode
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       const coupon = res.data.data;
//       dispatch(applyCoupon({
//         couponId: coupon.id,
//         couponType: coupon.type,
//         couponValue: coupon.value.toString()
//       }));
//       await fetchCart();
//       toast.success('Coupon applied');
//       setCouponCode('');
//     } catch (error) {
//       console.error('Error applying coupon:', error);
//       toast.error(error.response?.data?.message || 'Invalid coupon code');
//     }
//   };

//   const handleRemoveCoupon = async () => {
//     try {
//       await axiosInstance.post('api/remove-coupon', {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       dispatch(removeCoupon());
//       await fetchCart();
//       toast.success('Coupon removed');
//     } catch (error) {
//       console.error('Error removing coupon:', error);
//       toast.error('Failed to remove coupon');
//     }
//   };

//   const calculateTotals = () => {
//     if (!cartData || !cartData.products || cartData.products.length === 0) {
//       return {
//         subtotal: '0.00',
//         vat: '0.00',
//         discount: '0.00',
//         total: '0.00'
//       };
//     }

//     const vatRatio = parseFloat(cartData.vat_ratio) || 0;
    
//     const subtotal = cartData.products.reduce((sum, product) => {
//       const price = parseFloat(product.offer_price) || parseFloat(product.price) || 0;
//       const quantity = product.quantity || 0;
//       return sum + (price * quantity);
//     }, 0);

//     let discount = 0;
//     if (cartData.coupon_value) {
//       const couponValue = parseFloat(cartData.coupon_value) || 0;
//       discount = cartData.coupon_type === 'percentage'
//         ? subtotal * (couponValue / 100)
//         : couponValue;
//     }

//     const vatAmount = subtotal * (vatRatio / 100);
//     const total = subtotal + vatAmount - discount;
    
//     return {
//       subtotal: subtotal.toFixed(2),
//       vat: vatAmount.toFixed(2),
//       discount: discount.toFixed(2),
//       total: total.toFixed(2)
//     };
//   };

//   const totals = calculateTotals();

//   if (!token) {
//     return (
//       <div className="bg-white min-h-screen py-12 px-4">
//         <div className="max-w-md mx-auto text-center">
//           <ShoppingCart size={64} className="mx-auto text-gray-400 mb-6" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
//           <p className="text-gray-600 mb-8">Please login to view your cart</p>
//           <button 
//             onClick={() => router.push('/login')}
//             className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//           >
//             Login to Continue
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="bg-white min-h-screen py-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="animate-pulse space-y-8">
//             <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="flex gap-6 p-6 border border-gray-200 rounded-lg">
//                 <div className="w-32 h-32 bg-gray-200 rounded"></div>
//                 <div className="flex-1 space-y-4">
//                   <div className="h-5 bg-gray-200 rounded w-3/4"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                   <div className="flex gap-4">
//                     <div className="h-10 bg-gray-200 rounded w-24"></div>
//                     <div className="h-10 bg-gray-200 rounded w-32"></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             <div className="h-40 bg-gray-200 rounded-lg"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!cartData || cartData.products.length === 0) {
//     return (
//       <div className="bg-white min-h-screen py-12 px-4">
//         <div className="max-w-md mx-auto text-center">
//           <ShoppingCart size={64} className="mx-auto text-gray-400 mb-6" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
//           <p className="text-gray-600 mb-8">Looks like you haven't added any items yet</p>
//           <button 
//             onClick={() => router.push('/products')}
//             className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//           >
//             Continue Shopping
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <button 
//             onClick={() => router.back()}
//             className="flex items-center text-gray-700 hover:text-black transition"
//           >
//             <ArrowLeft size={20} className="mr-2" />
//             Continue Shopping
//           </button>
//         </div>

//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart ({cartData.products.length})</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6">
//             {cartData.products.map((product) => {
//               const price = parseFloat(product.offer_price) || parseFloat(product.price) || 0;
//               const originalPrice = product.offer_price ? parseFloat(product.price) : null;
              
//               return (
//                 <div key={product.id} className="flex flex-col sm:flex-row gap-6 p-6 border border-gray-200 rounded-lg">
//                   <div className="relative w-full sm:w-40 h-40 bg-gray-100 rounded-lg overflow-hidden">
//                     <Image
//                       src={product.image || '/placeholder-product.jpg'}
//                       alt={product.name}
//                       fill
//                       className="object-contain"
//                       sizes="(max-width: 640px) 100vw, 160px"
//                     />
//                   </div>
                  
//                   <div className="flex-1 flex flex-col">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
//                         <p className="text-sm text-gray-600 mt-1">{product.brand_name}</p>
//                       </div>
//                       <button 
//                         onClick={() => handleRemoveItem(product.id)}
//                         disabled={removing === product.id}
//                         className="text-gray-400 hover:text-red-500 transition"
//                       >
//                         {removing === product.id ? (
//                           <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
//                         ) : (
//                           <Trash2 size={20} />
//                         )}
//                       </button>
//                     </div>

//                     <div className="mt-4 flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => handleUpdateQuantity(product.id, product.quantity - 1)}
//                           disabled={product.quantity <= 1 || updating === product.id}
//                           className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition"
//                         >
//                           {updating === product.id ? (
//                             <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
//                           ) : (
//                             <ChevronDown size={16} />
//                           )}
//                         </button>
//                         <span className="w-12 text-center text-gray-900 font-medium">
//                           {product.quantity}
//                         </span>
//                         <button
//                           onClick={() => handleUpdateQuantity(product.id, product.quantity + 1)}
//                           disabled={updating === product.id}
//                           className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition"
//                         >
//                           {updating === product.id ? (
//                             <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
//                           ) : (
//                             <ChevronUp size={16} />
//                           )}
//                         </button>
//                       </div>

//                       <div className="text-right">
//                         {originalPrice ? (
//                           <>
//                             <span className="text-gray-500 line-through mr-2 text-sm">
//                               {originalPrice.toFixed(2)} SAR
//                             </span>
//                             <span className="font-bold text-gray-900">
//                               {price.toFixed(2)} SAR
//                             </span>
//                           </>
//                         ) : (
//                           <span className="font-bold text-gray-900">
//                             {price.toFixed(2)} SAR
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}

//             <div className="flex justify-end pt-4">
//               <button
//                 onClick={() => {
//                   if (confirm('Are you sure you want to clear your cart?')) {
//                     dispatch(clearCart());
//                     fetchCart();
//                   }
//                 }}
//                 className="text-red-600 hover:text-red-800 flex items-center gap-2 transition"
//               >
//                 <Trash2 size={18} />
//                 Clear Cart
//               </button>
//             </div>
//           </div>

//           <div className="lg:col-span-1">
//             <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
//               <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

//               {isCouponApplied ? (
//                 <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <p className="text-green-800 font-medium">Coupon Applied</p>
//                       <p className="text-green-600 text-sm">
//                         {cartData.coupon_type === 'percentage' 
//                           ? `${cartData.coupon_value}% off` 
//                           : `${cartData.coupon_value} SAR off`}
//                       </p>
//                     </div>
//                     <button 
//                       onClick={handleRemoveCoupon}
//                       className="text-green-600 hover:text-green-800 text-sm font-medium transition"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="mb-6">
//                   <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
//                     Apply Coupon
//                   </label>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       id="coupon"
//                       value={couponCode}
//                       onChange={(e) => setCouponCode(e.target.value)}
//                       placeholder="Enter coupon code"
//                       className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-black focus:border-black"
//                     />
//                     <button
//                       onClick={handleApplyCoupon}
//                       disabled={!couponCode.trim()}
//                       className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
//                     >
//                       Apply
//                     </button>
//                   </div>
//                 </div>
//               )}

//               <div className="space-y-4 mb-6">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span className="font-medium text-gray-900">{totals.subtotal} SAR</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">VAT ({parseFloat(cartData.vat_ratio || '0')}%)</span>
//                   <span className="font-medium text-gray-900">{totals.vat} SAR</span>
//                 </div>
//                 {isCouponApplied && (
//                   <div className="flex justify-between text-green-600">
//                     <span>Discount</span>
//                     <span className="font-medium">-{totals.discount} SAR</span>
//                   </div>
//                 )}
//                 <div className="border-t border-gray-200 pt-4 flex justify-between">
//                   <span className="font-bold text-gray-900">Total</span>
//                   <span className="font-bold text-gray-900 text-xl">
//                     {totals.total} SAR
//                   </span>
//                 </div>
//               </div>

//               <button 
//                 onClick={() => router.push('/checkout')}
//                 className="w-full py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition"
//               >
//                 Proceed to Checkout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '@/redux/store';
// import axiosInstance from '@/lib/axios';
// import Image from 'next/image';
// import { Trash2, ShoppingCart, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-hot-toast';
// import { 
//   setCart, 
//   removeFromCart, 
//   updateCartItem, 
//   clearCart, 
//   applyCoupon, 
//   removeCoupon 
// } from '@/redux/cart/cartSlice';

// interface CartProduct {
//   id: number;
//   image: string;
//   name: string;
//   quantity: number;
//   brand_name: string;
//   price: string;
//   offer_price: string;
// }

// interface CartData {
//   id: number;
//   vat_ratio: string;
//   coupon_id: number | null;
//   coupon_type: string | null;
//   coupon_value: string | null;
//   products: CartProduct[];
// }

// export default function CartPage() {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const token = useSelector((state: RootState) => state.auth.token);
//   const [cartData, setCartData] = useState<CartData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [removing, setRemoving] = useState<number | null>(null);
//   const [couponCode, setCouponCode] = useState('');
//   const [isCouponApplied, setIsCouponApplied] = useState(false);
//   const [updatingIncrease, setUpdatingIncrease] = useState<number | null>(null);
//   const [updatingDecrease, setUpdatingDecrease] = useState<number | null>(null);

//   const fetchCart = async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get('api/my-cart', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       const data = res.data.data;
//       setCartData(data);
//       setIsCouponApplied(data.coupon_id !== null);
      
//       dispatch(setCart({
//         items: data.products.map((product: CartProduct) => ({
//           id: product.id,
//           quantity: product.quantity || 1,
//           price: parseFloat(product.offer_price) || parseFloat(product.price) || 0,
//           name: product.name,
//           image: product.image
//         })),
//         vatRatio: data.vat_ratio || '0',
//         couponId: data.coupon_id,
//         couponType: data.coupon_type,
//         couponValue: data.coupon_value
//       }));
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//       toast.error('Failed to load cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, [token]);

//   const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
//     try {
//       await axiosInstance.post('api/update-cart', {
//         products: [{
//           product_id: productId,
//           quantity: newQuantity
//         }]
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       dispatch(updateCartItem({id: productId, quantity: newQuantity}));
//       await fetchCart();
//     } catch (error) {
//       console.error('Error updating cart:', error);
//       toast.error('Failed to update quantity');
//       throw error;
//     }
//   };

//   const handleIncreaseQuantity = async (productId: number) => {
//     const currentQuantity = cartData?.products.find(p => p.id === productId)?.quantity || 1;
//     setUpdatingIncrease(productId);
//     try {
//       await handleUpdateQuantity(productId, currentQuantity + 1);
//       toast.success("Item Incresed");
//     } finally {
//       setUpdatingIncrease(null);
//     }
//   };

//   const handleDecreaseQuantity = async (productId: number) => {
//     const currentQuantity = cartData?.products.find(p => p.id === productId)?.quantity || 1;
//     if (currentQuantity <= 1) return;
    
//     setUpdatingDecrease(productId);
//     try {
//       await handleUpdateQuantity(productId, currentQuantity - 1);
//       toast.success("Item Decresed");
//     } finally {
//       setUpdatingDecrease(null);
//     }
//   };

//   const handleRemoveItem = async (productId: number) => {
//     setRemoving(productId);
//     try {
//       await axiosInstance.post(`api/remove-from-cart/${productId}`, {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       dispatch(removeFromCart(productId));
//       await fetchCart();
//       toast.success('Item removed');
//     } catch (error) {
//       console.error('Error removing item:', error);
//       toast.error('Failed to remove item');
//     } finally {
//       setRemoving(null);
//     }
//   };

//   const handleApplyCoupon = async () => {
//     if (!couponCode.trim()) {
//       toast.error('Please enter a coupon code');
//       return;
//     }
    
//     try {
//       const res = await axiosInstance.post('api/apply-coupon', {
//         coupon_code: couponCode
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       const coupon = res.data.data;
//       dispatch(applyCoupon({
//         couponId: coupon.id,
//         couponType: coupon.type,
//         couponValue: coupon.value.toString()
//       }));
//       await fetchCart();
//       toast.success('Coupon applied');
//       setCouponCode('');
//     } catch (error) {
//       console.error('Error applying coupon:', error);
//       toast.error(error.response?.data?.message || 'Invalid coupon code');
//     }
//   };

//   const handleRemoveCoupon = async () => {
//     try {
//       await axiosInstance.post('api/remove-coupon', {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       dispatch(removeCoupon());
//       await fetchCart();
//       toast.success('Coupon removed');
//     } catch (error) {
//       console.error('Error removing coupon:', error);
//       toast.error('Failed to remove coupon');
//     }
//   };

//   const calculateTotals = () => {
//     if (!cartData || !cartData.products || cartData.products.length === 0) {
//       return {
//         subtotal: '0.00',
//         vat: '0.00',
//         discount: '0.00',
//         total: '0.00'
//       };
//     }

//     const vatRatio = parseFloat(cartData.vat_ratio) || 0;
    
//     const subtotal = cartData.products.reduce((sum, product) => {
//       const price = parseFloat(product.offer_price) || parseFloat(product.price) || 0;
//       const quantity = product.quantity || 0;
//       return sum + (price * quantity);
//     }, 0);

//     let discount = 0;
//     if (cartData.coupon_value) {
//       const couponValue = parseFloat(cartData.coupon_value) || 0;
//       discount = cartData.coupon_type === 'percentage'
//         ? subtotal * (couponValue / 100)
//         : couponValue;
//     }

//     const vatAmount = subtotal * (vatRatio / 100);
//     const total = subtotal + vatAmount - discount;
    
//     return {
//       subtotal: subtotal.toFixed(2),
//       vat: vatAmount.toFixed(2),
//       discount: discount.toFixed(2),
//       total: total.toFixed(2)
//     };
//   };

//   const totals = calculateTotals();

//   if (!token) {
//     return (
//       <div className="bg-white min-h-screen py-12 px-4">
//         <div className="max-w-md mx-auto text-center">
//           <ShoppingCart size={64} className="mx-auto text-gray-400 mb-6" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
//           <p className="text-gray-600 mb-8">Please login to view your cart</p>
//           <button 
//             onClick={() => router.push('/login')}
//             className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//           >
//             Login to Continue
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="bg-white min-h-screen py-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="animate-pulse space-y-8">
//             <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="flex gap-6 p-6 border border-gray-200 rounded-lg">
//                 <div className="w-32 h-32 bg-gray-200 rounded"></div>
//                 <div className="flex-1 space-y-4">
//                   <div className="h-5 bg-gray-200 rounded w-3/4"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                   <div className="flex gap-4">
//                     <div className="h-10 bg-gray-200 rounded w-24"></div>
//                     <div className="h-10 bg-gray-200 rounded w-32"></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             <div className="h-40 bg-gray-200 rounded-lg"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!cartData || cartData.products.length === 0) {
//     return (
//       <div className="bg-white min-h-screen py-12 px-4">
//         <div className="max-w-md mx-auto text-center">
//           <ShoppingCart size={64} className="mx-auto text-gray-400 mb-6" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
//           <p className="text-gray-600 mb-8">Looks like you haven't added any items yet</p>
//           <button 
//             onClick={() => router.push('/products')}
//             className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//           >
//             Continue Shopping
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <button 
//             onClick={() => router.back()}
//             className="flex items-center text-gray-700 hover:text-black transition cursor-pointer"
//           >
//             <ArrowLeft size={20} className="mr-2" />
//             Continue Shopping
//           </button>
//         </div>

//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart ({cartData.products.length})</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6">
//             {cartData.products.map((product) => {
//               const price = parseFloat(product.offer_price) || parseFloat(product.price) || 0;
//               const originalPrice = product.offer_price ? parseFloat(product.price) : null;
              
//               return (
//                 <div key={product.id} className="flex flex-col sm:flex-row gap-6 p-6 border border-gray-200 rounded-lg">
//                   <div className="relative w-full sm:w-40 h-40 bg-gray-100 rounded-lg overflow-hidden">
//                     <Image
//                       src={product.image || '/placeholder-product.jpg'}
//                       alt={product.name}
//                       fill
//                       className="object-contain"
//                       sizes="(max-width: 640px) 100vw, 160px"
//                     />
//                   </div>
                  
//                   <div className="flex-1 flex flex-col">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
//                         <p className="text-sm text-gray-600 mt-1">{product.brand_name}</p>
//                       </div>
//                       <button 
//                         onClick={() => handleRemoveItem(product.id)}
//                         disabled={removing === product.id}
//                         className="text-gray-400 hover:text-red-500 transition cursor-pointer"
//                       >
//                         {removing === product.id ? (
//                           <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
//                         ) : (
//                           <Trash2 size={20} />
//                         )}
//                       </button>
//                     </div>

//                     <div className="mt-4 flex items-center justify-between">
//                       <div className="flex items-center gap-2 text-black">
//                         <button
//                           onClick={() => handleDecreaseQuantity(product.id)}
//                           disabled={product.quantity <= 1 || updatingDecrease === product.id}
//                           className="cursor-pointer w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition"
//                         >
//                           {updatingDecrease === product.id ? (
//                             <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
//                           ) : (
//                             <ChevronDown size={16} />
//                           )}
//                         </button>
//                         <span className="w-12 text-center text-gray-900 font-medium">
//                           {product.quantity}
//                         </span>
//                         <button
//                           onClick={() => handleIncreaseQuantity(product.id)}
//                           disabled={updatingIncrease === product.id}
//                           className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition"
//                         >
//                           {updatingIncrease === product.id ? (
//                             <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
//                           ) : (
//                             <ChevronUp size={16} />
//                           )}
//                         </button>
//                       </div>

//                       <div className="text-right">
//                         {originalPrice ? (
//                           <>
//                             <span className="text-gray-500 line-through mr-2 text-sm">
//                               {originalPrice.toFixed(2)} SAR
//                             </span>
//                             <span className="font-bold text-gray-900">
//                               {price.toFixed(2)} SAR
//                             </span>
//                           </>
//                         ) : (
//                           <span className="font-bold text-gray-900">
//                             {price.toFixed(2)} SAR
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}

//             <div className="flex justify-end pt-4">
//               <button
//                 onClick={() => {
//                   if (confirm('Are you sure you want to clear your cart?')) {
//                     dispatch(clearCart());
//                     fetchCart();
//                   }
//                 }}
//                 className="text-red-600 hover:text-red-800 flex items-center gap-2 transition"
//               >
//                 <Trash2 size={18} />
//                 Clear Cart
//               </button>
//             </div>
//           </div>

//           <div className="lg:col-span-1">
//             <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
//               <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

//               {isCouponApplied ? (
//                 <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <p className="text-green-800 font-medium">Coupon Applied</p>
//                       <p className="text-green-600 text-sm">
//                         {cartData.coupon_type === 'percentage' 
//                           ? `${cartData.coupon_value}% off` 
//                           : `${cartData.coupon_value} SAR off`}
//                       </p>
//                     </div>
//                     <button 
//                       onClick={handleRemoveCoupon}
//                       className="text-green-600 hover:text-green-800 text-sm font-medium transition"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="mb-6">
//                   <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
//                     Apply Coupon
//                   </label>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       id="coupon"
//                       value={couponCode}
//                       onChange={(e) => setCouponCode(e.target.value)}
//                       placeholder="Enter coupon code"
//                       className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-black focus:border-black"
//                     />
//                     <button
//                       onClick={handleApplyCoupon}
//                       disabled={!couponCode.trim()}
//                       className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
//                     >
//                       Apply
//                     </button>
//                   </div>
//                 </div>
//               )}

//               <div className="space-y-4 mb-6">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span className="font-medium text-gray-900">{totals.subtotal} SAR</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">VAT ({parseFloat(cartData.vat_ratio || '0')}%)</span>
//                   <span className="font-medium text-gray-900">{totals.vat} SAR</span>
//                 </div>
//                 {isCouponApplied && (
//                   <div className="flex justify-between text-green-600">
//                     <span>Discount</span>
//                     <span className="font-medium">-{totals.discount} SAR</span>
//                   </div>
//                 )}
//                 <div className="border-t border-gray-200 pt-4 flex justify-between">
//                   <span className="font-bold text-gray-900">Total</span>
//                   <span className="font-bold text-gray-900 text-xl">
//                     {totals.total} SAR
//                   </span>
//                 </div>
//               </div>

//               <button 
//                 onClick={() => router.push('/checkout')}
//                 className="cursor-pointer w-full py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition"
//               >
//                 Proceed to Checkout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '@/redux/store';
// import axiosInstance from '@/lib/axios';
// import Image from 'next/image';
// import { Trash2, ShoppingCart, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-hot-toast';
// import { 
//   setCart, 
//   removeFromCart, 
//   updateCartItem, 
//   clearCart, 
//   applyCoupon, 
//   removeCoupon 
// } from '@/redux/cart/cartSlice';

// interface CartProduct {
//   id: number;
//   image: string;
//   name: string;
//   quantity: number;
//   brand_name: string;
//   price: string;
//   offer_price: string;
// }

// interface CartData {
//   id: number;
//   vat_ratio: string;
//   coupon_id: number | null;
//   coupon_type: string | null;
//   coupon_value: string | null;
//   products: CartProduct[];
// }

// export default function CartPage() {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const token = useSelector((state: RootState) => state.auth.token);
//   const [cartData, setCartData] = useState<CartData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [removing, setRemoving] = useState<number | null>(null);
//   const [couponCode, setCouponCode] = useState('');
//   const [isCouponApplied, setIsCouponApplied] = useState(false);
//   const [updatingQuantity, setUpdatingQuantity] = useState<number | null>(null);

//   const fetchCart = async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get('api/my-cart', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       const data = res.data.data;
//       setCartData(data);
//       setIsCouponApplied(data.coupon_id !== null);
      
//       dispatch(setCart({
//         items: data.products.map((product: CartProduct) => ({
//           id: product.id,
//           quantity: product.quantity || 1,
//           price: parseFloat(product.offer_price) || parseFloat(product.price) || 0,
//           name: product.name,
//           image: product.image
//         })),
//         vatRatio: data.vat_ratio || '0',
//         coupon: data.coupon_id ? {
//           id: data.coupon_id,
//           code: couponCode,
//           type: data.coupon_type as 'percentage' | 'fixed',
//           value: parseFloat(data.coupon_value || '0'),
//           valid_until: '' // Add this if your API returns it
//         } : null
//       }));
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//       toast.error('Failed to load cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, [token]);

//   const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
//     if (newQuantity < 1) return;
    
//     setUpdatingQuantity(productId);
//     try {
//       const response = await axiosInstance.post('api/update-cart', {
//         product_id: productId,
//         quantity: newQuantity
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       // Update Redux state
//       dispatch(updateCartItem({
//         id: productId,
//         quantity: newQuantity
//       }));
      
//       // Update local state with fresh data from API
//       setCartData(response.data.data);
//       toast.success('Quantity updated');
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//       toast.error('Failed to update quantity');
//       // Revert to previous state on error
//       await fetchCart();
//     } finally {
//       setUpdatingQuantity(null);
//     }
//   };

//   const handleIncreaseQuantity = async (productId: number) => {
//     const currentQuantity = cartData?.products.find(p => p.id === productId)?.quantity || 1;
//     await handleUpdateQuantity(productId, currentQuantity + 1);
//   };

//   const handleDecreaseQuantity = async (productId: number) => {
//     const currentQuantity = cartData?.products.find(p => p.id === productId)?.quantity || 1;
//     if (currentQuantity <= 1) {
//       await handleRemoveItem(productId);
//       return;
//     }
//     await handleUpdateQuantity(productId, currentQuantity - 1);
//   };

//   const handleRemoveItem = async (productId: number) => {
//     setRemoving(productId);
//     try {
//       await axiosInstance.post(`api/remove-from-cart/${productId}`, {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       dispatch(removeFromCart(productId));
//       await fetchCart();
//       toast.success('Item removed');
//     } catch (error) {
//       console.error('Error removing item:', error);
//       toast.error('Failed to remove item');
//     } finally {
//       setRemoving(null);
//     }
//   };

//   const handleApplyCoupon = async () => {
//     if (!couponCode.trim()) {
//       toast.error('Please enter a coupon code');
//       return;
//     }
    
//     try {
//       const res = await axiosInstance.post('api/apply-coupon', {
//         coupon_code: couponCode
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       const coupon = res.data.data;
//       dispatch(applyCoupon({
//         id: coupon.id,
//         code: couponCode,
//         type: coupon.type,
//         value: coupon.value,
//         valid_until: coupon.valid_until || ''
//       }));
//       await fetchCart();
//       toast.success('Coupon applied');
//       setCouponCode('');
//     } catch (error) {
//       console.error('Error applying coupon:', error);
//       toast.error(error.response?.data?.message || 'Invalid coupon code');
//     }
//   };

//   const handleRemoveCoupon = async () => {
//     try {
//       await axiosInstance.post('api/remove-coupon', {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       dispatch(removeCoupon());
//       await fetchCart();
//       toast.success('Coupon removed');
//     } catch (error) {
//       console.error('Error removing coupon:', error);
//       toast.error('Failed to remove coupon');
//     }
//   };

//   const calculateTotals = () => {
//     if (!cartData?.products?.length) {
//       return {
//         subtotal: '0.00',
//         vat: '0.00',
//         discount: '0.00',
//         total: '0.00'
//       };
//     }

//     const vatRatio = parseFloat(cartData.vat_ratio) || 0;
//     const subtotal = cartData.products.reduce((sum, product) => {
//       const price = parseFloat(product.offer_price) || parseFloat(product.price) || 0;
//       return sum + (price * product.quantity);
//     }, 0);

//     let discount = 0;
//     if (cartData.coupon_value) {
//       const couponValue = parseFloat(cartData.coupon_value) || 0;
//       discount = cartData.coupon_type === 'percentage'
//         ? subtotal * (couponValue / 100)
//         : couponValue;
//     }

//     const vatAmount = subtotal * (vatRatio / 100);
//     const total = subtotal + vatAmount - discount;
    
//     return {
//       subtotal: subtotal.toFixed(2),
//       vat: vatAmount.toFixed(2),
//       discount: discount.toFixed(2),
//       total: total.toFixed(2)
//     };
//   };

//   const totals = calculateTotals();

//   if (!token) {
//     return (
//       <div className="bg-white min-h-screen py-12 px-4">
//         <div className="max-w-md mx-auto text-center">
//           <ShoppingCart size={64} className="mx-auto text-gray-400 mb-6" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
//           <p className="text-gray-600 mb-8">Please login to view your cart</p>
//           <button 
//             onClick={() => router.push('/login')}
//             className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//           >
//             Login to Continue
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="bg-white min-h-screen py-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="animate-pulse space-y-8">
//             <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="flex gap-6 p-6 border border-gray-200 rounded-lg">
//                 <div className="w-32 h-32 bg-gray-200 rounded"></div>
//                 <div className="flex-1 space-y-4">
//                   <div className="h-5 bg-gray-200 rounded w-3/4"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                   <div className="flex gap-4">
//                     <div className="h-10 bg-gray-200 rounded w-24"></div>
//                     <div className="h-10 bg-gray-200 rounded w-32"></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             <div className="h-40 bg-gray-200 rounded-lg"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!cartData || cartData.products.length === 0) {
//     return (
//       <div className="bg-white min-h-screen py-12 px-4">
//         <div className="max-w-md mx-auto text-center">
//           <ShoppingCart size={64} className="mx-auto text-gray-400 mb-6" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
//           <p className="text-gray-600 mb-8">Looks like you haven't added any items yet</p>
//           <button 
//             onClick={() => router.push('/products')}
//             className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//           >
//             Continue Shopping
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <button 
//             onClick={() => router.back()}
//             className="flex items-center text-gray-700 hover:text-black transition cursor-pointer"
//           >
//             <ArrowLeft size={20} className="mr-2" />
//             Continue Shopping
//           </button>
//         </div>

//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart ({cartData.products.length})</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6">
//             {cartData.products.map((product) => {
//               const price = parseFloat(product.offer_price) || parseFloat(product.price) || 0;
//               const originalPrice = product.offer_price ? parseFloat(product.price) : null;
//               const isUpdating = updatingQuantity === product.id;
              
//               return (
//                 <div key={product.id} className="flex flex-col sm:flex-row gap-6 p-6 border border-gray-200 rounded-lg">
//                   <div className="relative w-full sm:w-40 h-40 bg-gray-100 rounded-lg overflow-hidden">
//                     <Image
//                       src={product.image || '/placeholder-product.jpg'}
//                       alt={product.name}
//                       fill
//                       className="object-contain"
//                       sizes="(max-width: 640px) 100vw, 160px"
//                     />
//                   </div>
                  
//                   <div className="flex-1 flex flex-col">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
//                         <p className="text-sm text-gray-600 mt-1">{product.brand_name}</p>
//                       </div>
//                       <button 
//                         onClick={() => handleRemoveItem(product.id)}
//                         disabled={removing === product.id}
//                         className="text-gray-400 hover:text-red-500 transition cursor-pointer"
//                       >
//                         {removing === product.id ? (
//                           <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
//                         ) : (
//                           <Trash2 size={20} />
//                         )}
//                       </button>
//                     </div>

//                     <div className="mt-4 flex items-center justify-between">
//                       <div className="flex items-center gap-2 text-black">
//                         <button
//                           onClick={() => handleDecreaseQuantity(product.id)}
//                           disabled={isUpdating || product.quantity <= 1}
//                           className="cursor-pointer w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition"
//                         >
//                           {isUpdating ? (
//                             <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
//                           ) : (
//                             <ChevronDown size={16} />
//                           )}
//                         </button>
//                         <span className="w-12 text-center text-gray-900 font-medium">
//                           {product.quantity}
//                         </span>
//                         <button
//                           onClick={() => handleIncreaseQuantity(product.id)}
//                           disabled={isUpdating}
//                           className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition"
//                         >
//                           {isUpdating ? (
//                             <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
//                           ) : (
//                             <ChevronUp size={16} />
//                           )}
//                         </button>
//                       </div>

//                       <div className="text-right">
//                         {originalPrice ? (
//                           <>
//                             <span className="text-gray-500 line-through mr-2 text-sm">
//                               {originalPrice.toFixed(2)} SAR
//                             </span>
//                             <span className="font-bold text-gray-900">
//                               {price.toFixed(2)} SAR
//                             </span>
//                           </>
//                         ) : (
//                           <span className="font-bold text-gray-900">
//                             {price.toFixed(2)} SAR
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}

//             <div className="flex justify-end pt-4">
//               <button
//                 onClick={() => {
//                   if (confirm('Are you sure you want to clear your cart?')) {
//                     dispatch(clearCart());
//                     fetchCart();
//                   }
//                 }}
//                 className="text-red-600 hover:text-red-800 flex items-center gap-2 transition"
//               >
//                 <Trash2 size={18} />
//                 Clear Cart
//               </button>
//             </div>
//           </div>

//           <div className="lg:col-span-1">
//             <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
//               <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

//               {isCouponApplied ? (
//                 <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <p className="text-green-800 font-medium">Coupon Applied</p>
//                       <p className="text-green-600 text-sm">
//                         {cartData.coupon_type === 'percentage' 
//                           ? `${cartData.coupon_value}% off` 
//                           : `${cartData.coupon_value} SAR off`}
//                       </p>
//                     </div>
//                     <button 
//                       onClick={handleRemoveCoupon}
//                       className="text-green-600 hover:text-green-800 text-sm font-medium transition"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="mb-6">
//                   <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
//                     Apply Coupon
//                   </label>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       id="coupon"
//                       value={couponCode}
//                       onChange={(e) => setCouponCode(e.target.value)}
//                       placeholder="Enter coupon code"
//                       className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-black focus:border-black"
//                     />
//                     <button
//                       onClick={handleApplyCoupon}
//                       disabled={!couponCode.trim()}
//                       className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
//                     >
//                       Apply
//                     </button>
//                   </div>
//                 </div>
//               )}

//               <div className="space-y-4 mb-6">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span className="font-medium text-gray-900">{totals.subtotal} SAR</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">VAT ({parseFloat(cartData.vat_ratio || '0')}%)</span>
//                   <span className="font-medium text-gray-900">{totals.vat} SAR</span>
//                 </div>
//                 {isCouponApplied && (
//                   <div className="flex justify-between text-green-600">
//                     <span>Discount</span>
//                     <span className="font-medium">-{totals.discount} SAR</span>
//                   </div>
//                 )}
//                 <div className="border-t border-gray-200 pt-4 flex justify-between">
//                   <span className="font-bold text-gray-900">Total</span>
//                   <span className="font-bold text-gray-900 text-xl">
//                     {totals.total} SAR
//                   </span>
//                 </div>
//               </div>

//               <button 
//                 onClick={() => router.push('/checkout')}
//                 className="cursor-pointer w-full py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition"
//               >
//                 Proceed to Checkout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '@/redux/store';
// import axiosInstance from '@/lib/axios';
// import Image from 'next/image';
// import { Trash2, ShoppingCart, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-hot-toast';
// import { 
//   setCart, 
//   removeFromCart, 
//   updateCartItem, 
//   clearCart, 
//   applyCoupon, 
//   removeCoupon 
// } from '@/redux/cart/cartSlice';

// interface CartProduct {
//   id: number;
//   image: string;
//   name: string;
//   quantity: number;
//   brand_name: string;
//   price: string;
//   offer_price: string;
// }

// interface CartData {
//   id: number;
//   vat_ratio: string;
//   coupon_id: number | null;
//   coupon_type: string | null;
//   coupon_value: string | null;
//   products: CartProduct[];
// }

// export default function CartPage() {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const token = useSelector((state: RootState) => state.auth.token);
//   const [cartData, setCartData] = useState<CartData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [removing, setRemoving] = useState<number | null>(null);
//   const [couponCode, setCouponCode] = useState('');
//   const [isCouponApplied, setIsCouponApplied] = useState(false);
//   const [updatingQuantity, setUpdatingQuantity] = useState<{id: number | null, type: 'inc' | 'dec' | null}>({
//     id: null,
//     type: null
//   });

//   const fetchCart = async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get('api/my-cart', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       const data = res.data.data;
//       setCartData(data);
//       setIsCouponApplied(data.coupon_id !== null);
      
//       dispatch(setCart({
//         items: data.products.map((product: CartProduct) => ({
//           id: product.id,
//           quantity: product.quantity || 1,
//           price: parseFloat(product.offer_price) || parseFloat(product.price) || 0,
//           name: product.name,
//           image: product.image
//         })),
//         vatRatio: data.vat_ratio || '0',
//         coupon: data.coupon_id ? {
//           id: data.coupon_id,
//           code: couponCode,
//           type: data.coupon_type as 'percentage' | 'fixed',
//           value: parseFloat(data.coupon_value || '0'),
//           valid_until: ''
//         } : null
//       }));
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//       toast.error('Failed to load cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, [token]);

//   const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
//     if (newQuantity < 1) return;
    
//     setUpdatingQuantity({ id: productId, type: newQuantity > (cartData?.products.find(p => p.id === productId)?.quantity || 1) ? 'inc' : 'dec' });
    
//     try {
//       // Optimistically update local state first
//       const updatedProducts = cartData?.products.map(product => 
//         product.id === productId ? { ...product, quantity: newQuantity } : product
//       ) || [];
      
//       setCartData(prev => prev ? { ...prev, products: updatedProducts } : null);
      
//       // Make API call
//       const response = await axiosInstance.post('api/update-cart', {
//         product_id: productId,
//         quantity: newQuantity
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       // Update Redux state with confirmed data
//       dispatch(updateCartItem({
//         id: productId,
//         quantity: newQuantity
//       }));
      
//       // Refresh full cart data from API
//       await fetchCart();
      
//       toast.success('Quantity updated');
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//       toast.error('Failed to update quantity');
//       // Revert to previous state on error
//       await fetchCart();
//     } finally {
//       setUpdatingQuantity({ id: null, type: null });
//     }
//   };

//   const handleIncreaseQuantity = async (productId: number) => {
//     const currentQuantity = cartData?.products.find(p => p.id === productId)?.quantity || 1;
//     await handleUpdateQuantity(productId, currentQuantity + 1);
//   };

//   const handleDecreaseQuantity = async (productId: number) => {
//     const currentQuantity = cartData?.products.find(p => p.id === productId)?.quantity || 1;
//     if (currentQuantity <= 1) {
//       await handleRemoveItem(productId);
//       return;
//     }
//     await handleUpdateQuantity(productId, currentQuantity - 1);
//   };

//   const handleRemoveItem = async (productId: number) => {
//     setRemoving(productId);
//     try {
//       // Optimistically update local state
//       const updatedProducts = cartData?.products.filter(product => product.id !== productId) || [];
//       setCartData(prev => prev ? { ...prev, products: updatedProducts } : null);
      
//       // Make API call
//       await axiosInstance.post(`api/remove-from-cart/${productId}`, {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       // Update Redux state
//       dispatch(removeFromCart(productId));
      
//       // Refresh full cart data
//       await fetchCart();
      
//       toast.success('Item removed');
//     } catch (error) {
//       console.error('Error removing item:', error);
//       toast.error('Failed to remove item');
//       // Revert to previous state on error
//       await fetchCart();
//     } finally {
//       setRemoving(null);
//     }
//   };

//   const handleApplyCoupon = async () => {
//     if (!couponCode.trim()) {
//       toast.error('Please enter a coupon code');
//       return;
//     }
    
//     try {
//       const res = await axiosInstance.post('api/apply-coupon', {
//         coupon_code: couponCode
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       const coupon = res.data.data;
//       dispatch(applyCoupon({
//         id: coupon.id,
//         code: couponCode,
//         type: coupon.type,
//         value: coupon.value,
//         valid_until: coupon.valid_until || ''
//       }));
//       await fetchCart();
//       toast.success('Coupon applied');
//       setCouponCode('');
//     } catch (error) {
//       console.error('Error applying coupon:', error);
//       toast.error(error.response?.data?.message || 'Invalid coupon code');
//     }
//   };

//   const handleRemoveCoupon = async () => {
//     try {
//       await axiosInstance.post('api/remove-coupon', {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       dispatch(removeCoupon());
//       await fetchCart();
//       toast.success('Coupon removed');
//     } catch (error) {
//       console.error('Error removing coupon:', error);
//       toast.error('Failed to remove coupon');
//     }
//   };

//   const calculateTotals = () => {
//     if (!cartData?.products?.length) {
//       return {
//         subtotal: '0.00',
//         vat: '0.00',
//         discount: '0.00',
//         total: '0.00'
//       };
//     }

//     const vatRatio = parseFloat(cartData.vat_ratio) || 0;
//     const subtotal = cartData.products.reduce((sum, product) => {
//       const price = parseFloat(product.offer_price) || parseFloat(product.price) || 0;
//       return sum + (price * product.quantity);
//     }, 0);

//     let discount = 0;
//     if (cartData.coupon_value) {
//       const couponValue = parseFloat(cartData.coupon_value) || 0;
//       discount = cartData.coupon_type === 'percentage'
//         ? subtotal * (couponValue / 100)
//         : couponValue;
//     }

//     const vatAmount = subtotal * (vatRatio / 100);
//     const total = subtotal + vatAmount - discount;
    
//     return {
//       subtotal: subtotal.toFixed(2),
//       vat: vatAmount.toFixed(2),
//       discount: discount.toFixed(2),
//       total: total.toFixed(2)
//     };
//   };

//   const totals = calculateTotals();

//   if (!token) {
//     return (
//       <div className="bg-white min-h-screen py-12 px-4">
//         <div className="max-w-md mx-auto text-center">
//           <ShoppingCart size={64} className="mx-auto text-gray-400 mb-6" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
//           <p className="text-gray-600 mb-8">Please login to view your cart</p>
//           <button 
//             onClick={() => router.push('/login')}
//             className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//           >
//             Login to Continue
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="bg-white min-h-screen py-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="animate-pulse space-y-8">
//             <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="flex gap-6 p-6 border border-gray-200 rounded-lg">
//                 <div className="w-32 h-32 bg-gray-200 rounded"></div>
//                 <div className="flex-1 space-y-4">
//                   <div className="h-5 bg-gray-200 rounded w-3/4"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                   <div className="flex gap-4">
//                     <div className="h-10 bg-gray-200 rounded w-24"></div>
//                     <div className="h-10 bg-gray-200 rounded w-32"></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             <div className="h-40 bg-gray-200 rounded-lg"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!cartData || cartData.products.length === 0) {
//     return (
//       <div className="bg-white min-h-screen py-12 px-4">
//         <div className="max-w-md mx-auto text-center">
//           <ShoppingCart size={64} className="mx-auto text-gray-400 mb-6" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
//           <p className="text-gray-600 mb-8">Looks like you haven't added any items yet</p>
//           <button 
//             onClick={() => router.push('/products')}
//             className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//           >
//             Continue Shopping
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <button 
//             onClick={() => router.back()}
//             className="flex items-center text-gray-700 hover:text-black transition cursor-pointer"
//           >
//             <ArrowLeft size={20} className="mr-2" />
//             Continue Shopping
//           </button>
//         </div>

//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart ({cartData.products.length})</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6">
//             {cartData.products.map((product) => {
//               const price = parseFloat(product.offer_price) || parseFloat(product.price) || 0;
//               const originalPrice = product.offer_price ? parseFloat(product.price) : null;
//               const isUpdating = updatingQuantity.id === product.id;
              
//               return (
//                 <div key={product.id} className="flex flex-col sm:flex-row gap-6 p-6 border border-gray-200 rounded-lg">
//                   <div className="relative w-full sm:w-40 h-40 bg-gray-100 rounded-lg overflow-hidden">
//                     <Image
//                       src={product.image || '/placeholder-product.jpg'}
//                       alt={product.name}
//                       fill
//                       className="object-contain"
//                       sizes="(max-width: 640px) 100vw, 160px"
//                     />
//                   </div>
                  
//                   <div className="flex-1 flex flex-col">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
//                         <p className="text-sm text-gray-600 mt-1">{product.brand_name}</p>
//                       </div>
//                       <button 
//                         onClick={() => handleRemoveItem(product.id)}
//                         disabled={removing === product.id}
//                         className="text-gray-400 hover:text-red-500 transition cursor-pointer"
//                       >
//                         {removing === product.id ? (
//                           <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
//                         ) : (
//                           <Trash2 size={20} />
//                         )}
//                       </button>
//                     </div>

//                     <div className="mt-4 flex items-center justify-between">
//                       <div className="flex items-center gap-2 text-black">
//                         <button
//                           onClick={() => handleDecreaseQuantity(product.id)}
//                           disabled={isUpdating || product.quantity <= 1}
//                           className="cursor-pointer w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition"
//                         >
//                           {isUpdating && updatingQuantity.type === 'dec' ? (
//                             <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
//                           ) : (
//                             <ChevronDown size={16} />
//                           )}
//                         </button>
//                         <span className="w-12 text-center text-gray-900 font-medium">
//                           {product.quantity}
//                         </span>
//                         <button
//                           onClick={() => handleIncreaseQuantity(product.id)}
//                           disabled={isUpdating}
//                           className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition"
//                         >
//                           {isUpdating && updatingQuantity.type === 'inc' ? (
//                             <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
//                           ) : (
//                             <ChevronUp size={16} />
//                           )}
//                         </button>
//                       </div>

//                       <div className="text-right">
//                         {originalPrice ? (
//                           <>
//                             <span className="text-gray-500 line-through mr-2 text-sm">
//                               {originalPrice.toFixed(2)} SAR
//                             </span>
//                             <span className="font-bold text-gray-900">
//                               {price.toFixed(2)} SAR
//                             </span>
//                           </>
//                         ) : (
//                           <span className="font-bold text-gray-900">
//                             {price.toFixed(2)} SAR
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}

//             <div className="flex justify-end pt-4">
//               <button
//                 onClick={() => {
//                   if (confirm('Are you sure you want to clear your cart?')) {
//                     dispatch(clearCart());
//                     fetchCart();
//                   }
//                 }}
//                 className="text-red-600 hover:text-red-800 flex items-center gap-2 transition"
//               >
//                 <Trash2 size={18} />
//                 Clear Cart
//               </button>
//             </div>
//           </div>

//           <div className="lg:col-span-1">
//             <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
//               <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

//               {isCouponApplied ? (
//                 <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <p className="text-green-800 font-medium">Coupon Applied</p>
//                       <p className="text-green-600 text-sm">
//                         {cartData.coupon_type === 'percentage' 
//                           ? `${cartData.coupon_value}% off` 
//                           : `${cartData.coupon_value} SAR off`}
//                       </p>
//                     </div>
//                     <button 
//                       onClick={handleRemoveCoupon}
//                       className="text-green-600 hover:text-green-800 text-sm font-medium transition"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="mb-6">
//                   <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
//                     Apply Coupon
//                   </label>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       id="coupon"
//                       value={couponCode}
//                       onChange={(e) => setCouponCode(e.target.value)}
//                       placeholder="Enter coupon code"
//                       className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-black focus:border-black"
//                     />
//                     <button
//                       onClick={handleApplyCoupon}
//                       disabled={!couponCode.trim()}
//                       className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
//                     >
//                       Apply
//                     </button>
//                   </div>
//                 </div>
//               )}

//               <div className="space-y-4 mb-6">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span className="font-medium text-gray-900">{totals.subtotal} SAR</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">VAT ({parseFloat(cartData.vat_ratio || '0')}%)</span>
//                   <span className="font-medium text-gray-900">{totals.vat} SAR</span>
//                 </div>
//                 {isCouponApplied && (
//                   <div className="flex justify-between text-green-600">
//                     <span>Discount</span>
//                     <span className="font-medium">-{totals.discount} SAR</span>
//                   </div>
//                 )}
//                 <div className="border-t border-gray-200 pt-4 flex justify-between">
//                   <span className="font-bold text-gray-900">Total</span>
//                   <span className="font-bold text-gray-900 text-xl">
//                     {totals.total} SAR
//                   </span>
//                 </div>
//               </div>

//               <button 
//                 onClick={() => router.push('/checkout')}
//                 className="cursor-pointer w-full py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition"
//               >
//                 Proceed to Checkout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '@/redux/store';
// import axiosInstance from '@/lib/axios';
// import Image from 'next/image';
// import { Trash2, ShoppingCart, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-hot-toast';
// import { 
//   setCart, 
//   removeFromCart, 
//   updateCartItem, 
//   clearCart, 
// } from '@/redux/cart/cartSlice';

// interface CartProduct {
//   id: number;
//   image: string;
//   name: string;
//   quantity: number;
//   brand_name: string;
//   price: string;
//   offer_price: string;
// }

// interface CartData {
//   id: number;
//   vat_ratio: string;
//   coupon_id: number | null;
//   coupon_type: string | null;
//   coupon_value: string | null;
//   products: CartProduct[];
// }

// export default function CartPage() {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const token = useSelector((state: RootState) => state.auth.token);
//   const [cartData, setCartData] = useState<CartData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [removing, setRemoving] = useState<number | null>(null);
//   const [couponCode, setCouponCode] = useState('');
//   const [isCouponApplied, setIsCouponApplied] = useState(false);
//   const [updatingQuantity, setUpdatingQuantity] = useState<{id: number | null, type: 'inc' | 'dec' | null}>({
//     id: null,
//     type: null
//   });

//   const fetchCart = async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get('api/my-cart', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       const data = res.data.data;
//       setCartData(data);
//       setIsCouponApplied(data.coupon_id !== null);
      
//       dispatch(setCart({
//         items: data.products.map((product: CartProduct) => ({
//           id: product.id,
//           quantity: product.quantity || 1,
//           price: parseFloat(product.offer_price) || parseFloat(product.price) || 0,
//           name: product.name,
//           image: product.image
//         })),
//         vatRatio: data.vat_ratio || '0',
//         coupon: data.coupon_id ? {
//           id: data.coupon_id,
//           code: couponCode,
//           type: data.coupon_type as 'percentage' | 'fixed',
//           value: parseFloat(data.coupon_value || '0'),
//           valid_until: ''
//         } : null
//       }));
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//       toast.error('Failed to load cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, [token]);

//   const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
//     if (newQuantity < 1) return;
    
//     setUpdatingQuantity({ id: productId, type: newQuantity > (cartData?.products.find(p => p.id === productId)?.quantity || 1) ? 'inc' : 'dec' });
    
//     try {
//       // Optimistically update local state first
//       const updatedProducts = cartData?.products.map(product => 
//         product.id === productId ? { ...product, quantity: newQuantity } : product
//       ) || [];
      
//       setCartData(prev => prev ? { ...prev, products: updatedProducts } : null);
      
//       // Make API call with exact backend requirements
//       await axiosInstance.post('api/update-cart', {
//         products: [{
//           product_id: productId,
//           quantity: newQuantity
//         }]
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       // Update Redux state with confirmed data
//       dispatch(updateCartItem({
//         id: productId,
//         quantity: newQuantity
//       }));
      
//       toast.success('Quantity updated');
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//       toast.error('Failed to update quantity');
//       // Revert to previous state on error
//       await fetchCart();
//     } finally {
//       setUpdatingQuantity({ id: null, type: null });
//     }
//   };

//   const handleIncreaseQuantity = async (productId: number) => {
//     const currentQuantity = cartData?.products.find(p => p.id === productId)?.quantity || 1;
//     await handleUpdateQuantity(productId, currentQuantity + 1);
//   };

//   const handleDecreaseQuantity = async (productId: number) => {
//     const currentQuantity = cartData?.products.find(p => p.id === productId)?.quantity || 1;
//     if (currentQuantity <= 1) {
//       await handleRemoveItem(productId);
//       return;
//     }
//     await handleUpdateQuantity(productId, currentQuantity - 1);
//   };

//   const handleRemoveItem = async (productId: number) => {
//     setRemoving(productId);
//     try {
//       // Optimistically update local state
//       const updatedProducts = cartData?.products.filter(product => product.id !== productId) || [];
//       setCartData(prev => prev ? { ...prev, products: updatedProducts } : null);
      
//       // Make API call
//       await axiosInstance.post(`api/remove-from-cart/${productId}`, {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
      
//       // Update Redux state
//       dispatch(removeFromCart(productId));
      
//       toast.success('Item removed');
//     } catch (error) {
//       console.error('Error removing item:', error);
//       toast.error('Failed to remove item');
//       // Revert to previous state on error
//       await fetchCart();
//     } finally {
//       setRemoving(null);
//     }
//   };

  

  

//   const calculateTotals = () => {
//     if (!cartData?.products?.length) {
//       return {
//         subtotal: '0.00',
//         vat: '0.00',
//         discount: '0.00',
//         total: '0.00'
//       };
//     }

//     const vatRatio = parseFloat(cartData.vat_ratio) || 0;
//     const subtotal = cartData.products.reduce((sum, product) => {
//       const price = parseFloat(product.offer_price) || parseFloat(product.price) || 0;
//       return sum + (price * product.quantity);
//     }, 0);

//     let discount = 0;
//     if (cartData.coupon_value) {
//       const couponValue = parseFloat(cartData.coupon_value) || 0;
//       discount = cartData.coupon_type === 'percentage'
//         ? subtotal * (couponValue / 100)
//         : couponValue;
//     }

//     const vatAmount = subtotal * (vatRatio / 100);
//     const total = subtotal + vatAmount - discount;
    
//     return {
//       subtotal: subtotal.toFixed(2),
//       vat: vatAmount.toFixed(2),
//       discount: discount.toFixed(2),
//       total: total.toFixed(2)
//     };
//   };

//   const totals = calculateTotals();

//   if (!token) {
//     return (
//       <div className="bg-white min-h-screen py-12 px-4">
//         <div className="max-w-md mx-auto text-center">
//           <ShoppingCart size={64} className="mx-auto text-gray-400 mb-6" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
//           <p className="text-gray-600 mb-8">Please login to view your cart</p>
//           <button 
//             onClick={() => router.push('/login')}
//             className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//           >
//             Login to Continue
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="bg-white min-h-screen py-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="animate-pulse space-y-8">
//             <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="flex gap-6 p-6 border border-gray-200 rounded-lg">
//                 <div className="w-32 h-32 bg-gray-200 rounded"></div>
//                 <div className="flex-1 space-y-4">
//                   <div className="h-5 bg-gray-200 rounded w-3/4"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                   <div className="flex gap-4">
//                     <div className="h-10 bg-gray-200 rounded w-24"></div>
//                     <div className="h-10 bg-gray-200 rounded w-32"></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             <div className="h-40 bg-gray-200 rounded-lg"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!cartData || cartData.products.length === 0) {
//     return (
//       <div className="bg-white min-h-screen py-12 px-4">
//         <div className="max-w-md mx-auto text-center">
//           <ShoppingCart size={64} className="mx-auto text-gray-400 mb-6" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
//           <p className="text-gray-600 mb-8">Looks like you haven't added any items yet</p>
//           <button 
//             onClick={() => router.push('/products')}
//             className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//           >
//             Continue Shopping
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <button 
//             onClick={() => router.back()}
//             className="flex items-center text-gray-700 hover:text-black transition cursor-pointer"
//           >
//             <ArrowLeft size={20} className="mr-2" />
//             Continue Shopping
//           </button>
//         </div>

//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart ({cartData.products.length})</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6">
//             {cartData.products.map((product) => {
//               const price = parseFloat(product.offer_price) || parseFloat(product.price) || 0;
//               const originalPrice = product.offer_price ? parseFloat(product.price) : null;
//               const isUpdating = updatingQuantity.id === product.id;
              
//               return (
//                 <div key={product.id} className="flex flex-col sm:flex-row gap-6 p-6 border border-gray-200 rounded-lg">
//                   <div className="relative w-full sm:w-40 h-40 bg-gray-100 rounded-lg overflow-hidden">
//                     <Image
//                       src={product.image || '/placeholder-product.jpg'}
//                       alt={product.name}
//                       fill
//                       className="object-contain"
//                       sizes="(max-width: 640px) 100vw, 160px"
//                     />
//                   </div>
                  
//                   <div className="flex-1 flex flex-col">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
//                         <p className="text-sm text-gray-600 mt-1">{product.brand_name}</p>
//                       </div>
//                       <button 
//                         onClick={() => handleRemoveItem(product.id)}
//                         disabled={removing === product.id}
//                         className="text-gray-400 hover:text-red-500 transition cursor-pointer"
//                       >
//                         {removing === product.id ? (
//                           <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
//                         ) : (
//                           <Trash2 size={20} />
//                         )}
//                       </button>
//                     </div>

//                     <div className="mt-4 flex items-center justify-between">
//                       <div className="flex items-center gap-2 text-black">
//                         <button
//                           onClick={() => handleDecreaseQuantity(product.id)}
//                           disabled={isUpdating || product.quantity <= 1}
//                           className="cursor-pointer w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition"
//                         >
//                           {isUpdating && updatingQuantity.type === 'dec' ? (
//                             <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
//                           ) : (
//                             <ChevronDown size={16} />
//                           )}
//                         </button>
//                         <span className="w-12 text-center text-gray-900 font-medium">
//                           {product.quantity}
//                         </span>
//                         <button
//                           onClick={() => handleIncreaseQuantity(product.id)}
//                           disabled={isUpdating}
//                           className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition"
//                         >
//                           {isUpdating && updatingQuantity.type === 'inc' ? (
//                             <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
//                           ) : (
//                             <ChevronUp size={16} />
//                           )}
//                         </button>
//                       </div>

//                       <div className="text-right">
//                         {originalPrice ? (
//                           <>
//                             <span className="text-gray-500 line-through mr-2 text-sm">
//                               {originalPrice.toFixed(2)} SAR
//                             </span>
//                             <span className="font-bold text-gray-900">
//                               {price.toFixed(2)} SAR
//                             </span>
//                           </>
//                         ) : (
//                           <span className="font-bold text-gray-900">
//                             {price.toFixed(2)} SAR
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}

//             <div className="flex justify-end pt-4">
//               <button
//                 onClick={() => {
//                   if (confirm('Are you sure you want to clear your cart?')) {
//                     dispatch(clearCart());
//                     fetchCart();
//                   }
//                 }}
//                 className="text-red-600 hover:text-red-800 flex items-center gap-2 transition cursor-pointer"
//               >
//                 <Trash2 size={18} />
//                 Clear Cart
//               </button>
//             </div>
//           </div>

//           <div className="lg:col-span-1">
//             <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
//               <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              

//               <div className="space-y-4 mb-6">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span className="font-medium text-gray-900">{totals.subtotal} SAR</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">VAT ({parseFloat(cartData.vat_ratio || '0')}%)</span>
//                   <span className="font-medium text-gray-900">{totals.vat} SAR</span>
//                 </div>
//                 {isCouponApplied && (
//                   <div className="flex justify-between text-green-600">
//                     <span>Discount</span>
//                     <span className="font-medium">-{totals.discount} SAR</span>
//                   </div>
//                 )}
//                 <div className="border-t border-gray-200 pt-4 flex justify-between">
//                   <span className="font-bold text-gray-900">Total</span>
//                   <span className="font-bold text-gray-900 text-xl">
//                     {totals.total} SAR
//                   </span>
//                 </div>
//               </div>

//               <button 
//                 onClick={() => router.push('/checkout')}
//                 className="cursor-pointer w-full py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition"
//               >
//                 Proceed to Checkout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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
      
      dispatch(setCart({
        items: data.products.map((product: CartProduct) => ({
          id: product.id,
          quantity: product.quantity || 1,
          price: parseFloat(product.offer_price) || parseFloat(product.price) || 0,
          name: product.name,
          image: product.image
        })),
        vatRatio: data.vat_ratio || '0',
        coupon: data.coupon_id ? {
          id: data.coupon_id,
          type: data.coupon_type as 'percentage' | 'fixed',
          value: parseFloat(data.coupon_value || '0'),
          valid_until: ''
        } : null
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

            <div className="flex justify-end pt-4">
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-800 flex items-center gap-2 transition cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          </div>

          <CartSummary
            subtotal={totals.subtotal}
            vat={totals.vat}
            discount={totals.discount}
            total={totals.total}
            vatRate={totals.vatRate}
            hasCoupon={hasCoupon}
            onCheckout={() => router.push('/checkout')}
            onClearCart={handleClearCart}
          />
        </div>
      </div>
    </div>
  );
}