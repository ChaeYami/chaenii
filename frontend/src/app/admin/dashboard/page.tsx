"use client";

import { useState } from "react";
import GuestbookTab from "./GuestbookTab";
import ProjectsTab from "./ProjectsTab";
import StudyTab from "./StudyTab";

const TABS = ["방명록 관리", "프로젝트 관리", "Study 관리"] as const;
type Tab = (typeof TABS)[number];

export default function DashboardPage() {
  const [active, setActive] = useState<Tab>("방명록 관리");

  return (
    <div>
      <div className="flex gap-2 border-b border-border pb-4 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200
              ${active === tab
                ? "bg-purple/30 text-purple"
                : "text-text-secondary hover:text-text-primary hover:bg-surface"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === "방명록 관리" && <GuestbookTab />}
      {active === "프로젝트 관리" && <ProjectsTab />}
      {active === "Study 관리" && <StudyTab />}
    </div>
  );
}
