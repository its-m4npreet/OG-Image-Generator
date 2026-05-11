import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authOptions } from "../../src/lib/auth";
import DashboardContent from "../../src/components/DashboardContent";

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
      <DashboardContent 
        displayName={displayName}
        fallbackLetter={fallbackLetter}
        userImage={session.user?.image}
        email={user.email}
        isAdmin={isAdmin}
      />
    </main>
  );
}

        {isAdmin && (
          <Button asChild className="w-full" variant="secondary" size="lg">
            <Link href="/admin/templates">📋 Manage Templates</Link>
          </Button>
        )}
      </div>
    </main>
  );
}
  