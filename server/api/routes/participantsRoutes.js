import { Router } from 'express';
import db from '../db/database.js';

const router = Router();

// Route pour récupérer les participants
router.get('/get-participants', (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Code manquant' });
  }

  db.all('SELECT pseudo FROM participants WHERE session_code = ?', [code], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des participants' });
    }
    return res.json({ participants: rows.map(row => row.pseudo) });
  });
});

// Route pour ajouter un participant
router.post('/set-pseudo', (req, res) => {
  const { pseudo, code } = req.body;

  if (!pseudo || !code) {
    return res.status(400).json({ success: false, error: 'Pseudo ou code de session manquant.' });
  }

  db.run('INSERT INTO participants (session_code, pseudo) VALUES (?, ?)', [code, pseudo], function (err) {
    if (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ success: false, error: 'Erreur lors de l\'enregistrement du pseudo' });
    }
    return res.json({ success: true });
  });
});

export default router;