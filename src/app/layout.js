import Footer from "@/components/Footer";
import GTMPageViewTracker from "@/components/GTMPageViewTracker";
import Header from "@/components/Header";
import ScrollButton from "@/components/ScrollButton";
import ToastProvider from "@/components/ToastProvider";
import { TourContextProvider } from "@/context/TourContextProvider";
import { GoogleTagManager } from "@next/third-parties/google";
import { Geist, Geist_Mono } from "next/font/google";
import "swiper/css";
import "./fonts.css";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Royal Safari Tours",
  description:
    "Royal Safari Tours is a Khilgaon-based travel agency dedicated to delivering premium yet affordable tour experiences across South Asia and beyond. From the vibrant streets of Kathmandu to the serene coasts of the Maldives, our journeys are designed to inspire, excite, and rejuvenate.Founded by passionate travelers, we bring deep regional knowledge and heartfelt hospitality to every itinerary.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      <body className="min-h-full flex flex-col">
        <GTMPageViewTracker />
        <Header />
        <TourContextProvider>{children}</TourContextProvider>
        <Footer />
        <ScrollButton />
        <ToastProvider />
      </body>
    </html>
  );
}
