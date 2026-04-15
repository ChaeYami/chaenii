import { Suspense } from "react";
import {
  Hero,
  About,
  Skills,
  Projects,
  CurrentlyBuilding,
  GuestbookSection,
} from "@/components/sections";

export default function Home() {
  return (
    <main>
      <Hero />
      <Suspense>
        <Projects />
      </Suspense>
      <Suspense>
        <CurrentlyBuilding />
      </Suspense>
      <Skills />
      <About />
      <GuestbookSection />
    </main>
  );
}
