import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "saree_store.db")

SAMPLE_SAREES = [
    {
        "name": "Magenta Pink Moss Printed Saree with Golden Zari Border",
        "category": "Printed",
        "fabric": "Moss",
        "occasion": "Festive",
        "work": "Golden Zari Border & Traditional Print",
        "color": "Pink",
        "price": 675,
        "mrp": 1499,
        "discount_percent": 55,
        "rating": 4.8,
        "reviews_count": 34,
        "in_stock": True,
        "is_bestseller": True,
        "is_new": True,
        "image_url": "/moss_saree_pink.jpg",
        "gallery": json.dumps([
            "/moss_saree_pink.jpg",
            "/moss_saree_back.jpg",
            "/moss_saree_border.jpg",
            "/moss_saree_pallu.jpg"
        ]),
        "description": "Vibrant Magenta Pink Moss saree featuring rich golden zari woven border, printed traditional motifs, elegant pallu tassels, and running blouse. Hand washable with bright fast colours.",
        "length_meters": 6.3,
        "blouse_details": "Running blouse piece included",
        "care_instructions": "Hand washable / gentle wash"
    },
    {
        "name": "Pure Cotton Kota Checks Saree with Golden Zari Border & Chit Pallu",
        "category": "Cotton",
        "fabric": "Pure Cotton",
        "occasion": "Festive",
        "work": "100% Handwoven Kota Checks & Chit Pallu with Gold Zari Border",
        "color": "Black",
        "price": 1250,
        "mrp": 2499,
        "discount_percent": 50,
        "rating": 4.9,
        "reviews_count": 42,
        "in_stock": True,
        "is_bestseller": True,
        "is_new": True,
        "image_url": "/black_saree_front.jpg",
        "gallery": json.dumps([
            "/black_saree_front.jpg",
            "/black_saree_back.jpg"
        ]),
        "description": "100% Handwoven Pure Cotton Saree featuring fine Kota checks, rich golden zari border, and traditional Chit Pallu. Lightweight, breathable luxury drape.",
        "length_meters": 6.3,
        "blouse_details": "Matching unstitched blouse piece included",
        "care_instructions": "Gentle hand wash / Dry clean recommended"
    },
    {
        "name": "Pure South Cotton Striped Saree with Chit Pallu",
        "category": "Cotton",
        "fabric": "Pure South Cotton",
        "occasion": "Traditional",
        "work": "100% Handwoven South Cotton Stripes & Chit Pallu",
        "color": "Purple",
        "price": 1250,
        "mrp": 2499,
        "discount_percent": 50,
        "rating": 4.9,
        "reviews_count": 38,
        "in_stock": True,
        "is_bestseller": True,
        "is_new": True,
        "image_url": "/south_cotton_front.jpg",
        "gallery": json.dumps([
            "/south_cotton_front.jpg",
            "/south_cotton_back.jpg"
        ]),
        "description": "100% Handwoven Pure South Cotton Saree featuring deep purple & ochre vertical stripes, temple zari border, and traditional Chit Pallu.",
        "length_meters": 6.3,
        "blouse_details": "Matching purple cotton blouse piece included",
        "care_instructions": "Gentle hand wash / Dry clean"
    },
    {
        "name": "Cream Pure Bombay Cotton Saree with Embroidered Work Pallu",
        "category": "Cotton",
        "fabric": "Pure Bombay Cotton",
        "occasion": "Festive",
        "work": "Geometric Bootee Embroidery & Work Pallu with Gold Zari Border",
        "color": "Cream",
        "price": 1250,
        "mrp": 2499,
        "discount_percent": 50,
        "rating": 4.9,
        "reviews_count": 36,
        "in_stock": True,
        "is_bestseller": True,
        "is_new": True,
        "image_url": "/cream_cotton_front.jpg",
        "gallery": json.dumps([
            "/cream_cotton_front.jpg",
            "/cream_cotton_back.jpg"
        ]),
        "description": "Breathable Pure Bombay Cotton Saree featuring elegant coral embroidered geometric bootas, rich embroidered work pallu, and woven gold zari border.",
        "length_meters": 6.3,
        "blouse_details": "Matching cream cotton blouse piece included",
        "care_instructions": "Gentle hand wash / Dry clean recommended"
    },
    {
        "name": "Metallic Taupe Tissue Silk Saree with Original DMC Swarovski Work",
        "category": "Silk",
        "fabric": "Tissue Silk",
        "occasion": "Party Wear",
        "work": "Original DMC Swarovski Work, Piping Border & Rich Pallu",
        "color": "Gold",
        "price": 2450,
        "mrp": 4999,
        "discount_percent": 51,
        "rating": 5.0,
        "reviews_count": 48,
        "in_stock": True,
        "is_bestseller": True,
        "is_new": True,
        "image_url": "/tissue_silk_front.jpg",
        "gallery": json.dumps([
            "/tissue_silk_front.jpg",
            "/tissue_silk_back.jpg"
        ]),
        "description": "Luminous Metallic Taupe & Champagne Gold Tissue Silk Saree embellished with original DMC Swarovski crystals, delicate piping border, and rich brocade pallu. Includes matching running blouse fabric.",
        "length_meters": 6.3,
        "blouse_details": "Running blouse fabric included",
        "care_instructions": "Dry clean only"
    }
]

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Table: Products
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            fabric TEXT NOT NULL,
            occasion TEXT NOT NULL,
            work TEXT NOT NULL,
            color TEXT NOT NULL,
            price REAL NOT NULL,
            mrp REAL NOT NULL,
            discount_percent INTEGER NOT NULL,
            rating REAL DEFAULT 4.8,
            reviews_count INTEGER DEFAULT 0,
            in_stock BOOLEAN DEFAULT 1,
            is_bestseller BOOLEAN DEFAULT 0,
            is_new BOOLEAN DEFAULT 0,
            image_url TEXT NOT NULL,
            gallery TEXT NOT NULL,
            description TEXT NOT NULL,
            length_meters REAL DEFAULT 5.5,
            blouse_details TEXT NOT NULL,
            care_instructions TEXT NOT NULL
        )
    ''')

    # Table: Orders
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            customer_name TEXT NOT NULL,
            customer_email TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            shipping_address TEXT NOT NULL,
            city TEXT NOT NULL,
            pincode TEXT NOT NULL,
            payment_method TEXT NOT NULL,
            utr_number TEXT DEFAULT '',
            payment_status TEXT DEFAULT 'Verified',
            total_amount REAL NOT NULL,
            discount_applied REAL DEFAULT 0,
            status TEXT DEFAULT 'Confirmed',
            items_json TEXT NOT NULL
        )
    ''')

    # Check if empty, seed
    cursor.execute("SELECT COUNT(*) FROM products")
    count = cursor.fetchone()[0]
    if count == 0:
        for p in SAMPLE_SAREES:
            cursor.execute('''
                INSERT INTO products (
                    name, category, fabric, occasion, work, color, price, mrp,
                    discount_percent, rating, reviews_count, in_stock, is_bestseller,
                    is_new, image_url, gallery, description, length_meters, blouse_details, care_instructions
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                p["name"], p["category"], p["fabric"], p["occasion"], p["work"], p["color"],
                p["price"], p["mrp"], p["discount_percent"], p["rating"], p["reviews_count"],
                p["in_stock"], p["is_bestseller"], p["is_new"], p["image_url"], p["gallery"],
                p["description"], p["length_meters"], p["blouse_details"], p["care_instructions"]
            ))
        conn.commit()
        print(f"Seeded DB with {len(SAMPLE_SAREES)} luxury sarees.")

    conn.close()

if __name__ == "__main__":
    init_db()
