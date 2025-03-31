import { Router } from 'express';
import profileRoutes from './api/profiles';

const router = Router();

router.use('/profiles', profileRoutes);

// Route de ping (comme dans le projet original)
router.get('/ping', (req, res) => {
  res.status(200).json(req.headers);
});

// Gestion de route par défaut
router.all('*', (req, res) => {
  res.status(404).end();
});

export default router;