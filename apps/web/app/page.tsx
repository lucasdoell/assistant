import { Button } from "@ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <Button asChild>
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    </main>
  );
}
