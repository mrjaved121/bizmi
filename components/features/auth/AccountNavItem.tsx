"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function AccountNavItem() {
  const [email, setEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={email ? "My account" : "Sign in"}
      nativeButton={false}
      render={<Link href={email ? "/account" : "/auth/sign-in"} />}
    >
      <User className="h-5 w-5" />
    </Button>
  );
}
