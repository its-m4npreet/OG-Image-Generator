import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET specific template
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await pool.query(
      "SELECT * FROM templates WHERE id = $1 AND is_active = true",
      [params.id]
    );

    if (result.rows.length === 0) {
      return Response.json({ error: "Template not found" }, { status: 404 });
    }

    return Response.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching template:", error);
    return Response.json({ error: "Failed to fetch template" }, { status: 500 });
  }
}

// PUT update template (admin only)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userResult = await pool.query(
      "SELECT role, id FROM users WHERE email = $1",
      [session.user.email]
    );

    if (!userResult.rows[0] || userResult.rows[0].role !== "admin") {
      return Response.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { name, description, thumbnail_url, html_template, react_component, metadata, is_active } =
      await request.json();

    const result = await pool.query(
      `UPDATE templates 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           thumbnail_url = COALESCE($3, thumbnail_url),
           html_template = COALESCE($4, html_template),
           react_component = COALESCE($5, react_component),
           metadata = COALESCE($6, metadata),
           is_active = COALESCE($7, is_active),
           updated_at = NOW()
       WHERE id = $8 AND created_by = $9
       RETURNING *`,
      [
        name || null,
        description || null,
        thumbnail_url || null,
        html_template || null,
        react_component || null,
        metadata || null,
        is_active !== undefined ? is_active : null,
        params.id,
        userResult.rows[0].id,
      ]
    );

    if (result.rows.length === 0) {
      return Response.json({
        error: "Template not found or you are not the owner",
      },
      { status: 404 }
      );
    }

    return Response.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating template:", error);
    return Response.json({ error: "Failed to update template" }, { status: 500 });
  }
}

// DELETE template (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userResult = await pool.query(
      "SELECT role, id FROM users WHERE email = $1",
      [session.user.email]
    );

    if (!userResult.rows[0] || userResult.rows[0].role !== "admin") {
      return Response.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const result = await pool.query(
      "DELETE FROM templates WHERE id = $1 AND created_by = $2 RETURNING id",
      [params.id, userResult.rows[0].id]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { error: "Template not found or you are not the owner" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, id: params.id });
  } catch (error) {
    console.error("Error deleting template:", error);
    return Response.json({ error: "Failed to delete template" }, { status: 500 });
  }
}
