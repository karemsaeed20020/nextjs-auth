"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/inputs/Input";
import axiosInstance from "@/lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { loginStart, loginSuccess, loginFailure } from "@/redux/auth/authSlice";
import { LoginFormType, loginSchema } from "@/schema/validations";
import { MdLock, MdPhone } from "react-icons/md";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, token } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormType) => {
    try {
      dispatch(loginStart());
      const res = await axiosInstance.post("api/auth/login", data);
      const userToken = res.data.token;
      dispatch(loginSuccess(userToken));
      toast.success("Logged in successfully");
      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err?.response?.data?.message || "Login failed";
      dispatch(loginFailure(message));
      toast.error(message);
    }
  };

  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }
  }, [token]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-10">
      <Toaster position="top-center" />
      {loading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-t-transparent border-[#E7C9A5] rounded-full animate-spin"></div>
          <span className="ml-4 text-lg font-semibold text-white">
            Loading...
          </span>
        </div>
      )}
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl p-8 md:p-10 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              type="text"
              label="Phone"
              placeholder="Enter your phone number"
              icon={<MdPhone />}
              error={errors.phone?.message}
              register={register("phone")}
            />
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              icon={<MdLock />}
              error={errors.password?.message}
              register={register("password")}
            />

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-300 hover:text-blue-100 hover:underline transition"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#E7C9A5] text-black font-semibold rounded-lg hover:bg-[#d6b58f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E7C9A5] transition duration-200"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && (
              <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-300">
            Dont have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-[#E7C9A5] hover:text-[#d6b58f] hover:underline transition"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
