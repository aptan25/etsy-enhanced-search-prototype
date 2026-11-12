"use client";

import Link from "next/link";
import { useAccount } from "@/lib/accountStore";

/** "Sign in" for a guest; the buyer's name once they have an account. Both open /account. */
export function Account() {
  const account = useAccount();
  return (
    <Link href="/account?mode=signin" className="hover:underline">
      {account ? <span className="font-semibold">Hi, {account.name}</span> : "Sign in"}
    </Link>
  );
}
