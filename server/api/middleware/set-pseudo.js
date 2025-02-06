import db from '../db/database';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { pseudo, code } = body;

    if (!pseudo || !code) {
      return { success: false, error: 'Pseudo ou code de session manquant.' };
    }

    // Ajouter le participant à la base de données
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO participants (session_code, pseudo) VALUES (?, ?)',
        [code, pseudo],
        (err) => {
          if (err) {
            console.error('Erreur SQL:', err);
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });

    return { success: true };
  } catch (error) {
    console.error('Erreur dans set-pseudo:', error);
    return { success: false, error: 'Erreur interne du serveur.' };
  }
});