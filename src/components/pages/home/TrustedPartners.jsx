"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";

const partners = [
  { name: "Grand Sultan Sylhet", logo: "/images/sponsors/Grand-Sultan-Sylhet.png" },
  { name: "Fly Far International", logo: "/images/sponsors/Fly-far-international.png" },
  { name: "Himalayan Club Tours", logo: "/images/sponsors/Himalayan-Club-tours.png" },
  { name: "Kaani Group Maldives", logo: "/images/sponsors/Kaani-Group.png" },
  { name: "Ramada by Wyndham", logo: "/images/sponsors/Ramada-Wyndham.png" },
  { name: "Travel Champ", logo: "/images/sponsors/Travel-Champ.png" },
];

export default function TrustedPartners() {
  const infinitePartners = [...partners, ...partners, ...partners];

  return (
    <section className="py-16 sm:py-20 text-primary border-t border-gray-100 overflow-hidden bg-white">
      <div className="container">
        
        <div className="text-center mb-10 font-subheading">
          <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-accent">
            Credibility &amp; Global Alliances
          </p>
        </div>

        {/* Marquee Wrapper */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <Marquee
            speed={35}
            gradient={false}
            pauseOnHover={true}
            className="flex items-center py-2"
          >
            {infinitePartners.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="mx-6 flex items-center justify-center h-24 sm:h-28 w-44 sm:w-48 rounded-2xl bg-lightGray hover:bg-white border border-primary/10 hover:border-secondary/30 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500 ease-out group px-6 cursor-pointer"
              >
                <div className="relative w-full h-16 flex items-center justify-center">
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={200}
                    height={80}
                    className="max-h-14 w-auto object-contain filter grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 ease-in-out"
                  />
                </div>
              </div>
            ))}
          </Marquee>
        </div>

      </div>
    </section>
  );
}
