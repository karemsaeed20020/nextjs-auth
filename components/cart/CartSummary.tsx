
interface CartSummaryProps {
  subtotal: string;
  vat: string;
  discount: string;
  total: string;
  vatRate: string;
  hasCoupon: boolean;
  onCheckout: () => void;
  onClearCart: () => void;
}

export function CartSummary({
  subtotal,
  vat,
  discount,
  total,
  vatRate,
  hasCoupon,
  onCheckout,
  // onClearCart,
}: CartSummaryProps) {
  return (
    <div className="lg:col-span-1">
      <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">{subtotal} SAR</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">VAT ({vatRate}%)</span>
            <span className="font-medium text-gray-900">{vat} SAR</span>
          </div>
          {hasCoupon && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span className="font-medium">-{discount} SAR</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-4 flex justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-gray-900 text-xl">
              {total} SAR
            </span>
          </div>
        </div>

        <button 
          onClick={onCheckout}
          className="cursor-pointer w-full py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
