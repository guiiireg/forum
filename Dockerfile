# Utilisation de Node.js 20 comme base
FROM node:20

# Définition du répertoire de travail
WORKDIR /forum

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Exposer le port sur lequel ton serveur tourne
EXPOSE 3000

# Commande de démarrage
CMD ["node", "server/js/server/index.js"]
