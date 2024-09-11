import { Button } from "@ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <Button variant="link" asChild>
        <Link href="/chat">Chat</Link>
      </Button>
    </main>
  );
}
