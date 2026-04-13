import { Suspense } from "react";
import { Hero, About, Skills, Projects, CurrentlyBuilding } from "@/components/sections";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Suspense>
        <Projects />
      </Suspense>
      <Suspense>
        <CurrentlyBuilding />
      </Suspense>
    </main>
  );
}
