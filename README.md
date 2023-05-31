# LiftShare_backend
## Iniciar proyecto
Este proyecto esta creado con docker, para levantar este proyecto será necesario levantar el docker-compose y este ejecutará el servidor y la base de datos.
`sudo docker compose up --build`
El servidor se levanta en el puerto 3000, la base de datos en el 27017, y mongo express (visualizacion de la base de datos) en el puerto 8081

## Fallo en el proyecto
Usando la libreria multer de js se deben subir las imagenes que se reciban por petición.
### Explicación 
Uso express para crear el servidor y poder hacer las peticiones, el index.js de la raiz del proyecto simplemente carga los datos principales, entre ellos carga el router de las peticiones.
Las peticiones se encuentran en `/src/database/index.js` en este fichero se establece la conexión con la base de datos y se crean peticiones.
El error se produce en la `linea 368`, se encuentra el codigo comentado por pruebas para intentar solucionar el problema. 
En el caso de descomentar el error la variable upload deberá ser de la siguiente forma `var upload = multer({ storage: storage })`

La petición crea una entrada a la base de datos sin ningun problema pero añade la imagen a la carpeta /uploads sin mostrar errores.


correo: javijm03@gmail.com
