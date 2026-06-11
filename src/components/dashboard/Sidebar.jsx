"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LeftArrowIcon, RightArrowIcon } from "../SvgIcons";

const Sidebar = () => {
  const [isSidebar, setIsSidebar] = useState(false);
  const path = usePathname();
  return (
    <div
      className={`bg-green sidebar text-white h-screen w-72 sm:w-96 p-6 flex flex-col gap-8 fixed lg:sticky top-0 z-100 lg:rounded-[20px]  ${
        isSidebar ? "left-[0px]" : "-left-[290px] sm:-left-[385px]"
      }`}
    >
      <div className="relative w-full h-full">
        <button
          onClick={() => setIsSidebar((prev) => !prev)}
          className="absolute sidebar-button top-32 sm:top-20 -right-[60px]  bg-green h-10 w-10 grid place-items-center rounded-r-full lg:hidden cursor-pointer z-99"
        >
          {isSidebar ? <RightArrowIcon /> : <LeftArrowIcon />}
        </button>
        <h1 className="text-3xl font-bold px-4">Admin</h1>
        <nav className="flex flex-col gap-y-8 text-lg mt-8 sidebar">
          <Link
            onClick={() => setIsSidebar(false)}
            href="/dashboard"
            className={`flex items-center gap-2 py-2 px-4 rounded-md hover:bg-black/10 ${
              path === "/dashboard" ? "bg-black/10" : ""
            }`}
          >
            <Icon
              icon="material-symbols:dashboard-outline"
              width="24"
              height="24"
            />
            <span>Dashboard</span>
          </Link>
          <Link
            onClick={() => setIsSidebar(false)}
            href="/dashboard/tour-packages"
            className={`flex items-center gap-2 py-2 px-4 rounded-md hover:bg-black/10 ${
              path === "/dashboard/tour-packages" ? "bg-black/10" : ""
            }`}
          >
            <Icon icon="carbon:tour" width="24" height="24" />
            <span>Tour Packages</span>
          </Link>
          <Link
            onClick={() => setIsSidebar(false)}
            href="/dashboard/tour-locations"
            className={`flex items-center gap-2 py-2 px-4 rounded-md hover:bg-black/10 ${
              path === "/dashboard/tour-locations" ? "bg-black/10" : ""
            }`}
          >
            <Icon icon="ep:place" width="24" height="24" />
            <span>Tour Locations</span>
          </Link>

          <Link
            onClick={() => setIsSidebar(false)}
            href="/dashboard/contact-requests"
            className={`flex items-center gap-2 py-2 px-4 rounded-md hover:bg-black/10 ${
              path === "/dashboard/contact-requests" ? "bg-black/10" : ""
            }`}
          >
            <Icon
              icon="material-symbols:contact-mail-outline-rounded"
              width="22"
              height="24"
            />
            <span>Contact Requests</span>
          </Link>
          <Link
            onClick={() => setIsSidebar(false)}
            href="/dashboard/users"
            className={`flex items-center gap-2 py-2 px-4 rounded-md hover:bg-black/10 ${
              path === "/dashboard/users" ? "bg-black/10" : ""
            }`}
          >
            <Icon icon="flowbite:users-outline" width="24" height="24" />
            <span>Users</span>
          </Link>
          <Link
            onClick={() => setIsSidebar(false)}
            href="/dashboard/subscribers"
            className={`flex items-center gap-2 py-2 px-4 rounded-md hover:bg-black/10 ${
              path === "/dashboard/subscribers" ? "bg-black/10" : ""
            }`}
          >
            <Icon icon="fluent-mdl2:subscribe" width="20" height="24" />
            <span>Subscribers</span>
          </Link>
          <Link
            onClick={() => setIsSidebar(false)}
            href="/dashboard/testimonials"
            className={`flex items-center gap-2 py-2 px-4 rounded-md hover:bg-black/10 ${
              path === "/dashboard/testimonials" ? "bg-black/10" : ""
            }`}
          >
            <Icon icon="material-symbols:format-quote-outline-rounded" width="24" height="24" />
            <span>Testimonials</span>
          </Link>
        </nav>

        <Link
          onClick={() => setIsSidebar(false)}
          href="/"
          className="flex items-center gap-2 py-2 px-4 rounded-md hover:bg-black/10 text-lg absolute bottom-0 left-0 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>

          <span>Back home</span>
        </Link>
      </div>
    </div>
  );
};
export default Sidebar;
