
import ShapeButton from "@/components/ShapeButton";
import { ForestWorldIcon } from "@/components/svg-icons";
import Link from "next/link";

export default function Memories() {
  return (
    <div className="bg-sand pb-10 font-body">
      <div
        style={{
          clipPath:
            "polygon(52% 0, 77% 2%, 100% 1%, 100% 98%, 59% 99%, 36% 97%, 0 99%, 0 0, 24% 2%)",
        }}
        className="bg-[linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url('/images/banners/memories.webp')] bg-center min-h-[650px] sm:min-h-[750px] grid items-center"
      >
        <div className="flex flex-col lg:flex-row lg:justify-between items-end lg:items-center container-wide">
          <div className="flex-1">
            <h1 className="text-white text-display-xl mb-10 text-center lg:text-left">
              Travel with the people you love, make memories that last.
            </h1>
            <div className="hidden lg:block">
              <Link href="/adventure">
                <ShapeButton
                  name="EXPLORE TOURS"
                  className="group-hover:text-accent"
                />
              </Link>
            </div>
          </div>

          <div className="flex-1 flex justify-center lg:justify-end">
            <ForestWorldIcon className="size-[110px] md:size-[170px]" />
          </div>
        </div>
        <div className="w-fit mx-auto lg:hidden">
          <Link href="/adventure">
            <ShapeButton
              name="EXPLORE TOURS"
              className="group-hover:text-accent"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

