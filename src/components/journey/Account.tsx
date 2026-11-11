"use client";

import { useAccount } from "@/lib/accountStore";

/** "Sign in" for a guest; the buyer's name once they have made an account. */
export function Account() {
  const account = useAccount();
  return account ? <span className="font-semibold">Hi, {account.name}</span> : <span>Sign in</span>;
}
