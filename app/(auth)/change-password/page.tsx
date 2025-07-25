
"use client";
import { useState } from "react";
import { FiLock } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Input from "@/components/inputs/Input";
import { registerFailure, registerStart, registerSuccess } from "@/redux/auth/authSlice";
import axiosInstance from "@/lib/axios";
import { RootState } from "@/redux/store";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";
import { FormSchemaChangePassword, FormSchemaTypeChangePassword } from "@/schema/validations";

interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  image?: string;
}

export default function ChangePassword() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, token, user } = useSelector((state: RootState) => ({
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token,
    user: state.auth.user as User | null
  }));

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      if (!user) {
        throw new Error("User data not available");
      }

      dispatch(registerSuccess({ 
        token: response.data.token || token, 
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          image: user.image
        }
      }));
      
      toast.success("Password updated successfully!", { id: changePassToastId });
      setFormData({
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
      router.push("/login");
      
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const newErrors: Partial<
          Record<keyof FormSchemaTypeChangePassword, string>
        > = {};
        err.issues.forEach((issue) => {
          const path = issue.path[0] as keyof FormSchemaTypeChangePassword;
          newErrors[path] = issue.message;
        });
        setErrors(newErrors);
        toast.error(err.issues[0].message);
        dispatch(registerFailure("Validation failed."));
      } else if (err instanceof Error) {
        const message = err.message || "Something went wrong.";
        dispatch(registerFailure(message));
        toast.error(message);
      } else {
        dispatch(registerFailure("An unknown error occurred"));
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <main className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen flex items-center justify-center px-4 py-10 text-white relative">
      <motion.form
        onSubmit={onSubmit}
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
          <div className="text-center text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <motion.button
          type="submit"
          className="w-full py-3 text-sm font-semibold text-black bg-[#E7C9A5] rounded-xl hover:bg-[#d8b58e] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          disabled={loading} 
        >
          {loading ? "Processing..." : "Change Password"}
        </motion.button>
      </motion.form>
    </main>
  );
}
