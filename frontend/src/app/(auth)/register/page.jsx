"use client";
import Button from "@/components/Button";
import InputBox from "@/components/InputBox";
import { EyeCloseIcon, EyeOpenIcon } from "@/components/SvgIcons";
import { userSchema } from "@/yup/userSchema";

import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowCPassword, setIsShowCPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
  });
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status == 403) {
        throw new Error("Only @fabusiness.com emails are allowed.");
      }
      if (res.status == 409) {
        throw new Error("Email already Exists!");
      }
      const user = await res.json();
      if (user) {
        toast.success("Register successfully!");
        router.push("/login");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <div>
      <div className="grid place-items-center min-h-[90vh] ">
        <div className="w-[95%] mt-4 sm:mt-0 p-6 sm:max-w-[500px] sm:w-full sm:p-8 bg-white shadow border border-green-200 rounded-lg">
          <h1 className="font-semibold text-3xl text-gray-700 mt-3">
            Create you Account
          </h1>
          <p className="mt-1 mb-8 text-gray-500">
            Please provide your information to create a new account.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className=" space-y-5"
            action="#"
          >
            <div>
              <InputBox {...register("name")} label="Your Fullname" />
              <p className="text-red-600 text-sm">{errors.name?.message}</p>
            </div>
            <div>
              <InputBox {...register("email")} label="Your Email (Business)" />
              <p className="text-red-600 text-sm">{errors.email?.message}</p>
            </div>
            <div className="relative">
              <InputBox
                {...register("password")}
                label="Password"
                type={isShowPassword ? "text" : "password"}
              />
              <p className="text-red-600 text-sm">{errors.password?.message}</p>
              <button
                onClick={() => setIsShowPassword((prev) => !prev)}
                className="absolute top-[55%] right-2 text-gray-500 cursor-pointer"
                type="button"
              >
                {isShowPassword ? <EyeCloseIcon /> : <EyeOpenIcon />}
              </button>
            </div>
            <div className="relative">
              <InputBox
                {...register("confirmPassword")}
                label="Confirm Password"
                type={isShowCPassword ? "text" : "password"}
              />
              <p className="text-red-600 text-sm">
                {errors.confirmPassword?.message}
              </p>
              <button
                onClick={() => setIsShowCPassword((prev) => !prev)}
                className="absolute top-[55%] right-2 text-gray-500 cursor-pointer"
                type="button"
              >
                {isShowCPassword ? <EyeCloseIcon /> : <EyeOpenIcon />}
              </button>
            </div>

            <Button
              className="w-full"
              name={loading ? "Registering..." : "Register"}
            />
            <p className="text-lg mt-4">
              Do you have an account?{" "}
              <Link href="/login" className="text-gold font-semibold">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
