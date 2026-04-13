import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authOptions } from "../../src/lib/auth";
import { pool } from "@/lib/postgres";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const displayName = session.user?.name ?? session.user?.email ?? "User";
  const fallbackLetter = displayName.trim().charAt(0).toUpperCase();

  // Fetch user role from database
  let isAdmin = false;
  const userEmail = session.user?.email;
  
  if (userEmail) {
    try {
      const result = await pool.query(
        "SELECT role FROM users WHERE email = $1",
        [userEmail]
      );
      
      if (result.rows.length > 0 && result.rows[0].role === "admin") {
        isAdmin = true;
      }
    } catch (error) {
      console.error("Failed to fetch user role:", error);
    }
  }

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
        <Button asChild className="w-full" variant="default">
          <Link href="/editor">Create OG Image</Link>
        </Button>

        {isAdmin && (
          <Button asChild className="w-full" variant="secondary">
            <Link href="/admin/templates">📋 Manage Templates</Link>
          </Button>
        )}
      </div>
    </main>
  );
}
