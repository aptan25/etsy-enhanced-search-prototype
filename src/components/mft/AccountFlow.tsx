"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { persona } from "@/components/journey/steps";
import { accountFromEmail, safeNext, signIn, signOut, useAccount } from "@/lib/accountStore";
import { usePeople } from "@/lib/peopleStore";
import { useTourStep } from "@/lib/tourStore";
import { New } from "./New";
import { personHref } from "./PeopleStrip";

type Mode = "register" | "signin";

/**
 * Etsy's sign-in / register page, plus one change: people saved as a guest
 * move into the account. `?mode=register|signin`, `?next=` a path to continue
 * to. Prototype only: the password is neither checked nor stored.
 */
export function AccountFlow() {
  const params = useSearchParams();
  const router = useRouter();
  const account = useAccount();
  const people = usePeople();
  const inTour = useTourStep() !== null;
  const mode: Mode = params.get("mode") === "signin" ? "signin" : "register";
  const next = safeNext(params.get("next"));
  const [email, setEmail] = useState(inTour ? persona.email : "");
  const [firstName, setFirstName] = useState(inTour ? persona.name : "");
  const [password, setPassword] = useState(inTour ? "demo-password" : "");
  const [error, setError] = useState("");

  // Typing again clears the last error.
  const edit = (set: (v: string) => void) => (v: string) => {
    set(v);
    setError("");
  };

  const switchTo = (m: Mode) => {
    const q = new URLSearchParams(params);
    q.set("mode", m);
    router.replace(`/account?${q}`);
  };

  const submit = () => {
    if (!password) {
      setError("Enter a password");
      return;
    }
    try {
      signIn(accountFromEmail(email, mode === "register" ? firstName : ""));
      setPassword("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't sign in");
    }
  };

  if (account) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-neutral-200 p-6">
        <h1 className="text-2xl font-semibold">Hi, {account.name}</h1>
        <p className="mt-1 text-sm text-neutral-600">Signed in as {account.email}.</p>
        {people && people.length > 0 && (
          <div className="mt-6">
            <New change="guest-account" label="New: your people came with you">
              <div className="rounded-xl bg-cream p-4">
                <p className="font-semibold">Saved to your account</p>
                <p className="text-sm text-neutral-700">The people you saved as a guest are now on every device, with reminders before their occasions.</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {people.map((p) => (
                    <li key={p.id}>
                      <Link href={personHref(p.id)} className="block rounded-full bg-white px-3 py-1 text-sm font-semibold hover:underline">
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </New>
          </div>
        )}
        <div className="mt-6 flex items-center gap-4">
          <Link href={next ?? "/made-for-them"} className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white hover:bg-neutral-700">
            Continue
          </Link>
          {!inTour && (
            <button type="button" onClick={signOut} className="text-sm underline">
              Sign out
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-neutral-200 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{mode === "register" ? "Create your account" : "Sign in"}</h1>
        <button type="button" onClick={() => switchTo(mode === "register" ? "signin" : "register")} className="text-sm underline">
          {mode === "register" ? "Sign in instead" : "Register"}
        </button>
      </div>
      <p className="mt-1 text-sm text-neutral-600">
        {mode === "register" ? "Registration is easy." : "Welcome back."} Prototype: the password isn&apos;t checked or saved.
      </p>
      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <Field label="Email address" type="email" value={email} onChange={edit(setEmail)} autoComplete="email" />
        {mode === "register" && <Field label="First name" value={firstName} onChange={edit(setFirstName)} autoComplete="given-name" />}
        <Field label="Password" type="password" value={password} onChange={edit(setPassword)} autoComplete={mode === "register" ? "new-password" : "current-password"} />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" data-tour-target="account" className="w-full rounded-full bg-neutral-900 py-3 font-semibold text-white hover:bg-neutral-700">
          {mode === "register" ? "Register" : "Sign in"}
        </button>
      </form>
      {people && people.length > 0 && (
        <p className="mt-4 rounded-lg bg-cream p-3 text-sm">
          You saved {people.map((p) => p.name).join(", ")} as a guest. {mode === "register" ? "Registering" : "Signing in"} keeps them and turns on reminders.
        </p>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", autoComplete }: { label: string; value: string; onChange: (v: string) => void; type?: string; autoComplete?: string }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-lg border border-neutral-400 px-3 py-2 font-normal"
      />
    </label>
  );
}
