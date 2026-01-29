import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT
        p.id, p.name, p.description, p.price, p.category_id,
        p.image_url, p.image_data, p.in_stock, p.created_at, p.updated_at,
        c.slug as category_slug, c.name as category_name,
        c.badge_bg, c.badge_text
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const product = {
      ...rows[0],
      price: Number(rows[0].price),
      image_data: rows[0].image_data
        ? typeof rows[0].image_data === "string"
          ? JSON.parse(rows[0].image_data)
          : rows[0].image_data
        : null,
      in_stock: Boolean(rows[0].in_stock),
    };

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Error fetching product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, category_id, image_url, image_data, in_stock } = body;

    await pool.execute<ResultSetHeader>(
      `UPDATE products
       SET name = ?, description = ?, price = ?, category_id = ?,
           image_url = ?, image_data = ?, in_stock = ?
       WHERE id = ?`,
      [
        name,
        description || "",
        price,
        category_id,
        image_url || null,
        image_data ? JSON.stringify(image_data) : null,
        in_stock !== false,
        id,
      ]
    );

    const [updatedProduct] = await pool.execute<RowDataPacket[]>(
      `SELECT
        p.id, p.name, p.description, p.price, p.category_id,
        p.image_url, p.image_data, p.in_stock, p.created_at, p.updated_at,
        c.slug as category_slug, c.name as category_name,
        c.badge_bg, c.badge_text
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    if (updatedProduct.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const product = {
      ...updatedProduct[0],
      price: Number(updatedProduct[0].price),
      image_data: updatedProduct[0].image_data
        ? typeof updatedProduct[0].image_data === "string"
          ? JSON.parse(updatedProduct[0].image_data)
          : updatedProduct[0].image_data
        : null,
      in_stock: Boolean(updatedProduct[0].in_stock),
    };

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Error updating product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM products WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Error deleting product" },
      { status: 500 }
    );
  }
}
