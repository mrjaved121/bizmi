import type { Metadata } from "next";
import { getCurrentProfile } from "@/lib/data/account";
import { SettingsForm } from "@/components/features/auth/SettingsForm";

export const metadata: Metadata = {
  title: "Settings | Bizmi",
  robots: { index: false },
};

export default async function AccountSettingsPage() {
  const profile = await getCurrentProfile();

  return (
    <SettingsForm
      email={profile?.email ?? null}
      defaultValues={{
        fullName: profile?.full_name ?? "",
        phone: profile?.phone ?? "",
        city: profile?.city ?? "",
        province: profile?.province ?? "",
        address: profile?.address ?? "",
      }}
    />
  );
}
