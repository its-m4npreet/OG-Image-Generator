import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authOptions } from "../../src/lib/auth";

type SessionUser = {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const displayName = session.user?.name ?? session.user?.email ?? "User";
  const fallbackLetter = displayName.trim().charAt(0).toUpperCase();
  const user = session.user as SessionUser;
  const isAdmin = user.role === "admin";

  console.log("📊 Dashboard - Session User:", {
    email: user.email,
    role: user.role,
    isAdmin: isAdmin
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-6 p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Avatar className="h-16 w-16">
          <AvatarImage alt={displayName} src={session.user?.image ?? ""} />
          <AvatarFallback>{fallbackLetter}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p>Welcome, {displayName}</p>
        <p className="text-sm text-neutral-500">You are authenticated with NextAuth.</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button asChild className="w-full" variant="default" size="lg">
          <Link href="/editor">Create OG Image</Link>
        </Button>

        {isAdmin && (
          <Button asChild className="w-full" variant="secondary" size="lg">
            <Link href="/admin/templates">📋 Manage Templates</Link>
          </Button>
        )}
      </div>
    </main>
  );
}
  