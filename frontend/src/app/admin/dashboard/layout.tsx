"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";
import { Button } from "@/components/ui";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
    fetch(`${API}/api/guestbook`, { credentials: "include" })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          router.replace("/admin");
        } else {
          setChecked(true);
        }
      })
      .catch(() => setChecked(true));
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.replace("/admin");
    }
  };

  if (!checked) return null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>
        <Button variant="ghost" onClick={handleLogout}>
          로그아웃
        </Button>
      </div>
      {children}
    </div>
  );
}
