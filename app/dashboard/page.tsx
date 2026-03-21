import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "../../lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Welcome, {session.user?.name ?? session.user?.email}</p>
      <p className="text-sm text-neutral-500">You are authenticated with NextAuth.</p>
    </main>
  );
}
