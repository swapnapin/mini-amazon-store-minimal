import sqlite3


DB_PATH = "backend/products.db"


def test_products_exist_in_database():

    connection = sqlite3.connect(DB_PATH)

    cursor = connection.cursor()

    cursor.execute(
        "SELECT id, name, brand, price, category FROM products"
    )

    products = cursor.fetchall()

    connection.close()

    assert len(products) > 0

    print("Database products:")

    for product in products:
        print(product)


def test_product_has_required_data():

    connection = sqlite3.connect(DB_PATH)

    cursor = connection.cursor()

    cursor.execute(
        "SELECT name, brand, price, category FROM products LIMIT 1"
    )

    product = cursor.fetchone()

    connection.close()

    assert product is not None

    name, brand, price, category = product

    assert name is not None
    assert brand is not None
    assert price is not None
    assert category is not None