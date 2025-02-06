import db from '../db/database';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { code } = body;

    if (!code) {
      return { success: false, error: 'Code de session manquant.' };
    }

    // Insérer une nouvelle session
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO sessions (code, status) VALUES (?, ?)',
        [code, 'open'],
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
    console.error('Erreur dans create-session:', error);
    return { success: false, error: 'Erreur interne du serveur.' };
  }
});