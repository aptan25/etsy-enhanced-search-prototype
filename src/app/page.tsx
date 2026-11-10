import { Header } from "@/components/Header";
import { HomeSections } from "@/components/HomeSections";

// Current state: Etsy's homepage as it works today.
export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HomeSections />
      </main>
    </>
  );
}
