// server/api/participants/set-pseudo.ts
import db from '../../db/database';

export default defineEventHandler(async (event) => {
  const { pseudo, code } = await readBody(event);

  if (!pseudo || !code) {
    return createError({ statusCode: 400, statusMessage: 'Pseudo ou code de session manquant.' });
  }

  return new Promise((resolve, reject) => {
    db.run('INSERT INTO participants (session_code, pseudo) VALUES (?, ?)', [code, pseudo], function (err) {
      if (err) {
        console.error('Erreur SQL:', err);
        reject(createError({ statusCode: 500, statusMessage: 'Erreur lors de l\'enregistrement du pseudo' }));
      } else {
        resolve({ success: true });
      }
    });
  });
});