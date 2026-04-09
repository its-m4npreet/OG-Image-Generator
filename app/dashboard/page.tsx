import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authOptions } from "../../src/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const displayName = session.user?.name ?? session.user?.email ?? "User";
  const fallbackLetter = displayName.trim().charAt(0).toUpperCase();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-3 p-6 text-center">
      <Avatar className="h-16 w-16">
        <AvatarImage alt={displayName} src={session.user?.image ?? ""} />
        <AvatarFallback>{fallbackLetter}</AvatarFallback>
      </Avatar>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Welcome, {displayName}</p>
      <p className="text-sm text-neutral-500">You are authenticated with NextAuth.</p>
    </main>
  );
}
