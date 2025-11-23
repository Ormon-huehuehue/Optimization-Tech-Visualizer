"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Dna, 
  Settings, 
  BookOpen,
  BarChart3
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Genetic Algorithm", href: "/genetic-algorithm", icon: Dna },
  { name: "Documentation", href: "/docs", icon: BookOpen },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-20 flex-col items-center bg-sidebar py-8 text-sidebar-foreground transition-all duration-300 hover:w-64 group z-50 fixed left-0 top-0">
      <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
        <Dna className="h-6 w-6" />
      </div>
      
      <nav className="flex-1 space-y-4 px-2 w-full">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors w-full overflow-hidden whitespace-nowrap",
                isActive
                  ? "bg-white text-black"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-6 w-6 min-w-[24px]" />
              <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        {/* Bottom actions if needed */}
      </div>
    </div>
  );
}
