'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { removeFavorite, setFavorites } from "@/redux/favorites/favoritesSlice";
import { Heart } from "lucide-react";

const FavoritePage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await axiosInstance.get("api/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          params: {
            skip: 0,
            take: 50,
          },
        });

        const data = res.data.data || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const productIds = data.map((item: any) => item.product_id);
        dispatch(setFavorites(productIds));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const favoriteProducts = data.map((item: any) => ({
          id: item.product_id,
          name: item.product_name,
          image: item.product_image?.[0] || "/placeholder.png",
          price: item.product_price,
        }));

        setProducts(favoriteProducts);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
        toast.error("Failed to fetch favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token, dispatch]);

  const handleRemoveFavorite = async (productId: number) => {
  if (!token) return toast.error("Please login");

  try {
    const formData = new FormData();
    formData.append("product_id", productId.toString());

    await axiosInstance.post("api/favorites", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    dispatch(removeFavorite(productId));
    setProducts((prev) => prev.filter((item) => item.id !== productId));
    toast.success("Removed from favorites");
  } catch (error) {
    console.error("Failed to remove favorite:", error);
    toast.error("Failed to remove from favorites");
  }
};


  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
         Your Favorite Products
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No favorite products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-lg border border-gray-200 bg-white shadow hover:shadow-md transition cursor-pointer"
            >
              <div
                className="flex justify-center items-center bg-gray-100 rounded-t-lg p-4"
                onClick={() => router.push(`/products/${product.id}`)}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={120}
                  height={120}
                  className="object-contain rounded-md"
                  unoptimized
                />
              </div>

              <div className="p-4">
                <h2 className="text-md font-semibold text-gray-800 line-clamp-2 mb-2">
                  {product.name}
                </h2>
                <p className="text-blue-600 font-bold text-sm mb-4">
                  {product.price} <span className="text-xs">SAR</span>
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFavorite(product.id);
                  }}
                  className="w-full bg-red-100 text-red-600 hover:bg-red-200 transition font-medium py-2 px-4 rounded flex items-center justify-center gap-2"
                >
                  <Heart size={18} className="text-red-600" />
                  Remove from Favorites
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
