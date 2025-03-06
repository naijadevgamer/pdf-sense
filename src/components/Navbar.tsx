import {
  getKindeServerSession,
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";

import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Button, buttonVariants } from "./ui/button";
import UserAccountNav from "./UserAccountNav";
import SidebarToggle from "./SidebarToggle";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser(); // Properly await the user data

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <SidebarToggle />
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <h1 className="uppercase tracking-wide bg-gradient-to-r from-blue-600 to-primary text-transparent bg-clip-text">
              PDFSense
            </h1>
          </Link>

          <div className="hidden items-center space-x-4 sm:flex">
            {!user ? (
              <>
                <div className="hidden items-center space-x-4 sm:flex">
                  <Button asChild size={"sm"} variant={"ghost"}>
                    <Link href="/pricing">Pricing</Link>
                  </Button>
                  <Button asChild size={"sm"} variant={"ghost"}>
                    <LoginLink>Sign in</LoginLink>
                  </Button>
                  <Button asChild>
                    <RegisterLink>
                      Get started <ArrowRight className="ml-1.5 size-5" />
                    </RegisterLink>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Dashboard
                </Link>

                <UserAccountNav
                  name={
                    !user.given_name || !user.family_name
                      ? "Your Account"
                      : `${user.given_name} ${user.family_name}`
                  }
                  email={user.email ?? ""}
                  imageUrl={user.picture ?? ""}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
