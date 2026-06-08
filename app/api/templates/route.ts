import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET all active templates
export async function GET(request: Request) {
  try {
    const result = await pool.query(
      `SELECT id, name, description, thumbnail_url, metadata, created_at 
       FROM templates 
       WHERE is_active = true 
       ORDER BY created_at DESC`
    );
    
    return Response.json(result.rows);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return Response.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}

// POST create new template (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userResult = await pool.query(
      "SELECT role FROM users WHERE email = $1",
      [session.user.email]
    );

    if (!userResult.rows[0] || userResult.rows[0].role !== "admin") {
      return Response.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { name, description, thumbnail_url, html_template, react_component, metadata } = await request.json();

    if (!name || (!html_template && !react_component)) {
      return Response.json(
        { error: "Name and at least one template format required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO templates (name, description, thumbnail_url, html_template, react_component, metadata, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        name,
        description || null,
        thumbnail_url || null,
        html_template || null,
        react_component || null,
        metadata || {},
        userResult.rows[0].id,
      ]
    );

    return Response.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating template:", error);
    return Response.json({ error: "Failed to create template" }, { status: 500 });
  }
}
