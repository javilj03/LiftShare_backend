# Establece la imagen base
FROM node:14

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json (si existe) al directorio de trabajo
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de los archivos de la aplicación al directorio de trabajo
COPY . .

# Expone el puerto en el que tu aplicación está escuchando
EXPOSE 3000

RUN chmod +x /app/docker-entrypoint.sh

# Establece el archivo entrypoint.sh como el punto de entrada del contenedor
ENTRYPOINT ["/app/docker-entrypoint.sh"]