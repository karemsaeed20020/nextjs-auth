import { CartData } from '@/types/cart';

export function useCartCalculations(cartData: CartData | null) {
  if (!cartData?.products?.length) {
    return {
      subtotal: '0.00',
      vat: '0.00',
      discount: '0.00',
      total: '0.00'
    };
  }

  const vatRatio = parseFloat(cartData.vat_ratio) || 0;
  const subtotal = cartData.products.reduce((sum, product) => {
    const price = parseFloat(product.offer_price) || parseFloat(product.price) || 0;
    return sum + (price * product.quantity);
  }, 0);

  let discount = 0;
  if (cartData.coupon_value) {
    const couponValue = parseFloat(cartData.coupon_value) || 0;
    discount = cartData.coupon_type === 'percentage'
      ? subtotal * (couponValue / 100)
      : couponValue;
  }

  const vatAmount = subtotal * (vatRatio / 100);
  const total = subtotal + vatAmount - discount;
  
  return {
    subtotal: subtotal.toFixed(2),
    vat: vatAmount.toFixed(2),
    discount: discount.toFixed(2),
    total: total.toFixed(2),
    vatRate: vatRatio.toString()
  };
}