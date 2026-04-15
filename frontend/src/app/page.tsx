import { Suspense } from "react";
import {
  Hero,
  About,
  Skills,
  Projects,
  CurrentlyBuilding,
  GuestbookSection,
  StudySection,
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
      <Suspense>
        <StudySection />
      </Suspense>
      <About />
      <GuestbookSection />
    </main>
  );
}
