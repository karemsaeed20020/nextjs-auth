
"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, FormSchemaType } from "@/schema/validations";
import Input from "@/components/inputs/Input";
import { CiUser } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";
import { FiLock, FiMail } from "react-icons/fi";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { registerStart, registerSuccess, registerFailure } from "@/redux/auth/authSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import OtpVerification from "@/components/Verify-Otp";

const getPasswordScore = (password: string) => {
  let score = 0;
  if (!password) return score;
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 10) score++;
  return score;
};

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [registeredPhone, setRegisteredPhone] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const passwordValue = watch("password", "");
  const passwordScore = getPasswordScore(passwordValue);

  const onSubmit = async (data: FormSchemaType) => {
    dispatch(registerStart());
    const payload = {
      name: data.username,
      email: data.email,
      phone: data.phone,
      password: data.password,
      password_confirmation: data.password_confirmation,
    };

    try {
      const response = await axiosInstance.post("api/auth/register", payload);
      if (response.status === 201 || response.status === 200) {
        setRegisteredPhone(data.phone);
        setIsOtpStep(true);
        // Updated to match the expected payload structure
        dispatch(registerSuccess({ 
          token: response.data.token || "", 
          user: {
            id: 0, // Temporary ID, will be updated after verification
            name: data.username,
            phone: data.phone,
            email: data.email
          }
        }));
        toast.success("Registration successful! Please verify OTP.");
      } else {
        throw new Error("Registration failed.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Registration failed.";
      dispatch(registerFailure(message));
      toast.error(message);
    }
  };

  if (isOtpStep) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-10">
        <Toaster position="top-right" />
        <OtpVerification
          phone={registeredPhone}
          postUrl="/api/auth/verify"
          resendUrl="/api/auth/send-code"
          redirectUrl="/login"
          onSuccess={() => router.push("/login")}
        />
      </main>
    );
  }

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
          <h2 className="text-3xl font-bold mb-6 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Username"
              type="text"
              icon={<CiUser />}
              placeholder="Your username"
              {...register("username")}
              error={errors.username?.message}
            />

            <Input
              label="Email"
              type="email"
              icon={<FiMail />}
              placeholder="example@domain.com"
              {...register("email")}
              error={errors.email?.message}
            />

            <Input
              label="Phone Number"
              type="text"
              icon={<BsTelephone />}
              placeholder="+(XXX) XXX-XXXX"
              {...register("phone")}
              error={errors.phone?.message}
            />

            <Input
              label="Password"
              type="password"
              icon={<FiLock />}
              placeholder="********"
              {...register("password")}
              error={errors.password?.message}
            />

            {passwordValue && (
              <div className="flex gap-1 mt-1">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span
                      key={i}
                      className="w-full h-2 rounded-xl overflow-hidden bg-gray-300"
                    >
                      <div
                        className={`h-full ${
                          i < passwordScore
                            ? passwordScore <= 2
                              ? "bg-red-400"
                              : passwordScore < 4
                              ? "bg-yellow-400"
                              : "bg-green-500"
                            : "bg-gray-300"
                        }`}
                        style={{ width: i < passwordScore ? "100%" : "0%" }}
                      />
                    </span>
                  ))}
              </div>
            )}
            <Input
              label="Confirm Password"
              type="password"
              icon={<FiLock />}
              placeholder="********"
              {...register("password_confirmation")}
              error={errors.password_confirmation?.message}
            />

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full py-3 bg-[#E7C9A5] text-black font-semibold rounded-lg hover:bg-[#d6b58f] transition duration-200"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="mt-6 text-center text-sm text-gray-300">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-[#E7C9A5] hover:text-[#d6b58f] hover:underline transition"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
