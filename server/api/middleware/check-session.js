import db from '../db/database';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { code } = body;

    if (!code) {
      return { success: false, error: 'Code de session manquant.' };
    }

    // Vérifier si la session existe et est ouverte
    const session = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM sessions WHERE code = ? AND status = "open"',
        [code],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });

    if (session) {
      return { success: true };
    } else {
      return { success: false, error: 'Session non trouvée ou fermée.' };
    }
  } catch (error) {
    console.error('Erreur dans check-session:', error);
    return { success: false, error: 'Erreur interne du serveur.' };
  }
});