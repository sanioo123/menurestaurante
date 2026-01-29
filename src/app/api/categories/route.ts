import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT
        c.id, c.name, c.slug, c.badge_bg, c.badge_text,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.id
    `);

    const [totalRows] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM products"
    );

    const categories = [
      {
        id: 0,
        name: "Todos",
        slug: "todos",
        badge_bg: "#F6F7F8",
        badge_text: "#1A1A1A",
        product_count: totalRows[0].total,
      },
      ...rows.map((row) => ({
        ...row,
        product_count: Number(row.product_count),
      })),
    ];

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}
