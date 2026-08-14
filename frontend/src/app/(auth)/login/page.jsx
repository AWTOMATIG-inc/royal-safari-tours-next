"use client";
import Button from "@/components/Button";
import InputBox from "@/components/InputBox";
import { EyeCloseIcon, EyeOpenIcon } from "@/components/SvgIcons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formdata.email || !formdata.password) {
      toast.error("fields are required");
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
      const user = await res.json();
      if (user.error) {
        throw new Error(user.error);
      }
      if (user) {
        toast.success("Login successfully!");
        router.push("/dashboard");
      }
      setLoading(false);
      console.log(user);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <div>
      <div className="grid place-items-center h-screen">
        <div className="w-[95%] mt-4 sm:mt-0 p-6 sm:max-w-[500px] sm:w-full sm:p-8 bg-white shadow border border-green-200 rounded-lg">
          <h1 className="font-semibold text-3xl text-gray-700 mt-3">
            Login to Your Account
          </h1>
          <p className="mt-1 mb-8 text-gray-500">
            Welcome back! Please enter your credentials to continue.
          </p>
          <form onSubmit={handleLogin} className=" space-y-5" action="#">
            <InputBox
              label="Email"
              name="email"
              value={formdata.email}
              onChange={(e) =>
                setFormData({ ...formdata, email: e.target.value })
              }
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
              />
              <button
                onClick={() => setIsShowPassword((prev) => !prev)}
                className="absolute top-[55%] right-2 text-gray-500 cursor-pointer"
                type="button"
              >
                {isShowPassword ? <EyeCloseIcon /> : <EyeOpenIcon />}
              </button>
            </div>
            <Button
              className="w-full"
              name={loading ? "Logging..." : "Login"}
            />

            <p className="text-lg mt-8">
              Don't have an account?{" "}
              <Link href="/register" className="text-gold font-semibold">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
