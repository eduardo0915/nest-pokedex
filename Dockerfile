#con esto me estoy basando en una imagen de node con todas sus caracteristicas
FROM node:20-buster-slim

# Set working directory
#con este creo el directorio en el pach del contenedor
RUN mkdir -p /var/www/pokedex 
WORKDIR /var/www/pokedex

# Copiar el directorio y su contenido
# con esto copio todo mi proyecto en esa ruta
COPY . /var/www/pokedex
COPY package.json tsconfig.json tsconfig.build.json /var/www/pokedex/
RUN npm install --prod
RUN npm run build


# Dar permiso para ejecutar la applicación
# se crea un nuevo usuario para solo permitirle que acceda a esa carpeta en especifico
RUN adduser --disabled-password pokeuser
RUN chown -R pokeuser:pokeuser /var/www/pokedex
USER pokeuser



# Limpiar el caché
RUN npm run cache clean --force

EXPOSE 3000

CMD [ "npm run","start" ]