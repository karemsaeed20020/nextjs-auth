"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { clearPhoneAndCode } from '@/redux/auth/authSlice';
import Input from '@/components/inputs/Input'; 

interface ApiResponse {
  status: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any; 
  token?: string;
}

const ResetPasswordPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const phone = useSelector((state: RootState) => state.auth.phone);
  const code = useSelector((state: RootState) => state.auth.code);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Please enter all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    toast.loading('Resetting password...', { id: 'reset-toast' });

    try {
      const response = await axiosInstance.post<ApiResponse>('api/auth/forget-password', {
        phone,
        code,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      if (response.data.status) {
        toast.success(response.data.message || 'Password reset successfully!', { id: 'reset-toast' });
        dispatch(clearPhoneAndCode());
        router.push('/login');
      } else {
        toast.error(response.data.message || 'Password reset failed.', { id: 'reset-toast' });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Password reset failed.', { id: 'reset-toast' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-white/10 backdrop-blur p-8 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-center text-3xl font-bold text-white mb-6">Reset Password</h2>
        <form onSubmit={handleReset} className="space-y-6">
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required={true}
            minLength={6}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required={true}
            minLength={6}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-lg bg-[#E7C9A5] text-black font-semibold hover:bg-[#d8b58e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;