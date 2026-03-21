import { randomBytes, scryptSync } from "node:crypto";

import { pool } from "../../../lib/postgres";

export const runtime = "nodejs";

type SignupBody = {
  name?: string;
  email?: string;
  password?: string;
};

const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:8080";

const withCors = (response: Response) => {
  response.headers.set("Access-Control-Allow-Origin", frontendUrl);
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
};

const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

export async function OPTIONS() {
  return withCors(new Response(null, { status: 204 }));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignupBody;

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!name || !email || !password) {
      return withCors(Response.json({ error: "Name, email, and password are required." }, { status: 400 }));
    }

    if (password.length < 8) {
      return withCors(Response.json({ error: "Password must be at least 8 characters." }, { status: 400 }));
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const passwordHash = hashPassword(password);

    const result = await pool.query(
      `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        ON CONFLICT (email) DO NOTHING
        RETURNING id, name, email, created_at;
      `,
      [name, email, passwordHash],
    );

    if (result.rowCount === 0) {
      return withCors(Response.json({ error: "Email already registered." }, { status: 409 }));
    }

    return withCors(Response.json({ user: result.rows[0] }, { status: 201 }));
  } catch (error) {
    console.error("Signup error", error);
    return withCors(Response.json({ error: "Internal server error." }, { status: 500 }));
  }
}
