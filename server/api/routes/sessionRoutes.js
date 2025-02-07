import { Router } from 'express';
import db from '../db/database';

const router = Router();

// Route pour vérifier si la session est ouverte
router.post('/check-session', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.json({ success: false, error: 'Code de session manquant.' });
    }

    // Vérifier si la session existe et est ouverte
    db.get(
      'SELECT * FROM sessions WHERE code = ? AND status = "open"',
      [code],
      (err, row) => {
        if (err) {
          console.error('Erreur dans check-session:', err);
          return res.json({ success: false, error: 'Erreur interne du serveur.' });
        }
        if (row) {
          return res.json({ success: true });
        } else {
          return res.json({ success: false, error: 'Session non trouvée ou fermée.' });
        }
      }
    );
  } catch (error) {
    console.error('Erreur dans check-session:', error);
    res.json({ success: false, error: 'Erreur interne du serveur.' });
  }
});

// Route pour fermer la session
router.post('/close-session', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.json({ error: 'Code de session manquant.' });
  }

  try {
    // Mettre à jour le statut de la session à "closed"
    db.run(
      'UPDATE sessions SET status = ? WHERE code = ?',
      ['closed', code],
      (err) => {
        if (err) {
          console.error('Erreur lors de la fermeture de la session:', err);
          return res.json({ error: 'Erreur lors de la fermeture de la session.' });
        }

        // Supprimer tous les participants liés à la session fermée
        db.run(
          'DELETE FROM participants WHERE session_code = ?',
          [code],
          (err) => {
            if (err) {
              console.error('Erreur lors de la suppression des participants:', err);
              return res.json({ error: 'Erreur lors de la suppression des participants.' });
            }

            // Supprimer la session fermée
            db.run(
              'DELETE FROM sessions WHERE code = ?',
              [code],
              (err) => {
                if (err) {
                  console.error('Erreur lors de la suppression de la session:', err);
                  return res.json({ error: 'Erreur lors de la suppression de la session.' });
                }
                res.json({ success: true });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error('Erreur lors de la fermeture de la session:', error);
    res.json({ success: false, error: 'Erreur interne du serveur.' });
  }
});

// Route pour créer une session
router.post('/create-session', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.json({ success: false, error: 'Code de session manquant.' });
  }

  try {
    // Insérer une nouvelle session
    db.run(
      'INSERT INTO sessions (code, status) VALUES (?, ?)',
      [code, 'open'],
      (err) => {
        if (err) {
          console.error('Erreur SQL dans create-session:', err);
          return res.json({ success: false, error: 'Erreur interne du serveur.' });
        }
        res.json({ success: true });
      }
    );
  } catch (error) {
    console.error('Erreur dans create-session:', error);
    res.json({ success: false, error: 'Erreur interne du serveur.' });
  }
});

export default router;