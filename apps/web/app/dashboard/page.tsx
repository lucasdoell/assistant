import { StreamTest } from "@/components/ai/stream-test";
import { SignOutButton } from "@/components/auth/auth-components";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      Welcome back: <pre>{JSON.stringify(user, null, 2)}</pre>
      <StreamTest />
      <div className="w-20">
        <SignOutButton />
      </div>
    </div>
  );
}
