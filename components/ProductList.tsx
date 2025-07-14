"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { ShoppingCart, Heart } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { Product, ProductListProps } from "@/types";
import { Pagination } from "antd";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { addFavorite, removeFavorite } from "@/redux/favorites/favoritesSlice";
import { addToCart } from "@/redux/cart/cartSlice";

const PRODUCTS_PER_PAGE = 10;

const ProductList = ({ filters }: ProductListProps) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [products, setProducts] = useState<Product[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const router = useRouter();

  const fallbackImage =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png";

  useEffect(() => setPage(1), [JSON.stringify(filters)]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const params: Record<string, string> = {
          skip: String((page - 1) * PRODUCTS_PER_PAGE),
          take: String(PRODUCTS_PER_PAGE),
          sort: filters?.price === "low" ? "price" : "-price",
        };

        if (filters?.brandIds?.length) params["filter[brand_id]"] = filters.brandIds.join(",");
        if (filters?.subCategoryIds?.length) params["filter[sub_category_id]"] = filters.subCategoryIds.join(",");
        if (filters?.rating) params["filter[rates_avg_value]"] = String(filters.rating);

        const res = await axiosInstance("api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          params,
        });

        setProducts(res.data.data || []);
        setTotal(res.data.count || 0);
        setImageErrors({});
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token, page, filters]);

  const handleImageError = (id: number) => setImageErrors((prev) => ({ ...prev, [id]: true }));

  const toggleFavorite = async (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) return toast.error("Please login to manage favorites");

    const formData = new FormData();
    formData.append("product_id", productId.toString());

    try {
      await axiosInstance.post("api/favorites", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (favorites.includes(productId)) {
        dispatch(removeFavorite(productId));
        toast.success("Removed from favorites");
      } else {
        dispatch(addFavorite(productId));
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to toggle favorite");
    }
  };

  const handleAddToCart = async (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) return toast.error("Please login to add to cart");

    try {
      setAddingToCart(productId);
      const formData = new FormData();
      formData.append("product_id", productId.toString());
      formData.append("quantity", "1");

      await axiosInstance.post("api/add-to-cart", formData, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });

      dispatch(addToCart(productId));
      toast.success("Added to cart");
    } catch  {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div className="px-4">
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
            <div key={i} className="flex flex-col rounded-xl shadow bg-white animate-pulse h-full overflow-hidden">
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
              const imageUrl = imageErrors[product.id] ? fallbackImage : product.image || fallbackImage;
              const isFavorite = favorites.includes(product.id);
              const isInCart = cartItems.includes(product.id);
              const isLoading = addingToCart === product.id;

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="group flex flex-col rounded-xl shadow bg-white hover:shadow-md transition overflow-hidden relative cursor-pointer"
                >
                  <div className="relative p-3 bg-gray-100 rounded-t-xl">
                    <Image
                      src={imageUrl}
                      alt={product.name || "Product"}
                      width={300}
                      height={200}
                      unoptimized
                      className="object-cover w-full h-[200px] rounded"
                      onError={() => handleImageError(product.id)}
                    />

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded">
                      <button
                        onClick={(e) => toggleFavorite(product.id, e)}
                        className="w-12 h-12 flex items-center justify-center"
                      >
                        <Heart
                          size={32}
                          className={`transition-colors duration-300 ${
                            isFavorite ? "text-red-600 fill-red-600 cursor-pointer" : "text-white hover:text-red-600 hover:fill-red-600 cursor-pointer"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-sm text-gray-800 line-clamp-2 mb-1">
                        {product.name || "Unnamed"}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-blue-600 font-bold text-sm">
                          {product.price} <span className="text-xs">SAR</span>
                        </p>
                        {isFavorite && <Heart size={20} className="text-red-500 fill-red-500" />}
                      </div>
                    </div>

                    <button
                      className={`mt-4 w-full cursor-pointer ${
                        isInCart || isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                      } text-white py-2 text-sm rounded flex items-center justify-center gap-2`}
                      onClick={(e) => !isInCart && !isLoading && handleAddToCart(product.id, e)}
                      disabled={isInCart || isLoading}
                    >
                      <ShoppingCart size={16} />
                      {isInCart ? "Added" : isLoading ? "Loading..." : "Add to Cart"}
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
