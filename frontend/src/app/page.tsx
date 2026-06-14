import { Suspense } from "react";
import {
  Hero,
  About,
  Skills,
  Projects,
  ChaeonStudio,
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
      <ChaeonStudio />
      <Suspense>
        <CurrentlyBuilding />
      </Suspense>
      <Skills />
      <About />
      <Suspense>
        <StudySection />
      </Suspense>
      <GuestbookSection />
    </main>
  );
}
