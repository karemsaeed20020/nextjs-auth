import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface ProductBreadcrumbProps {
  category?: string;
  productName: string;
}

const ProductBreadcrumb = ({ category, productName }: ProductBreadcrumbProps) => {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
            Home
          </Link>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            <Link href="/products" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">
              {category || 'Product'}
            </Link>
          </div>
        </li>
        <li aria-current="page">
          <div className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
              {productName}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
};

export default ProductBreadcrumb;