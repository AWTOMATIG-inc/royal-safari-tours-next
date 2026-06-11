"use client";

import DashboardImage from "@/assets/dashboard.webp";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
const DashboardLink = [
  {
    id: 1,
    name: "View Profile",
    icon: "mdi:account-cog-outline",
    href: "/dashboard/account",
  },
  {
    id: 2,
    name: "Tour Packages",
    icon: "carbon:tour",
    href: "/dashboard/tour-packages",
  },
  {
    id: 3,
    name: "Tour Locations",
    icon: "ep:place",
    href: "/dashboard/tour-locations",
  },
  {
    id: 4,
    name: "Contact Requests",
    icon: "material-symbols:contact-mail-outline-rounded",
    href: "/dashboard/contact-requests",
  },
  {
    id: 5,
    name: "Users",
    icon: "flowbite:users-outline",
    href: "/dashboard/users",
  },
  {
    id: 6,
    name: "Subscribers",
    icon: "fluent-mdl2:subscribe",
    href: "/dashboard/subscribers",
  },
  {
    id: 7,
    name: "Testimonials",
    icon: "material-symbols:format-quote-outline-rounded",
    href: "/dashboard/testimonials",
  },
  {
    id: 8,
    name: "Gallery",
    icon: "mdi:image-multiple-outline",
    href: "/dashboard/gallery",
  },
];
export default function Dashboard() {
  return (
    <div className="bg-green/20 max-w-262.5  min-h-[60vh] p-4 lg:p-8 rounded-lg shadow-md mt-8">
      <h1 className="text-2xl text-green font-bold">
        Welcome to the Dashboard
      </h1>
      <p className="text-gray-500 mt-1 font-inter">
        Use the sidebar or the links below to navigate through different sections of the dashboard.
      </p>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:mt-8 items-center">
        <div className="grid grid-cols-2 gap-2 mt-6 xl:mt-0">
          {DashboardLink.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="flex flex-col justify-center items-center gap-2 h-24 text-green font-medium bg-green/20  px-4 py-2 rounded-md hover:bg-green/30 w-full"
            >
              <Icon
                icon={link.icon}
                width="35"
                height="35"
                className="size-7 sm:size-8.75"
              />
              <span className="sm:text-xl">{link.name}</span>
            </Link>
          ))}
        </div>
        <div className="">
          <Image
            src={DashboardImage}
            alt="Dashboard"
            loading="eager"
            width={500}
            height={300}
            className=" object-cover  "
          />
        </div>
      </div>
    </div>
  );
}
