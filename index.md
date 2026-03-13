# Authentication

## Authentication

Preguntar al usuario (o cliente) , ¿quién es?

## Authorization
Permisos del usuario (o cliente), ¿qué puede hacer? Por ejemplo, edición.

## ¿Qués JWT?
JSON Web Tokens -> JWT -> "string"

## Casos de uso

1. Problema: ¿Quién es la persona/actor que interactúa con el sistema?
   Inicio de sesión :
   -> Tener una sección de una página personalizada.
   -> Identificarse.

## ¿Cómo se resuelve el problema?

## Pasos a seguir para poder implementar un proceso de authentication

1. Crear un usuario con nombre de usuario (nickname, email, autogenerado) y un password.
   -> `POST /users`

Body:

```
{
    email: "student@4geeks.com",
    name: "Alumno",
    password: "123123123"
}
```

Return : 201

2. Creación del token (Inicio de sesión/Log in):

- `POST /token`
- `POST /sign_in`

Request Body:

```
{
    email: "student@4geeks.com",
    password: "123123123"
}
```

Response:

```
{
 "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"
}
```

3. El token se agrega en el header de llamada del cliente.
   -> Hay end-points que requieren el token y otros que no.
