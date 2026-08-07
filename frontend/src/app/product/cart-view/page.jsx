import HeroSection from "@/components/HeroSection";
import CartTable from "@/components/pages/product-cart-view/CartTable";
import Link from "next/link";
export default function page() {
  return (
    <div>
      <HeroSection banner="/images/banners/contact.webp">
        <div>
          <h5 className="text-white text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold font-palanquin">
            Cart
          </h5>
          <div className="text-white space-x-4 mt-4 w-fit mx-auto">
            <Link href="/" className="hover:text-orange">
              All
            </Link>
            <Link href="/about-us" className="hover:text-orange">
              Bamboo Rafting
            </Link>
          </div>
        </div>
      </HeroSection>
      <CartTable />
    </div>
  );
}
