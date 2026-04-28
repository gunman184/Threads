"use client";

import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignOutButton } from "@clerk/nextjs";

export default function TopbarClient({ mongoUser }: { mongoUser: any }) {
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
        <p className="text-heading3-bold text-light-1 max-xs-hidden">Threads</p>
      </Link>

      <div className="flex items-center gap-3">
        <SignedIn>
          {mongoUser?.image && (
            <Image
              src={mongoUser.image}
              alt="profile"
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <SignOutButton>
            <div className="flex cursor-pointer">
              <Image
                src="/assets/logout.svg"
                alt="logout"
                width={24}
                height={24}
              ></Image>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </nav>
  );
}
