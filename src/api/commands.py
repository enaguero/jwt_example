from decimal import Decimal

import click

from api.models import Order, Product, User, db

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration
with youy database, for example: Import the price of bitcoin every night as 12am
"""


SEEDED_PRODUCTS = [
    {
        "name": "JWT Starter Kit",
        "slug": "jwt-starter-kit",
        "description": "Pack de inicio con libreta, pegatinas y mini guia para practicar autenticacion.",
        "category": "Learning",
        "image_url": "https://picsum.photos/seed/jwt-starter-kit/900/600",
        "price": Decimal("29.00")
    },
    {
        "name": "React Route Map",
        "slug": "react-route-map",
        "description": "Poster visual para entender navegacion, layouts y rutas protegidas en React Router.",
        "category": "Frontend",
        "image_url": "https://picsum.photos/seed/react-route-map/900/600",
        "price": Decimal("45.00")
    },
    {
        "name": "Flask Auth Mug",
        "slug": "flask-auth-mug",
        "description": "Taza de edicion limitada para acompanar tus sesiones de backend y testing.",
        "category": "Merch",
        "image_url": "https://picsum.photos/seed/flask-auth-mug/900/600",
        "price": Decimal("18.50")
    },
    {
        "name": "Secure Cookies Notebook",
        "slug": "secure-cookies-notebook",
        "description": "Cuaderno reutilizable para diagramar sesiones, tokens y flujos de seguridad.",
        "category": "Learning",
        "image_url": "https://picsum.photos/seed/secure-cookies-notebook/900/600",
        "price": Decimal("32.00")
    },
    {
        "name": "API Testing Cards",
        "slug": "api-testing-cards",
        "description": "Tarjetas de referencia rapida con ejemplos de requests, headers y respuestas HTTP.",
        "category": "Backend",
        "image_url": "https://picsum.photos/seed/api-testing-cards/900/600",
        "price": Decimal("24.90")
    },
    {
        "name": "Deployment Survival Pack",
        "slug": "deployment-survival-pack",
        "description": "Bundle con checklist de variables de entorno, migraciones y despliegue continuo.",
        "category": "DevOps",
        "image_url": "https://picsum.photos/seed/deployment-survival-pack/900/600",
        "price": Decimal("52.00")
    }
]


def seed_user(name, email, password):
    user = User(name=name, email=email, is_active=True)
    user.set_password(password)
    db.session.add(user)
    db.session.flush()
    return user


def seed_product(product_data):
    product = Product(**product_data, is_active=True)
    db.session.add(product)
    db.session.flush()
    return product


def setup_commands(app):

    """
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users")
    @click.argument("count")
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.name = "Test User " + str(x)
            user.set_password("123456")
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        print("Resetting sample data")

        Order.query.delete()
        Product.query.delete()
        User.query.delete()
        db.session.commit()

        lara = seed_user("Lara Instructor", "lara@example.com", "demo123")
        diego = seed_user("Diego Student", "diego@example.com", "demo123")

        products = {
            product_data["slug"]: seed_product(product_data)
            for product_data in SEEDED_PRODUCTS
        }

        db.session.add_all([
            Order(
                user_id=lara.id,
                product_id=products["jwt-starter-kit"].id,
                quantity=1,
                status="paid",
                unit_price=products["jwt-starter-kit"].price
            ),
            Order(
                user_id=lara.id,
                product_id=products["react-route-map"].id,
                quantity=2,
                status="shipped",
                unit_price=products["react-route-map"].price
            ),
            Order(
                user_id=diego.id,
                product_id=products["api-testing-cards"].id,
                quantity=1,
                status="paid",
                unit_price=products["api-testing-cards"].price
            )
        ])

        db.session.commit()

        print("Seed completed")
        print("Users:")
        print(" - lara@example.com / demo123")
        print(" - diego@example.com / demo123")
        print("Products:", len(products))
