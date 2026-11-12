import { Suspense } from "react";
import { Header } from "@/components/Header";
import { AccountFlow } from "@/components/mft/AccountFlow";

export default function AccountPage() {
  return (
    <>
      <Header />
      <main className="w-full flex-1 px-4 py-10 sm:px-8">
        <Suspense>
          <AccountFlow />
        </Suspense>
      </main>
    </>
  );
}
