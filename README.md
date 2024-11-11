# Proyecto Final de Programación III 🚗

# Especificaciones funcionales :clipboard:

## Introducción 🌟
Proyecto Final para la materia de Programación III de la Universidad de Entre Ríos. El proyecto consiste en realizar una API REST para la gestión de reclamos de una concesionaria de automoviles, esta API deberá incluir un sistema de autenticación y autorización con tres perfiles distintos: administrador, empleado y cliente. 
La API Rest debe asegurar un manejo eficiente y seguro de los reclamos, garantizando que cada perfil tenga
acceso únicamente a las funciones correspondientes a sus responsabilidades. Además se espera que sea
segura, eficiente y fácil de integrar con los sistemas actuales de la empresa.  

## Instalación y configuración del proyecto ⚙️

-BACKEND: 
ingresar los siguientes comandos:

```npm i```

Este comando instalara las depedencias necesarias.

Para la conexion con la base de datos: 
Crear un archivo .env en la carpeta Backend con las credenciales de su conexion en Workbench teniendo este modelo:

#### DB_HOST=localhost  
#### DB_USER=nombre_usuario  
#### DB_PASSWORD=contraseña_personal  
#### DB_NAME=nombre_database_proyecto  
#### DB_CONNECTION_LIMIT=10  
#### DB_QUEUE_LIMIT=0
#### JWT_SECRET=clave_secreta_jwt
#### CORREO=correo_electronico
#### CLAVE=contraseña_aplicación_gmail
#### PORT=puerto_servidor

Se utiliza correo y clave, generados por gmail en contraseñas de aplicación para el uso correspondiente de envios de mails mediante nodemailer

Se implemento el uso de redis en el proyecto backend para almacenar en caché las respuestas y optimizar el rendimiento., su uso correspondiente debera tener ejecutando de manera local redis-server.exe

## Scripts disponibles:

Para iniciar el servidor en modo desarrollo (con nodemon):
```npm run dev```

## Dependencias importantes 📦

#### express: Framework web para Node.js.
#### mysql2: Conector para trabajar con MySQL.
#### jsonwebtoken: Manejo de autenticación con tokens JWT.
#### bcrypt: Para encriptar y verificar contraseñas.
#### nodemailer: Envío de correos electrónicos.
#### dotenv: Carga de variables de entorno desde archivos .env.
#### redis: Implementación de cache con Redis.
#### puppeteer: Para generar documentos PDF dinámicos.
#### csv-writer: Librería para escribir datos en archivos CSV de manera sencilla y estructurada.
#### multer: Manejo de subida de archivos (por ejemplo, imágenes o documentos) en el backend.
#### joi: Librería para la validación de datos, que permite definir y aplicar reglas de validación en el backend para asegurar la integridad de los datos enviados por los usuarios.
#### passport: Middleware de autenticación para Node.js, utilizado en conjunto con estrategias como JWT para gestionar la autenticación de usuarios de manera segura.
#### handlebars: Motor de plantillas que permite generar contenido HTML dinámico, útil para crear correos electrónicos personalizados y documentos HTML en el backend.

## Notas adicionales 📝

El proyecto implementa un sistema de roles con JWT para autenticación, asegurando que cada tipo de usuario (administrador, empleado, cliente) tenga acceso únicamente a las funcionalidades correspondientes a su rol.
Se utiliza Nodemailer para el envío de correos electrónicos, lo que permite notificar a los usuarios sobre el estado de sus reclamos.
Redis mejora la eficiencia al manejar el almacenamiento en caché, reduciendo el tiempo de respuesta en las consultas más frecuentes.

## Autores ✒️

#### Manuel Alejandro García



