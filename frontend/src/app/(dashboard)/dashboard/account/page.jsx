"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { useAuth } from "@/hooks/useAuth";
import { getImageUrl } from "@/lib/getImageUrl";
import { changePassword } from "@/lib/auth";
import { Icon } from "@iconify/react";
import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";

const getInitials = (name) => {
  if (!name) return "A";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export default function Account() {
  const { user } = useAuth();
  const fileRef = useRef(null);
  const nameRef = useRef(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const rawPhoto = user?.avatar || user?.photo;
  const avatarUrl = rawPhoto ? getImageUrl(rawPhoto) : null;

  useEffect(() => {
    setImageError(false);
  }, [rawPhoto]);

  const handleProfileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    if (user?.avatar) {
      formData.append("oldAvatar", user.avatar);
    }
    try {
      const response = await fetch(`/api/v1/users/${user?.id}`, {
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
      const response = await fetch(`/api/v1/users/${user?.id}`, {
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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    setPasswordSubmitting(true);
    const result = await changePassword({
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });
    setPasswordSubmitting(false);

    if (!result.success) {
      toast.error(result.message || "Current password is incorrect");
      return;
    }

    toast.success("Password changed successfully!");
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-body">
      <DashboardPageHeader
        title="Account Settings"
        description="Manage your admin profile, avatar, credentials, and security access."
      />

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-8 sm:p-10 space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-gray-100">
          <div className="relative group">
            {avatarUrl && !imageError ? (
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#2cb775]/20 shadow-md bg-gray-100">
                <img
                  src={avatarUrl}
                  alt=""
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-[#2cb775]/10 border-2 border-[#2cb775]/20 flex items-center justify-center text-[#2cb775] font-bold text-3xl font-heading shadow-md uppercase">
                {getInitials(user?.name)}
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleProfileChange}
              hidden
            />
            <button
              type="button"
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

        {/* Account Credentials */}
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
                  type="button"
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

        {/* Change Password Section */}
        <div className="pt-6 border-t border-gray-100 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#0D231E] font-inter flex items-center gap-2">
              <Icon icon="lucide:key-round" className="w-5 h-5 text-[#2cb775]" />
              Security & Password Settings
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Update your account password. You must provide your current password to confirm changes.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, currentPassword: e.target.value })
                  }
                  placeholder="Enter your current password"
                  className="w-full border border-gray-300 p-3 pr-10 rounded-xl text-xs focus:outline-none focus:border-[#2cb775] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Icon icon={showPassword ? "lucide:eye-off" : "lucide:eye"} className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  New Password *
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  min={6}
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  placeholder="At least 6 characters"
                  className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  min={6}
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirmPassword: e.target.value })
                  }
                  placeholder="Re-enter new password"
                  className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775] transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passwordSubmitting}
                className="bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-semibold px-6 py-3 rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <Icon icon="lucide:shield-check" className="w-4 h-4 text-[#2cb775]" />
                {passwordSubmitting ? "Updating Password..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
