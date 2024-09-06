import { logout } from "@/lib/auth";
import { Button } from "@ui/button";
import { redirect } from "next/navigation";

export function SignOutButton(
  props: React.ComponentPropsWithRef<typeof Button>,
) {
  return (
    <form
      action={async () => {
        "use server";
        await logout();
        redirect("/");
      }}
      className="w-full"
    >
      <Button className="w-full p-0" {...props}>
        Sign Out
      </Button>
    </form>
  );
}
