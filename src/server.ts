// Fichier src/server.ts
import express from 'express';
import connectDB from './config/mongodb';
import routes from './routes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à MongoDB
connectDB();

// Utilisation des routes
app.use('/', routes);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});