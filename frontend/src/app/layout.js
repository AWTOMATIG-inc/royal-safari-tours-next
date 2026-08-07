import Footer from "@/components/Footer";
import GTMPageViewTracker from "@/components/GTMPageViewTracker";
import MetaPixelPageViewTracker from "@/components/MetaPixelPageViewTracker";
import Header from "@/components/Header";
import ScrollButton from "@/components/ScrollButton";
import ToastProvider from "@/components/ToastProvider";
import { TourContextProvider } from "@/context/TourContextProvider";
import { MotionProvider, PageTransition } from "@/components/animations";
import { GoogleTagManager } from "@next/third-parties/google";
import { Playfair_Display, Be_Vietnam_Pro, Mansalva } from "next/font/google";
import Script from "next/script";
import "swiper/css";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading-var",
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-body-var",
  display: "swap",
});

const mansalva = Mansalva({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-accent-var",
  display: "swap",
});

export const metadata = {
  title: "Royal Safari Tours | Luxury Travel & Bespoke Expeditions",
  description:
    "Royal Safari Tours is a Khilgaon-based travel agency dedicated to delivering premium yet affordable tour experiences across South Asia and beyond. From the vibrant streets of Kathmandu to the serene coasts of the Maldives, our journeys are designed to inspire, excite, and rejuvenate. Founded by passionate travelers, we bring deep regional knowledge and heartfelt hospitality to every itinerary.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${beVietnam.variable} ${mansalva.variable} h-full antialiased scroll-smooth`}
    >
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      <body className="min-h-full flex flex-col font-body bg-sand text-primary">
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '245223165348911');
fbq('track', 'PageView');`}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=245223165348911&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <GTMPageViewTracker />
        <MetaPixelPageViewTracker />
        <MotionProvider>
          <Header />
          <TourContextProvider>
            <PageTransition>{children}</PageTransition>
          </TourContextProvider>
          <Footer />
          <ScrollButton />
          <ToastProvider />
        </MotionProvider>
      </body>
    </html>
  );
}

