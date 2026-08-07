export function trackMetaPixelPageView() {
  if (typeof window === "undefined") return;

  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
}