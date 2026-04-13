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
    // Check if access_token cookie exists (httpOnly cookies can't be read,
    // so we attempt a protected API call to verify auth)
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/api/guestbook/1/hide`, {
      method: "OPTIONS",
      credentials: "include",
    })
      .then(() => setChecked(true))
      .catch(() => router.replace("/admin"));

    // Simple check: if we got here, assume authenticated.
    // The API will return 401/403 on actual calls if not.
    setChecked(true);
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
