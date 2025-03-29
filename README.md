# Proyecto: Evaluación NestJS

## Instalación y Configuración

### 1. Requisitos previos
Antes de comenzar, asegúrate de tener instalado:
- **Node.js v22.11** o superior
- **Docker Desktop** o una versión compatible de Docker para tu dispositivo

### 2. Clonar el repositorio
```sh
$ git clone https://github.com/DominiqueDVD/be-mantenedor-usaurios.git
$ cd be-mantenedor-usaurios

```

### 3. Instalación de dependencias
Ejecuta el siguiente comando para instalar las dependencias del proyecto:
```sh
$ npm install
```

### 4. Levantar la base de datos con Docker
Para ejecutar el contenedor de PostgreSQL, usa:
```sh
$ docker compose up -d
```
**Importante!** Asegúrate de que el puerto `5432` no esté en uso, ya que la base de datos se ejecutará en este puerto.
**Importante!** Para una exitosa conexión a la base de datos recuerda cambiar el nombre del archivo .env.example a .env. Este archivo contiene las variables necesarias para conectarse a la base de datos y otras configuraciones del proyecto. Recuerda que subir un archivo .env directamente al repositorio sería una mala práctica, por lo tanto, se debe cambiar el nombre a .env en lugar de .env.example.

### 4.1 Alternativa sin Docker  
Si tienes problemas con Docker o prefieres configurar PostgreSQL manualmente, se ha proporcionado un script SQL llamado **`DB_postgres.sql`** para crear la base de datos localmente.  

#### Pasos:  
1. Asegúrate de tener PostgreSQL instalado en tu sistema.  
2. Ejecuta el script **`DB_postgres.sql`** en tu base de datos PostgreSQL.  
3. Modifica el archivo **`.env.example`** con tu usuario y contraseña de PostgreSQL local, posteriormente, cambia el nombre de este archivo a **`.env`** para una exitosa conexión a la base de datos.  

### 5. Iniciar el servidor
Ejecuta el siguiente comando para iniciar la aplicación:
```sh
$ npm run start
```
La aplicación se ejecutará en el puerto `3000`. **Verifica que este puerto esté libre antes de iniciar.**

Puedes acceder a la documentación de la API en Swagger desde:
[http://localhost:3000/api](http://localhost:3000/api)

### 6. Ejecutar pruebas unitarias
Para ejecutar los tests unitarios, usa:
```sh
$ npm test
```

---

## Resultados Esperados

### **POST** `http://localhost:3000/usuarios/`
Se debe enviar un JSON en el cuerpo de la solicitud con los siguientes atributos:
- `name`
- `email` (debe tener un formato válido y no estar registrado previamente)
- `password` (debe ser segura, con al menos 8 caracteres, una mayúscula y un número)
- `phones` (arreglo con objetos que incluyan `number`, `citycode`, `countrycode`)

#### **Resultado exitoso:**
```json
{
    "id": "11158a45-ded8-4f47-a625-d77902ec97a6",
    "created": "2025-03-27T02:51:14.085Z",
    "modified": "2025-03-27T02:51:14.085Z",
    "last_login": "2025-03-26T23:51:14.078Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzdWFyaW9AcHJ1ZWJhLmNsIiwiaWF0IjoxNzQzMDMzMDc0fQ.u-Cs9xf5JJURkn_6xkokPMW84rz-ih8baUdrXftK44w",
    "isactive": true
}
```

#### **Errores posibles:**
- **Faltan campos en `phones`**
```json
{
    "mensaje": "Faltan campos requeridos en los teléfonos (number, citycode, countrycode)"
}
```

- **Faltan campos en usuario**
```json
{
    "mensaje": "Faltan campos requeridos (name, email, password, phone)"
}
```

- **Correo ya registrado**
```json
{
    "mensaje": "El correo ya está registrado"
}
```

- **Formato de correo inválido**
```json
{
    "mensaje": "El formato del correo electrónico no es válido"
}
```

- **Formato de contraseña inválido**
```json
{
    "mensaje": "La contraseña no es válida, debe contener al menos 8 caracteres, una mayúscula y un número"
}
```

---

### **GET** `http://localhost:3000/usuarios/`
Se espera obtener un arreglo de JSON con la estructura definida en el documento de especificaciones. 

- Si no hay registros previos, el arreglo se devolverá vacío.
- El `id` se genera con `UUID`.
- El `token` se genera utilizando `JWT`.

#### **Resultado exitoso:**
```json
[
    {
        "id": "11158a45-ded8-4f47-a625-d77902ec97a6",
        "name": "Usuario de prueba",
        "email": "usuario@prueba.cl",
        "phones": [
            {
                "number": "1234567",
                "citycode": "1",
                "countrycode": "57"
            }
        ],
        "created": "2025-03-27T02:51:14.085Z",
        "modified": "2025-03-27T02:51:14.085Z",
        "last_login": "2025-03-26T23:51:14.078Z",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzdWFyaW9AcHJ1ZWJhLmNsIiwiaWF0IjoxNzQzMDMzMDc0fQ.u-Cs9xf5JJURkn_6xkokPMW84rz-ih8baUdrXftK44w",
        "isactive": true
    }
]
```

---

### **GET** `http://localhost:3000/usuarios/{id}`
Se espera recibir un `id` válido en el path y devolver el usuario correspondiente en formato JSON.

#### **Resultado exitoso:**
```json
{
    "id": "11158a45-ded8-4f47-a625-d77902ec97a6",
    "name": "Usuario de prueba",
    "email": "usuario@prueba.cl",
    "phones": [
        {
            "number": "1234567",
            "citycode": "1",
            "countrycode": "57"
        }
    ],
    "created": "2025-03-27T02:51:14.085Z",
    "modified": "2025-03-27T02:51:14.085Z",
    "last_login": "2025-03-26T23:51:14.078Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzdWFyaW9AcHJ1ZWJhLmNsIiwiaWF0IjoxNzQzMDMzMDc0fQ.u-Cs9xf5JJURkn_6xkokPMW84rz-ih8baUdrXftK44w",
    "isactive": true
}
```

#### **Errores posibles:**
- **Usuario no encontrado**
```json
{
    "mensaje": "Usuario no encontrado"
}
```
- **ID de usuario inválido**
```json
{
    "mensaje": "ID de usuario inválido"
}
```

---

### **DELETE** `http://localhost:3000/usuarios/{id}`
Este es un **borrado lógico**, lo que significa que cambia el estado `isActive` de `true` a `false`.

#### **Resultado exitoso:**
```json
{
    "mensaje": "Usuario eliminado con éxito"
}
```

#### **Errores posibles:**
- **Usuario no encontrado**
```json
{
    "mensaje": "Usuario no encontrado"
}
```
- **ID de usuario inválido**
```json
{
    "mensaje": "ID de usuario inválido"
}
```
- **Error interno del servidor**
```json
{
    "mensaje": "Error interno del servidor"
}
```
- **Usuario ya eliminado**
```json
{
    "mensaje": "El usuario ya fue eliminado"
}

