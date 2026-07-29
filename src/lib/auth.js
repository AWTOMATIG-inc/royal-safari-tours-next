export const getAuth = async () => {
  const res = await fetch("/api/auth/profile");
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
};

export const logout = async (redirectTo = "/login") => {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
  });
  if (!res.ok) throw new Error("Not authenticated");

  if (typeof window !== "undefined") {
    window.location.href = redirectTo;
  }
};
