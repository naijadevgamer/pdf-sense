"use client";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import { Sidebar } from "lucide-react";
import { usePathname } from "next/navigation";

const SidebarToggle = () => {
  const { isOpen, setIsOpen } = useSidebar();

  console.log("isOpen", isOpen);

  const pathname = usePathname();
  const isPdfPage = /^\/dashboard\/[^/]+$/.test(pathname); // Checks if path is `/dashboard/some-id`/
  return (
    <button
      className="absolute left-1/4 md:left-4 w-auto top-1/2 transform -translate-y-1/2"
      onClick={() => setIsOpen(!isOpen)}
    >
      {isPdfPage ? <Sidebar className="cursor-pointer text-primary" /> : ""}
    </button>
  );
};

export default SidebarToggle;

export const LeftSidebar = () => {
  const { isOpen } = useSidebar();

  return (
    <div
      className={cn(
        "duration-200 overflow-hidden fixed z-10 lg:static min-h-[calc(100vh-3.5rem)] bg-white",
        isOpen ? "w-60 lg:w-[17%]" : "w-0"
      )}
    >
      <div className="w-60 ">
        t, dolores quas iste natus eligendi at vitae fugit porro
        itaque.
      </div>
    </div>
  );
};
