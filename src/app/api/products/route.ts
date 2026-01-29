import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = `
      SELECT
        p.id, p.name, p.description, p.price, p.category_id,
        p.image_url, p.image_data, p.in_stock, p.created_at, p.updated_at,
        c.slug as category_slug, c.name as category_name,
        c.badge_bg, c.badge_text
      FROM products p
      JOIN categories c ON p.category_id = c.id
    `;

    const params: string[] = [];

    if (category && category !== "todos") {
      query += " WHERE c.slug = ?";
      params.push(category);
    }

    query += " ORDER BY p.created_at DESC";

    const [rows] = await pool.execute<RowDataPacket[]>(query, params);

    const products = rows.map((row) => ({
      ...row,
      price: Number(row.price),
      image_data: row.image_data
        ? typeof row.image_data === "string"
          ? JSON.parse(row.image_data)
          : row.image_data
        : null,
      in_stock: Boolean(row.in_stock),
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, category_id, image_url, image_data, in_stock } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "El nombre del producto es requerido" },
        { status: 400 }
      );
    }

    if (price === undefined || price === null || isNaN(Number(price))) {
      return NextResponse.json(
        { error: "El precio es requerido y debe ser un número válido" },
        { status: 400 }
      );
    }

    if (!category_id) {
      return NextResponse.json(
        { error: "La categoría es requerida" },
        { status: 400 }
      );
    }

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO products (name, description, price, category_id, image_url, image_data, in_stock)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        description || "",
        Number(price),
        category_id,
        image_url || null,
        image_data ? JSON.stringify(image_data) : null,
        in_stock !== false,
      ]
    );

    const [newProduct] = await pool.execute<RowDataPacket[]>(
      `SELECT
        p.id, p.name, p.description, p.price, p.category_id,
        p.image_url, p.image_data, p.in_stock, p.created_at, p.updated_at,
        c.slug as category_slug, c.name as category_name,
        c.badge_bg, c.badge_text
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [result.insertId]
    );

    const product = {
      ...newProduct[0],
      price: Number(newProduct[0].price),
      image_data: newProduct[0].image_data
        ? typeof newProduct[0].image_data === "string"
          ? JSON.parse(newProduct[0].image_data)
          : newProduct[0].image_data
        : null,
      in_stock: Boolean(newProduct[0].in_stock),
    };

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: `Error al crear producto: ${error instanceof Error ? error.message : "Error desconocido"}` },
      { status: 500 }
    );
  }
}
