"use client";
import { useState } from "react";
import { BsTelephone } from "react-icons/bs";
import { FiLock } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { z, ZodError } from "zod";
import { RootState } from "@/redux/store";

import Input from "@/components/inputs/Input";
import axiosInstance from "@/lib/axios";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "@/redux/auth/authSlice";
import OtpVerification from "@/components/Verify-Otp";


const formSchema = z.object({
  newPhone: z.string().min(1, "New phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function ChangePhone() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    newPhone: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [showVerifyOtp, setShowVerifyOtp] = useState(false);
  const [otpPhone, setOtpPhone] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    try {
      formSchema.parse(formData);
      setErrors({});
      const toastId = toast.loading("Updating phone number...");
      dispatch(registerStart());

      const { data } = await axiosInstance.post("api/auth/change-phone", {
        phone: formData.newPhone,
        password: formData.password,
      });

      const { token, phone } = data;
      await axiosInstance.post("api/auth/send-code", {
        phone: formData.newPhone,
        usage: "verify",
      });
      dispatch(registerSuccess({ token, phone }));
      localStorage.setItem("forgotPasswordPhone", formData.newPhone);

      toast.success("Phone number updated! OTP sent.", { id: toastId });
      setOtpPhone(formData.newPhone);
      setShowVerifyOtp(true);
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const validationErrors: Partial<Record<keyof FormData, string>> = {};
        err.issues.forEach((issue) => {
          validationErrors[issue.path[0] as keyof FormData] = issue.message;
        });
        setErrors(validationErrors);
        toast.error(err.issues[0].message);
        dispatch(registerFailure("Validation failed."));
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = (err as any)?.response?.data?.message || "Something went wrong.";
        toast.error(message);
        dispatch(registerFailure(message));
      }
    }
  };

  if (showVerifyOtp && otpPhone) {
    return (
      <OtpVerification
        phone={otpPhone}
        postUrl="api/auth/verify"
        resendUrl="api/auth/send-code"
        redirectUrl="/login" 
        usage="verify"
        onSuccess={() => {
          toast.success("Phone verified successfully!");
        }}
      />
    );
  }

  return (
    <main className="bg-gray-500 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-10 text-white relative">
      <Toaster position="top-right" />

      {loading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-t-transparent border-[#E7C9A5] rounded-full animate-spin"></div>
          <span className="ml-4 text-lg font-semibold text-white">Processing...</span>
        </div>
      )}

      <motion.form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg p-8 space-y-6 rounded-2xl shadow-xl bg-[#181A20] border border-[#2c2f36]"
      >
        <h2 className="text-3xl font-bold text-center text-[#E7C9A5]">📞 Change Phone Number</h2>
        <p className="text-sm text-center text-gray-400">
          Enter your new phone number and current password to update your account
        </p>

        <Input
          name="newPhone"
          label="New Phone Number"
          type="text"
          icon={<BsTelephone />}
          placeholder="+(XXX) XXX-XXXX"
          value={formData.newPhone}
          onChange={handleChange}
          error={errors.newPhone}
        />

        <Input
          name="password"
          label="Password"
          type="password"
          icon={<FiLock />}
          placeholder="********"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        {error && <div className="text-center text-red-400 text-sm font-medium">{error}</div>}

        <motion.button
          type="submit"
          className="w-full py-3 text-sm font-semibold text-black bg-[#E7C9A5] rounded-xl hover:bg-[#d8b58e] transition-all duration-200"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Phone Number"}
        </motion.button>
      </motion.form>
    </main>
  );
}
