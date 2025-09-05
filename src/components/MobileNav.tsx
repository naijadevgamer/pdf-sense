"use client";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CreditCard,
  Gem,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface MobileNavProps {
  isAuth: boolean;
  user?: {
    given_name?: string | null;
    family_name?: string | null;
    email?: string | null;
    picture?: string | null;
  };
}

export interface SubscriptionPlan {
  isSubscribed: boolean;
  isCanceled: boolean;
  stripeCurrentPeriodEnd: Date | null;
}

const MobileNav = ({ isAuth, user }: MobileNavProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [subscriptionPlan, setSubscriptionPlan] =
    useState<SubscriptionPlan | null>(null);
  const toggleOpen = () => setOpen((prev) => !prev);

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isAuth) {
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
    }
  }, [isAuth]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen();
    }
  };

  return (
    <div className="sm:hidden">
      <Menu
        onClick={toggleOpen}
        className="relative z-50 h-6 w-6 text-zinc-700"
      />

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur"
              onClick={toggleOpen}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 w-4/5 max-w-sm"
            >
              <div className="glass h-full overflow-y-auto border-l border-white/20 ">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <Link
                    href="/"
                    className="font-semibold text-xl bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"
                    onClick={toggleOpen}
                  >
                    PDFSense.
                  </Link>
                  <button onClick={toggleOpen}>
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>

                <div className="p-4">
                  {!isAuth ? (
                    <>
                      <ul className="space-y-4">
                        <li>
                          <Link
                            onClick={() => closeOnCurrent("/pricing")}
                            className="flex items-center w-full font-medium text-white/90 hover:text-white transition-colors py-2"
                            href="/pricing"
                          >
                            Pricing
                          </Link>
                        </li>
                        <li className="border-t border-white/10 pt-4 mt-4">
                          <Link
                            onClick={() => closeOnCurrent("/sign-in")}
                            className="flex items-center w-full font-medium text-white/90 hover:text-white transition-colors py-2"
                            href="/sign-in"
                          >
                            Sign in
                          </Link>
                        </li>
                        <li>
                          <Link
                            onClick={() => closeOnCurrent("/sign-up")}
                            className="flex items-center justify-between w-full font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg"
                            href="/sign-up"
                          >
                            Get started
                            <ArrowRight className="h-5 w-5" />
                          </Link>
                        </li>
                      </ul>
                    </>
                  ) : (
                    <>
                      {/* User Info Section */}
                      <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {user?.given_name && user?.family_name
                                ? `${user.given_name} ${user.family_name}`
                                : "Your Account"}
                            </p>
                            <p className="text-xs text-white/70 truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>

                        {subscriptionPlan && (
                          <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                            <span className="text-white/70">Plan</span>
                            <span className="flex items-center font-medium text-white">
                              {subscriptionPlan.isSubscribed ? (
                                <>
                                  <Gem className="h-3 w-3 text-purple-400 mr-1" />
                                  Pro
                                </>
                              ) : (
                                "Free"
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      <ul className="space-y-2">
                        <li>
                          <Link
                            onClick={() => closeOnCurrent("/dashboard")}
                            className="flex items-center w-full font-medium text-white/90 hover:text-white transition-colors py-3 px-2 rounded-lg hover:bg-white/5"
                            href="/dashboard"
                          >
                            Dashboard
                          </Link>
                        </li>

                        {subscriptionPlan?.isSubscribed ? (
                          <li>
                            <Link
                              onClick={() =>
                                closeOnCurrent("/dashboard/billing")
                              }
                              className="flex items-center w-full font-medium text-white/90 hover:text-white transition-colors py-3 px-2 rounded-lg hover:bg-white/5"
                              href="/dashboard/billing"
                            >
                              <CreditCard className="h-4 w-4 mr-3" />
                              Billing
                            </Link>
                          </li>
                        ) : (
                          <li>
                            <Link
                              onClick={() => closeOnCurrent("/pricing")}
                              className="flex items-center w-full font-medium text-white/90 hover:text-white transition-colors py-3 px-2 rounded-lg hover:bg-white/5"
                              href="/pricing"
                            >
                              <Gem className="h-4 w-4 mr-3 text-purple-400" />
                              Upgrade
                            </Link>
                          </li>
                        )}

                        <li className="border-t border-white/10 pt-3 mt-3">
                          <LogoutLink className="flex items-center w-full font-medium text-white/90 hover:text-white transition-colors py-3 px-2 rounded-lg hover:bg-white/5">
                            <LogOut className="h-4 w-4 mr-3" />
                            Log out
                          </LogoutLink>
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNav;
