import db from '../db/database';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { code } = body;

  if (!code) {
    return { error: 'Code de session manquant.' };
  }

  try {
    // Mettre à jour le statut de la session à "closed"
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE sessions SET status = ? WHERE code = ?',
        ['closed', code],
        function (err) {
          if (err) {
            reject({ error: 'Erreur lors de la fermeture de la session.' });
          } else {
            resolve();
          }
        }
      );
    });

    // Supprimer tous les participants liés à la session fermée
    await new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM participants WHERE session_code = ?',
        [code],
        function (err) {
          if (err) {
            reject({ error: 'Erreur lors de la suppression des participants.' });
          } else {
            resolve();
          }
        }
      );
    });

    // Supprimer la session fermée
    await new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM sessions WHERE code = ?',
        [code],
        function (err) {
          if (err) {
            reject({ error: 'Erreur lors de la suppression de la session.' });
          } else {
            resolve();
          }
        }
      );
    });

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la fermeture de la session:', error);
    return { success: false, error: 'Erreur interne du serveur.' };
  }
});