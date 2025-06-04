"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BsTelephone } from "react-icons/bs";
import { motion } from "framer-motion";
import Input from "@/components/inputs/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast, Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setLoading, setForgotPasswordPhone } from "@/redux/auth/authSlice";
import { useState } from "react";
import OtpVerification from "@/components/Verify-Otp";

const FormSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
});

type FormSchemaType = z.infer<typeof FormSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const forgotPasswordPhone = useSelector(
    (state: RootState) => state.auth.phone 
  );
  const [showOtpVerification, setShowOtpVerification] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: FormSchemaType) => {
    dispatch(setLoading(true));
    toast.loading("Sending reset code...", { id: "send-code-toast" });

    try {
      const response = await axiosInstance.post("api/auth/send-code", {
        phone: data.phone,
        usage: "forget_password",
      });

      if (response.status === 200) {
        toast.success("A reset code has been sent to your phone.", {
          id: "send-code-toast",
        });
        dispatch(setForgotPasswordPhone(data.phone));
        setShowOtpVerification(true);
      } else {
        const message =
          response.data?.message || "Failed to send reset code.";
        toast.error(message, { id: "send-code-toast" });
        if (
          response.status === 404 ||
          response.data?.error === "phone_not_found"
        ) {
          setError("phone", { type: "manual", message });
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send reset code.";
      toast.error(errorMessage, { id: "send-code-toast" });
      if (
        error.response?.status === 404 ||
        error.response?.data?.error === "phone_not_found"
      ) {
        setError("phone", {
          type: "manual",
          message: errorMessage,
        });
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleOtpSuccess = () => {
    router.push("/reset-password");
  };

  const formVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
    whileTap: { scale: 0.95 },
    whileHover: { scale: 1.02 },
  };

  if (showOtpVerification) {
    return (
      <OtpVerification
        phone={forgotPasswordPhone || getValues("phone")}
        postUrl="api/auth/verify-code"
        resendUrl="api/auth/send-code"
        redirectUrl="/reset-password"
        usage="forget_password"
        onSuccess={handleOtpSuccess}
      />
    );
  }

  return (
    <div className="flex items-center justify-center px-4 py-10 w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-gradient-bg">
      <Toaster position="top-right" />
      {loading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-t-transparent border-[#E7C9A5] rounded-full animate-spin"></div>
          <span className="ml-4 text-lg font-semibold text-white">
            Sending...
          </span>
        </div>
      )}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 bg-white/10 backdrop-blur-md p-8 md:p-10 rounded-xl shadow-2xl border border-gray-800"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <motion.h2
          className="text-3xl font-extrabold text-center text-white mb-4"
          variants={itemVariants}
        >
          Forgot Password?
        </motion.h2>
        <motion.p
          className="text-center text-gray-400 text-sm mb-6"
          variants={itemVariants}
        >
          Enter your phone number and we will send you a code to reset your
          password.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Input
            label="Phone Number"
            type="text"
            icon={<BsTelephone />}
            placeholder="e.g., 01012345678 or 0549000031"
            {...register("phone")}
            error={errors.phone?.message}
            disabled={loading}
          />
        </motion.div>
        <motion.button
          type="submit"
          className="w-full py-3 px-6 rounded-lg bg-[#E7C9A5] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
          disabled={loading}
          variants={buttonVariants}
          whileTap="whileTap"
          whileHover="whileHover"
        >
          {loading ? "Sending..." : "Send Reset Code"}
        </motion.button>
        <motion.div
          variants={itemVariants}
          className="text-center text-sm mt-3"
        >
          <Link href="/login" className="text-blue-400 hover:underline">
            Remembered your password? Log In
          </Link>
        </motion.div>
      </motion.form>
    </div>
  );
}