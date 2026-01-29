import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "47726473",
  database: "restaurante_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

export type Category = {
  id: number;
  name: string;
  slug: string;
  badge_bg: string;
  badge_text: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  category_slug?: string;
  category_name?: string;
  badge_bg?: string;
  badge_text?: string;
  image_url: string | null;
  image_data: {
    zoom?: number;
    rotation?: number;
    flipH?: boolean;
  } | null;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
};
