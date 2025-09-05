// components/UserAccountNav.tsx
"use client";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Gem, User, CreditCard } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useEffect, useState } from "react";

interface UserAccountNavProps {
  email: string;
  name: string;
  imageUrl?: string;
}

const UserAccountNav = ({ email, name, imageUrl }: UserAccountNavProps) => {
  const [subscriptionPlan, setSubscriptionPlan] = useState<any>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch("/api/subscription");
        if (response.ok) {
          const data = await response.json();
          setSubscriptionPlan(data);
        }
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
      }
    };
    fetchSubscription();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button className="rounded-full h-8 w-8 aspect-square bg-slate-400">
          <Avatar className="relative w-8 h-8">
            <AvatarFallback>
              <span className="sr-only">{name}</span>
              <User className="h-4 w-4 text-zinc-900" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="bg-white/95 backdrop-blur-sm border border-gray-200/30"
        align="end"
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            {name && <p className="font-medium text-sm text-black">{name}</p>}
            {email && (
              <p className="w-[200px] truncate text-xs text-zinc-700">
                {email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          {subscriptionPlan?.isSubscribed ? (
            <Link href="/dashboard/billing">Manage Subscription</Link>
          ) : (
            <Link href="/pricing">
              Upgrade <Gem className="text-primary h-4 w-4 ml-1.5" />
            </Link>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <LogoutLink>Log out</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
