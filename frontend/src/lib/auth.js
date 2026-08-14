export const getAuth = async () => {
  const res = await fetch("/api/v1/auth/profile");
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
};

export const logout = async (redirectTo = "/login") => {
  const res = await fetch("/api/v1/auth/logout", {
    method: "POST",
  });
  if (!res.ok) throw new Error("Not authenticated");

  if (typeof window !== "undefined") {
    window.location.href = redirectTo;
  }
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  try {
    const res = await fetch("/api/v1/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.error || result.message || "Failed to change password",
      };
    }

    return {
      success: true,
      message: result.message || "Password changed successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to change password",
    };
  }
};
