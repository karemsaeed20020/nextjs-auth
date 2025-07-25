"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setPhoneAndCode } from "@/redux/auth/authSlice";

interface OtpVerificationProps {
  phone: string;
  postUrl: string;
  resendUrl: string;
  redirectUrl: string;
  usage?: string;
  onSuccess?: (code: string) => void;
}

export default function OtpVerification({
  phone,
  postUrl,
  resendUrl,
  redirectUrl,
  usage = "verify",
  onSuccess,
}: OtpVerificationProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [code, setCode] = useState(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!phone) router.push("/change-phone");
  }, [phone, router]);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    inputsRef.current[activeIndex]?.focus();
  }, [activeIndex]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const val = e.target.value;
    if (!/^\d?$/.test(val)) return;

    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);

    if (val && idx < 3) {
      setActiveIndex(idx + 1);
    } else if (!val && idx > 0) {
      setActiveIndex(idx);
    }
    setError("");
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace") {
      if (code[idx]) {
        const newCode = [...code];
        newCode[idx] = "";
        setCode(newCode);
      } else if (idx > 0) {
        setActiveIndex(idx - 1);
        const newCode = [...code];
        newCode[idx - 1] = "";
        setCode(newCode);
      }
      setError("");
    } else if (e.key === "ArrowLeft" && idx > 0) {
      setActiveIndex(idx - 1);
    } else if (e.key === "ArrowRight" && idx < 3) {
      setActiveIndex(idx + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const otp = code.join("");
    if (otp.length < 4) {
      setError("Please enter a 4-digit code.");
      return;
    }

    if (timer === 0) {
      setError("Code expired. Please resend a new code.");
      return;
    }

    setLoading(true);
    toast.loading("Verifying code...", { id: "verify-toast" });

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await axiosInstance.post(postUrl, {
        phone,
        code: otp,
        usage,
      });

      toast.success("Code verified! Redirecting...", { id: "verify-toast" });
      dispatch(setPhoneAndCode({ phone, code: otp }));

      if (onSuccess) onSuccess(otp);
      router.push(redirectUrl);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err.response?.data?.message || "Invalid code, try again.";
      setError(message);
      toast.error(message, { id: "verify-toast" });
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setLoading(true);
    setError("");
    toast.loading("Sending code...", { id: "send-code-toast" });

    try {
      await axiosInstance.post(resendUrl, { phone, usage });
      setCode(["", "", "", ""]);
      setActiveIndex(0);
      setTimer(60);
      toast.success("Code resent!", { id: "send-code-toast" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to resend code.";
      setError(message);
      toast.error(message, { id: "send-code-toast" });
    } finally {
      setLoading(false);
    }
  };

  const isVerifyButtonDisabled = loading || code.join("").length < 4 || timer === 0;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex-col items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-blur p-8 rounded-xl shadow-lg space-y-6 border border-gray-700"
      >
        <h2 className="text-2xl font-bold text-white text-center">
          Enter Verification Code
        </h2>

        <div className="flex justify-center gap-4">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                if (el) {
                  inputsRef.current[i] = el;
                }
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-15 h-15 text-center text-2xl font-bold rounded-lg bg-white/20 text-white outline-none border border-gray-500 focus:ring-2 ring-[#E7C9A5] transition-all"
            />
          ))}
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        {timer === 0 && (
          <p className="text-yellow-400 text-sm text-center">
            Code expired. Please resend a new code.
          </p>
        )}

        <button
          type="submit"
          disabled={isVerifyButtonDisabled}
          className={`cursor-pointer w-full py-3 text-sm font-semibold text-black bg-[#E7C9A5] rounded-xl transition-all duration-200
            ${
              isVerifyButtonDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#d8b58e]"
            }`}
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>

        <div className="text-center text-sm text-gray-300">
          Didn’t get the code?{" "}
          <button
            onClick={resendCode}
            type="button"
            className="text-[#E7C9A5] hover:underline disabled:opacity-50"
            disabled={timer > 0 || loading}
          >
            Resend {timer > 0 && `(${timer})`}
          </button>
        </div>
      </form>
    </div>
  );
}
