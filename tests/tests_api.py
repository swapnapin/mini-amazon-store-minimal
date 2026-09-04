import requests


BASE_API = "http://127.0.0.1:8000"


def test_get_products_api():

    response = requests.get(
        f"{BASE_API}/products"
    )

    assert response.status_code == 200

    products = response.json()

    assert isinstance(products, list)

    assert len(products) > 0

    print("Products returned:", products)


def test_login_api():

    response = requests.post(
        f"{BASE_API}/login",
        params={
            "username": "testuser"
        }
    )

    assert response.status_code == 200

    data = response.json()

    print("Login API response:", data)


def test_login_history_api():

    response = requests.get(
        f"{BASE_API}/login-history"
    )

    assert response.status_code == 200

    history = response.json()

    assert isinstance(history, list)

    print("Login history:", history)