/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { FiLock } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Input from "@/components/inputs/Input";
import {
  registerFailure,
  registerStart,
  registerSuccess,
} from "@/redux/auth/authSlice";
import axiosInstance from "@/lib/axios";
import { RootState } from "@/redux/store";
import { z, ZodError } from "zod";
import { useRouter } from "next/navigation";
import {
  FormSchemaChangePassword,
  FormSchemaTypeChangePassword,
} from "@/schema/validations";

export default function ChangePassword() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, token } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<FormSchemaTypeChangePassword>({
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormSchemaTypeChangePassword, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const onSubmit = async () => {
    try {
      FormSchemaChangePassword.parse(formData);
      setErrors({});
      const changePassToastId = toast.loading("Changing password...");
      dispatch(registerStart());

      if (!token) {
        throw new Error("User is not authenticated");
      }

      const response = await axiosInstance.post(
        "api/auth/change-password",
        {
          old_password: formData.old_password,
          new_password: formData.new_password,
          new_password_confirmation: formData.new_password_confirmation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(registerSuccess({ token, phone: null }));
      toast.success("Password updated successfully!", { id: changePassToastId });
      setFormData({
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
      router.push("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err instanceof ZodError) {
        const newErrors: Partial<
          Record<keyof FormSchemaTypeChangePassword, string>
        > = {};
        err.issues.forEach((issue) => {
          newErrors[issue.path[0] as keyof FormSchemaTypeChangePassword] =
            issue.message;
        });
        setErrors(newErrors);
        toast.error(err.issues[0].message);
        dispatch(registerFailure("Validation failed."));
      } else {
        const message =
          err?.response?.data?.message || err.message || "Something went wrong.";
        dispatch(registerFailure(message));
        toast.error(message);
      }
    }
  };

  return (
    <main className="bg-gradient-to-br h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900  flex items-center justify-center px-4 py-10 text-white relative">
      <Toaster position="top-center" />
      <motion.form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="w-full max-w-lg p-8 space-y-6 rounded-2xl shadow-xl bg-[#181A20] border border-[#2c2f36]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-center text-[#E7C9A5]">
          🔐 Change Password
        </h2>
        <p className="text-sm text-center text-gray-400">
          Enter your old and new password to update your account
        </p>

        <Input
          name="old_password"
          label="Old Password"
          type="password"
          icon={<FiLock />}
          placeholder="********"
          value={formData.old_password}
          onChange={handleChange}
          error={errors.old_password}
        />

        <Input
          name="new_password"
          label="New Password"
          type="password"
          icon={<FiLock />}
          placeholder="********"
          value={formData.new_password}
          onChange={handleChange}
          error={errors.new_password}
        />

        <Input
          name="new_password_confirmation"
          label="Confirm New Password"
          type="password"
          icon={<FiLock />}
          placeholder="********"
          value={formData.new_password_confirmation}
          onChange={handleChange}
          error={errors.new_password_confirmation}
        />

        {error && (
          <div className="text-center text-red-400 text-sm font-medium">{error}</div>
        )}

        <motion.button
          type="submit"
          className="w-full py-3 text-sm font-semibold text-black bg-[#E7C9A5] rounded-xl hover:bg-[#d8b58e] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          disabled={loading} 
        >
          Change Password
        </motion.button>
      </motion.form>
    </main>
  );
}
