# Etapa 1: Construir la aplicación
FROM node:18-alpine AS build
# Crear directorio de trabajo
WORKDIR /app
# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./
# Instalar dependencias
RUN npm install
# Copiar el código fuente
COPY . .
# Ejecutar el comando de Tailwind CSS
RUN npx @tailwindcss/cli -i ./css/style.css -o ./dist/output.css
# Compilar TypeScript a JavaScript
RUN npm run build

# Etapa 2: Configurar nginx para servir la aplicación
FROM nginx:alpine
# Copiar los archivos compilados desde la etapa de construcción
COPY --from=build /app /usr/share/nginx/html
# Exponer el puerto 80
EXPOSE 80
# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
