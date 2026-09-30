import os
import json
import sqlite3
import random
import uuid
from typing import Optional, List, Union
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import DB_PATH, init_db

init_db()

app = FastAPI(
    title="Luxury Saree D2C E-Commerce API",
    description="REST API server supporting Koskii, Libas, Ekana Label inspired Saree App",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

class OrderItem(BaseModel):
    product_id: Union[int, str] = 1
    name: str = "Handloom Saree"
    price: float = 0.0
    quantity: int = 1
    image_url: str = ""

class CheckoutRequest(BaseModel):
    customer_name: str
    customer_email: Optional[str] = "customer@example.com"
    customer_phone: str
    shipping_address: str
    city: Optional[str] = "Metropolitan"
    pincode: str
    payment_method: Optional[str] = "UPI"
    utr_number: Optional[str] = ""
    payment_status: Optional[str] = "Paid & Verified"
    items: List[OrderItem] = []
    total_amount: float
    discount_applied: Optional[float] = 0.0

class PincodeCheckRequest(BaseModel):
    pincode: str

class ProductImportItem(BaseModel):
    name: str
    category: str
    fabric: str
    occasion: str
    work: str = "Handloom Weave"
    color: str = "Multicolor"
    price: float
    mrp: float
    discount_percent: Optional[int] = 0
    rating: Optional[float] = 4.8
    reviews_count: Optional[int] = 10
    in_stock: Optional[bool] = True
    is_bestseller: Optional[bool] = False
    is_new: Optional[bool] = True
    image_url: str
    gallery: Optional[List[str]] = []
    description: str = "Luxury handloom saree."
    length_meters: Optional[float] = 5.5
    blouse_details: Optional[str] = "0.80 Meters Unstitched Blouse Piece"
    care_instructions: Optional[str] = "Dry Clean Only"

class BulkImportRequest(BaseModel):
    products: List[ProductImportItem]
    clear_existing: Optional[bool] = False

@app.get("/")
def read_root():
    return {"message": "Welcome to Luxury Saree D2C API Server", "status": "online"}

@app.get("/api/products")
def get_products(
    search: Optional[str] = None,
    category: Optional[str] = None,
    fabric: Optional[str] = None,
    occasion: Optional[str] = None,
    color: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    is_bestseller: Optional[bool] = None,
    is_new: Optional[bool] = None,
    sort_by: Optional[str] = Query("popular", enum=["popular", "price_low_high", "price_high_low", "newest", "rating"])
):
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM products WHERE 1=1"
    params = []

    if search:
        query += " AND (name LIKE ? OR description LIKE ? OR category LIKE ? OR fabric LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term, term])

    if category:
        query += " AND (category LIKE ? OR fabric LIKE ? OR occasion LIKE ?)"
        cat_term = f"%{category}%"
        params.extend([cat_term, cat_term, cat_term])

    if fabric:
        query += " AND fabric LIKE ?"
        params.append(f"%{fabric}%")

    if occasion:
        query += " AND occasion LIKE ?"
        params.append(f"%{occasion}%")

    if color:
        query += " AND color = ?"
        params.append(color)

    if min_price is not None:
        query += " AND price >= ?"
        params.append(min_price)

    if max_price is not None:
        query += " AND price <= ?"
        params.append(max_price)

    if is_bestseller:
        query += " AND is_bestseller = 1"

    if is_new:
        query += " AND is_new = 1"

    # Sorting
    if sort_by == "price_low_high":
        query += " ORDER BY price ASC"
    elif sort_by == "price_high_low":
        query += " ORDER BY price DESC"
    elif sort_by == "newest":
        query += " ORDER BY id DESC"
    elif sort_by == "rating":
        query += " ORDER BY rating DESC"
    else:
        query += " ORDER BY is_bestseller DESC, rating DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    products = []
    for row in rows:
        item = dict(row)
        item["gallery"] = json.loads(item["gallery"])
        item["in_stock"] = bool(item["in_stock"])
        item["is_bestseller"] = bool(item["is_bestseller"])
        item["is_new"] = bool(item["is_new"])
        products.append(item)

    return {"count": len(products), "products": products}

@app.get("/api/products/{product_id}")
def get_product_by_id(product_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Saree product not found")

    item = dict(row)
    item["gallery"] = json.loads(item["gallery"])
    item["in_stock"] = bool(item["in_stock"])
    item["is_bestseller"] = bool(item["is_bestseller"])
    item["is_new"] = bool(item["is_new"])
    return item

@app.get("/api/categories")
def get_filter_options():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT DISTINCT category FROM products")
    categories = [r["category"] for r in cursor.fetchall()]

    cursor.execute("SELECT DISTINCT fabric FROM products")
    fabrics = [r["fabric"] for r in cursor.fetchall()]

    cursor.execute("SELECT DISTINCT occasion FROM products")
    occasions = [r["occasion"] for r in cursor.fetchall()]

    cursor.execute("SELECT DISTINCT color FROM products")
    colors = [r["color"] for r in cursor.fetchall()]

    conn.close()
    return {
        "categories": categories,
        "fabrics": fabrics,
        "occasions": occasions,
        "colors": colors
    }

@app.post("/api/orders")
def place_order(req: CheckoutRequest):
    try:
        conn = get_db()
        cursor = conn.cursor()

        order_id = f"SAR-{random.randint(10000, 99999)}"
        items_json = json.dumps([item.dict() for item in req.items])

        cursor.execute('''
            INSERT INTO orders (
                id, customer_name, customer_email, customer_phone,
                shipping_address, city, pincode, payment_method,
                utr_number, payment_status,
                total_amount, discount_applied, items_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            order_id,
            req.customer_name,
            req.customer_email or "customer@example.com",
            req.customer_phone,
            req.shipping_address,
            req.city or "Metropolitan",
            req.pincode,
            req.payment_method or "UPI",
            req.utr_number or "",
            req.payment_status or "Paid & Verified",
            float(req.total_amount),
            float(req.discount_applied or 0.0),
            items_json
        ))
        conn.commit()
        conn.close()

        return {
            "success": True,
            "order_id": order_id,
            "message": f"Order {order_id} confirmed successfully!",
            "estimated_delivery": "3-5 Business Days"
        }
    except Exception as e:
        print("Error processing order:", str(e))
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/api/orders")
def get_orders():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()

    orders = []
    for r in rows:
        item = dict(r)
        item["items"] = json.loads(item["items_json"])
        orders.append(item)

    return {"count": len(orders), "orders": orders}

@app.post("/api/pincode/check")
def check_pincode(req: PincodeCheckRequest):
    code = req.pincode.strip()
    if len(code) == 6 and code.isdigit():
        days = random.randint(2, 4)
        return {
            "deliverable": True,
            "pincode": code,
            "estimated_days": f"{days} Business Days",
            "cod_available": True,
            "express_available": True
        }
    return {
        "deliverable": False,
        "message": "Invalid 6-digit Pincode. Please enter a valid Indian pincode."
    }

@app.post("/api/products/import")
def import_products(req: BulkImportRequest):
    conn = get_db()
    cursor = conn.cursor()

    if req.clear_existing:
        cursor.execute("DELETE FROM products")

    inserted_count = 0
    for p in req.products:
        disc = p.discount_percent or (int(round((1 - p.price / p.mrp) * 100)) if p.mrp > p.price else 0)
        gallery_json = json.dumps(p.gallery if p.gallery else [p.image_url])
        
        cursor.execute('''
            INSERT INTO products (
                name, category, fabric, occasion, work, color,
                price, mrp, discount_percent, rating, reviews_count,
                in_stock, is_bestseller, is_new, image_url, gallery,
                description, length_meters, blouse_details, care_instructions
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            p.name, p.category, p.fabric, p.occasion, p.work, p.color,
            p.price, p.mrp, disc, p.rating, p.reviews_count,
            1 if p.in_stock else 0, 1 if p.is_bestseller else 0, 1 if p.is_new else 0,
            p.image_url, gallery_json, p.description, p.length_meters,
            p.blouse_details, p.care_instructions
        ))
        inserted_count += 1

    conn.commit()
    conn.close()

    return {
        "success": True,
        "imported_count": inserted_count,
        "message": f"Successfully imported {inserted_count} products into Riddhi Collection catalog!"
    }
