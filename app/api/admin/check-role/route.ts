import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/postgres";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json({ isAdmin: false, error: "Not authenticated" }, { status: 401 });
    }

    console.log("🔍 Checking admin role for:", session.user.email);

    const result = await pool.query(
      "SELECT role FROM users WHERE email = $1",
      [session.user.email]
    );

    if (result.rows.length === 0) {
      console.log("❌ User not found:", session.user.email);
      return Response.json({ isAdmin: false, error: "User not found" });
    }

    const userRole = result.rows[0].role;
    const isAdmin = userRole === "admin";

    console.log("✅ User role check:", {
      email: session.user.email,
      role: userRole,
      isAdmin: isAdmin,
    });

    return Response.json({ isAdmin, role: userRole });
  } catch (error) {
    console.error("❌ Error checking admin role:", error);
    return Response.json({ isAdmin: false, error: "Failed to check role" }, { status: 500 });
  }
}
