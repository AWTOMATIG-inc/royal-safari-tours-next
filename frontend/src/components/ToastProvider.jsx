"use client";

import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      gutter={12}
      containerStyle={{ margin: "16px" }}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fff",
          color: "#0D231E",
          boxShadow: "0 10px 40px rgba(13, 35, 30, 0.12)",
          borderRadius: "16px",
          padding: "16px 20px",
          fontSize: "14px",
          fontFamily: "var(--font-inter)",
          maxWidth: "400px",
          border: "1px solid rgba(0, 0, 0, 0.05)",
        },
        success: {
          iconTheme: {
            primary: "#2cb775",
            secondary: "#fff",
          },
          style: {
            border: "1px solid rgba(44, 183, 117, 0.2)",
          },
        },
        error: {
          iconTheme: {
            primary: "#e11d48",
            secondary: "#fff",
          },
          style: {
            border: "1px solid rgba(225, 29, 72, 0.2)",
          },
        },
        loading: {
          iconTheme: {
            primary: "#0D231E",
            secondary: "#fff",
          },
        },
      }}
    />
  );
};

export default ToastProvider;
