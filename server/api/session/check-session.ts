// server/api/session/check-session.ts
import db from '../../db/database';

export default defineEventHandler(async (event) => {
  const { code } = await readBody(event);

  if (!code) {
    return createError({ statusCode: 400, statusMessage: 'Code de session manquant.' });
  }

  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM sessions WHERE code = ? AND status = "open"', [code], (err, row) => {
      if (err) {
        console.error('Erreur dans check-session:', err);
        reject(createError({ statusCode: 500, statusMessage: 'Erreur interne du serveur.' }));
      } else if (row) {
        resolve({ success: true });
      } else {
        resolve({ success: false, error: 'Session non trouvée ou fermée.' });
      }
    });
  });
});