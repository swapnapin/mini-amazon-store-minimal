from decimal import Decimal


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_products_are_seeded(client):
    response = client.get("/products")
    assert response.status_code == 200
    products = response.json()
    assert len(products) == 12
    assert products[0]["name"] == "iPhone 16"


def test_login_rejects_invalid_credentials(client):
    response = client.post("/login", json={"username": "testuser", "password": "wrong"})
    assert response.status_code == 401


def test_login_records_success(client):
    response = client.post("/login", json={"username": "testuser", "password": "Test@123"})
    assert response.status_code == 200
    history = client.get("/login-history").json()
    assert history[0]["username"] == "testuser"


def test_payment_total_is_calculated_from_database(client):
    response = client.post("/payments", json={
        "username": "testuser",
        "customer_email": "test@example.com",
        "card_name": "Test User",
        "card_number": "4111111111111111",
        "expiry": "12/30",
        "cvv": "123",
        "items": [{"product_id": 1, "quantity": 2}],
    })
    assert response.status_code == 200
    assert Decimal(response.json()["amount"]) == Decimal("1998.00")
    assert response.json()["transaction_id"].startswith("DEMO-")


def test_payment_rejects_unknown_product(client):
    response = client.post("/payments", json={
        "username": "testuser",
        "customer_email": "test@example.com",
        "card_name": "Test User",
        "card_number": "4111111111111111",
        "expiry": "12/30",
        "cvv": "123",
        "items": [{"product_id": 9999, "quantity": 1}],
    })
    assert response.status_code == 400
