"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function Account() {
  const { user } = useAuth();
  const fileRef = useRef(null);
  const nameRef = useRef(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    if (user?.avatar) {
      formData.append("oldAvatar", user.avatar);
    }
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload profile picture");
      }
      toast.success("Profile picture updated!");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to update profile picture");
    }
  };

  const handleNameChange = async (e) => {
    e.preventDefault();
    const username = nameRef?.current?.value;
    if (!username) return;
    const formData = new FormData();
    formData.append("name", username);
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${user?.id}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to change name!");
      }
      setLoading(false);
      toast.success("Name updated successfully!");
      window.location.reload();
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      console.error("Failed to change name!", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <DashboardPageHeader
        title="Account Settings"
        description="Manage your admin profile, avatar, credentials, and access role."
      />

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-8 sm:p-10 space-y-8">
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-gray-100">
          <div className="relative group">
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#2cb775]/20 shadow-md">
              <Image
                src={
                  user?.avatar
                    ? `/api/uploads/user/${user?.avatar}`
                    : "/avatar.png"
                }
                alt={user?.name || "User Avatar"}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleProfileChange}
              hidden
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[#0D231E] text-white hover:bg-[#2cb775] transition-colors shadow-lg cursor-pointer"
              title="Change avatar"
            >
              <Icon icon="lucide:camera" className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#0D231E] font-inter">
              {user?.name || "Admin Account"}
            </h2>
            <p className="text-sm text-gray-500 font-inter font-light">
              {user?.email || "admin@royalsafari.com"}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2cb775]/10 text-[#2cb775] border border-[#2cb775]/20 text-xs font-semibold uppercase tracking-wider">
                <Icon icon="lucide:shield-check" className="w-3.5 h-3.5" />
                {user?.role || "Administrator"}
              </span>
            </div>
          </div>
        </div>

        {/* Account Information Details */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-[#0D231E] font-inter">
            Personal Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Name Field */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">
                  Full Name
                </span>
                <button
                  onClick={() => setIsEditingName((prev) => !prev)}
                  className="text-xs font-semibold text-[#2cb775] hover:text-[#DE8D3D] transition-colors flex items-center gap-1 font-inter cursor-pointer"
                >
                  <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
                  <span>{isEditingName ? "Cancel" : "Edit"}</span>
                </button>
              </div>

              {isEditingName ? (
                <form onSubmit={handleNameChange} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    ref={nameRef}
                    defaultValue={user?.name}
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-inter text-[#0D231E] focus:outline-none focus:border-[#2cb775]"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-semibold px-4 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </form>
              ) : (
                <p className="text-base font-bold text-[#0D231E] font-inter">
                  {user?.name || "Not set"}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-inter">
                Email Address
              </span>
              <p className="text-base font-bold text-[#0D231E] font-inter font-mono">
                {user?.email || "admin@royalsafari.com"}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
