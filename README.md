# API Mongoose

Une API RESTful développée avec Express.js et MongoDB (via Mongoose) pour gérer des profils utilisateurs.

## Fonctionnalités

- **CRUD pour les profils utilisateurs** :
  - `GET /profiles` : Récupérer tous les profils
  - `GET /profiles/:id` : Récupérer un profil par ID
  - `POST /profiles` : Créer un nouveau profil (nom et email requis)
  - `PUT /profiles/:id` : Mettre à jour un profil par ID (nom et email uniquement)
  - `DELETE /profiles/:id` : Supprimer un profil par ID (Soft-Delete)
- **Gestion des expériences** :
  - `POST /profiles/:id/experience` : Ajouter une expérience à un profil
  - `DELETE /profiles/:id/experience/:exp` : Supprimer une expérience d'un profil
- **Gestion des compétences** :
  - `POST /profiles/:id/skills` : Ajouter une compétence à un profil
  - `DELETE /profiles/:id/skills/:skill` : Supprimer une compétence d'un profil
- **Mise à jour des informations** :
  - `PUT /profiles/:id/information` : Mettre à jour les informations d'un profil
- **Liste d'amis** :
  - Ajouter, supprimer et récupérer les amis d'un profil.

## Prérequis

- Node.js (v14 ou supérieur)
- npm
- Docker (pour MongoDB)

## Installation

1. Clonez ce dépôt :
   ```bash
   git clone <url-du-repo>
   cd api-mongoose
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

## Configuration

1. Créez un fichier `.env` à la racine du projet et configurez l'URI MongoDB :
   ```
   MONGO_URI=mongodb://localhost:27017/api-mongoose
   PORT=3000
   ```

2. Assurez-vous que MongoDB est en cours d'exécution. Vous pouvez utiliser Docker pour cela :
   ```yaml
   version: '3.8'
   services:
     mongo:
       image: mongo:latest
       container_name: mongo_container
       ports:
         - "27017:27017"
       volumes:
         - mongo_data:/data/db
       environment:
         MONGO_INITDB_ROOT_USERNAME: root
         MONGO_INITDB_ROOT_PASSWORD: example
   volumes:
     mongo_data:
   ```

   Lancez MongoDB avec :
   ```bash
   docker-compose up -d
   ```

## Compilation

Compilez le code TypeScript en JavaScript :
```bash
npm run build
```

## Lancement de l'API

### Avec le port par défaut (3000)

```bash
npm start
```

### Avec un port personnalisé

```bash
PORT=8080 npm start
```

## Utilisation

### Exemple de requêtes

- **Créer un profil** :
  ```bash
  curl -X POST http://localhost:3000/profiles \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john.doe@example.com"}'
  ```

- **Récupérer tous les profils** :
  ```bash
  curl http://localhost:3000/profiles
  ```

- **Ajouter une compétence** :
  ```bash
  curl -X POST http://localhost:3000/profiles/:id/skills \
  -H "Content-Type: application/json" \
  -d '"JavaScript"'
  ```

## Développement

Pour compiler et exécuter l'application en une seule commande :
```bash
npm run dev
```

## Structure du projet

```
api-mongoose/
├── src/
│   ├── config/          # Configuration (MongoDB, etc.)
│   ├── api/
│   │   └── profiles/    # Routes, contrôleurs et modèles pour les profils
│   ├── routes.ts        # Centralisation des routes
│   └── server.ts        # Point d'entrée du serveur
├── dist/                # Code JavaScript compilé
├── package.json         # Configuration du projet
├── tsconfig.json        # Configuration TypeScript
└── docker-compose.yml   # Configuration Docker
```

## Ressources

- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Postman](https://www.postman.com/)

## Auteurs

- **Votre Nom** - Développeur principal

---

Si vous avez des questions ou des problèmes, n'hésitez pas à ouvrir une issue dans le dépôt GitHub.