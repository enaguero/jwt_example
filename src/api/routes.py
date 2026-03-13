"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/users', methods=['POST'])
def create_user():

    data = request.get_json()
    print(data)

    parsed_email = data.get('email', '')
    parsed_name = data.get('name', '')
    parsed_password = data.get('password', '')

    # Crear el objeto de usuario
    new_user = User(
        email=parsed_email,
        password=parsed_password,
        name=parsed_name,
        is_active=True)

    #  Guardarlo en la base datos
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created"}), 201

# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.


@api.route("/token", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    # Recuperar al usuario de la base de datos
    user = User.query.filter_by(email=email).one_or_none()

    # Comprobar que el password entregado, sea el mismo que se uso al momento de crear el usuario.
    if not user or not user.check_password(password):
        return jsonify("Wrong username or password"), 401

    # Notice that we are passing in the actual sqlalchemy user object here
    access_token = create_access_token(identity=user.serialize())
    return jsonify(access_token=access_token), 201
