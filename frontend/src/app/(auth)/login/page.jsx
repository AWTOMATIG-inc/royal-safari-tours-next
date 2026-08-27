"use client";

import Button from "@/components/Button";
import InputBox from "@/components/InputBox";
import { EyeCloseIcon, EyeOpenIcon } from "@/components/SvgIcons";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  // Form & View State
  const [formdata, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [step, setStep] = useState(1); // 1: Login Form, 2: OTP Screen
  const [maskedEmail, setMaskedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  // OTP Input & Timer State
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(60);
  const [expirySeconds, setExpirySeconds] = useState(300); // 5 mins = 300s
  const otpInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Resend Cooldown Timer Effect
  useEffect(() => {
    let timer;
    if (step === 2 && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, cooldown]);

  // Expiry Timer Effect
  useEffect(() => {
    let timer;
    if (step === 2 && expirySeconds > 0) {
      timer = setInterval(() => {
        setExpirySeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, expirySeconds]);

  // Step 1: Submit Credentials
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formdata.email || !formdata.password) {
      return toast.error("Email and password are required.");
    }
    try {
      setLoading(true);
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(formdata),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Login failed");
      }

      if (data.requires2FA) {
        setMaskedEmail(data.maskedEmail || formdata.email);
        setStep(2);
        setCooldown(60);
        setExpirySeconds(300);
        setOtpDigits(["", "", "", "", "", ""]);
        toast.success("Security verification code sent to your email.");
      } else {
        toast.success("Login successfully!");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  // OTP Digit Change Handler
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpDigits];
    newOtp[index] = value.slice(-1);
    setOtpDigits(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  // Keydown Handler for Backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  // Clipboard Paste Support for 6-Digit OTP
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) {
      return toast.error("Please paste a valid 6-digit numeric verification code.");
    }
    const digits = pastedData.split("");
    setOtpDigits(digits);
    otpInputRefs[5].current?.focus();
  };

  // Step 2: Verify OTP Submit
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      return toast.error("Please enter the complete 6-digit code.");
    }

    try {
      setVerifying(true);
      const res = await fetch("/api/v1/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          email: formdata.email,
          otp: fullOtp,
          rememberMe,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "OTP verification failed");
      }

      toast.success("Login successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.message || "Invalid verification code.");
    } finally {
      setVerifying(false);
    }
  };

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0) return;

    try {
      setResending(true);
      const res = await fetch("/api/v1/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email: formdata.email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Resend failed");
      }

      setCooldown(60);
      setExpirySeconds(300);
      setOtpDigits(["", "", "", "", "", ""]);
      toast.success(data.message || "A new verification code has been emailed.");
    } catch (error) {
      toast.error(error.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  // Format Expiry mm:ss
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="font-body">
      <div className="grid place-items-center h-screen bg-gray-50/50 p-4">
        <div className="w-[95%] p-6 sm:max-w-[500px] sm:w-full sm:p-8 bg-white shadow-xl border border-emerald-100 rounded-3xl transition-all">
          {step === 1 ? (
            /* STEP 1: LOGIN CREDENTIALS FORM */
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-bold text-2xl text-[#0D231E] font-body">
                  Login to Your Account
                </h1>
              </div>
              <p className="mt-1 mb-6 text-xs text-gray-500 font-medium">
                Welcome back! Enter your credentials to initiate 2FA login.
              </p>

              <form onSubmit={handleLogin} className="space-y-5">
                <InputBox
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formdata.email}
                  onChange={(e) =>
                    setFormData({ ...formdata, email: e.target.value })
                  }
                  required
                />

                <div className="relative h-fit">
                  <InputBox
                    label="Password"
                    name="password"
                    type={isShowPassword ? "text" : "password"}
                    value={formdata.password}
                    onChange={(e) =>
                      setFormData({ ...formdata, password: e.target.value })
                    }
                    required
                  />
                  <button
                    onClick={() => setIsShowPassword((prev) => !prev)}
                    className="absolute top-[55%] right-3 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    type="button"
                  >
                    {isShowPassword ? <EyeCloseIcon /> : <EyeOpenIcon />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs font-medium text-gray-600 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#0D231E] focus:ring-[#0D231E] accent-[#0D231E] cursor-pointer"
                    />
                    <span>Keep me logged in</span>
                  </label>
                </div>

                <Button
                  className="w-full bg-[#0D231E] hover:bg-[#163831] text-white py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer"
                  name={loading ? "Logging in..." : "Login"}
                />

                <p className="text-xs text-center text-gray-500 pt-2">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-[#DE8D3D] font-bold hover:underline">
                    Register Now
                  </Link>
                </p>
              </form>
            </div>
          ) : (
            /* STEP 2: 6-DIGIT EMAIL OTP VERIFICATION VIEW */
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0D231E] font-semibold mb-4 transition-colors cursor-pointer"
                >
                  <Icon icon="lucide:arrow-left" className="w-4 h-4" />
                  <span>Back to Login</span>
                </button>

                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-[#DE8D3D] flex items-center justify-center mb-3">
                  <Icon icon="lucide:mail-check" className="w-6 h-6" />
                </div>

                <h2 className="text-2xl font-bold text-[#0D231E] font-heading">
                  Enter Security Code
                </h2>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  We have sent you 6-digit verification passcode to{" "}
                  <strong className="text-[#0D231E]">{maskedEmail}</strong>.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* 6 Individual Digit Boxes */}
                <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpInputRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold text-[#0D231E] bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#DE8D3D] focus:ring-2 focus:ring-[#DE8D3D]/20 outline-none transition-all"
                    />
                  ))}
                </div>

                {/* Expiry & Resend Timers */}
                <div className="flex items-center justify-between text-xs border-t border-b border-gray-100 py-3 text-gray-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Icon icon="lucide:clock" className="w-3.5 h-3.5 text-amber-500" />
                    Expires in: <strong className="font-mono text-gray-700">{formatTime(expirySeconds)}</strong>
                  </span>

                  <button
                    type="button"
                    disabled={cooldown > 0 || resending}
                    onClick={handleResendOtp}
                    className={`font-bold transition-colors cursor-pointer ${
                      cooldown > 0 || resending
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-[#DE8D3D] hover:text-[#c47930] underline"
                    }`}
                  >
                    {resending
                      ? "Sending..."
                      : cooldown > 0
                      ? `Resend Code (${cooldown}s)`
                      : "Resend Code"}
                  </button>
                </div>

                <Button
                  className="w-full bg-[#0D231E] hover:bg-[#163831] text-white py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer"
                  name={verifying ? "Verifying Passcode..." : "Verify OTP"}
                />
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
