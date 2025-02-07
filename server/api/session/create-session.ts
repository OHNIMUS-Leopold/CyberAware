// server/api/session/create-session.ts
import db from '../../db/database';

export default defineEventHandler(async (event) => {
  const { code } = await readBody(event);

  if (!code) {
    return createError({ statusCode: 400, statusMessage: 'Code de session manquant.' });
  }

  return new Promise((resolve, reject) => {
    db.run('INSERT INTO sessions (code, status) VALUES (?, ?)', [code, 'open'], (err) => {
      if (err) {
        console.error('Erreur SQL dans create-session:', err);
        reject(createError({ statusCode: 500, statusMessage: 'Erreur interne du serveur.' }));
      } else {
        resolve({ success: true });
      }
    });
  });
});