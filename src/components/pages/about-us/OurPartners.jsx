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

export default function OurPartners() {
  // Triple the partners list to create a seamless, gapless loop for any screen size
  const infinitePartners = [...partners, ...partners, ...partners];

  return (
    <section className="py-16 md:py-20 text-[#0D231E] border-t border-[#f2efdf] overflow-hidden">
      <div className="container">
        
        {/* Short centered subtitle for credibility */}
        <div className="text-center mb-10">
          <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#DE8D3D]">
            Credibility & Alliances
          </p>
        </div>

        {/* Logo Marquee */}
        <div className="relative w-full overflow-hidden">
          {/* Subtle fade overlay on edges */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#fcfaee] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#fcfaee] to-transparent z-10 pointer-events-none" />

          <Marquee
            speed={35}
            gradient={false}
            pauseOnHover={true}
            className="flex items-center py-2"
          >
            {infinitePartners.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="mx-6 flex items-center justify-center h-28 w-48 rounded-2xl bg-[#f2efdf] hover:bg-white border border-[#f2efdf]/50 hover:border-[#2cb775]/20 hover:shadow-[0_12px_30px_rgba(13,35,30,0.03)] hover:-translate-y-0.5 transition-all duration-500 ease-out group px-6 cursor-pointer"
              >
                <div className="relative w-full h-20 flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={200}
                    height={80}
                    className="max-h-16 w-auto object-contain filter grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 ease-in-out"
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
