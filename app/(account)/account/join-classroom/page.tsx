import type { Metadata } from "next";
import { JoinClassroomForm } from "@/components/features/auth/JoinClassroomForm";

export const metadata: Metadata = {
  title: "Join a classroom | Bizmi",
  robots: { index: false },
};

export default function JoinClassroomPage() {
  return (
    <div>
      <h2 className="font-serif text-2xl text-ink">Join a classroom</h2>
      <p className="mt-1 text-sm text-ink-2">
        Enter the join code your teacher shared to connect your account.
      </p>
      <div className="mt-6">
        <JoinClassroomForm />
      </div>
    </div>
  );
}
