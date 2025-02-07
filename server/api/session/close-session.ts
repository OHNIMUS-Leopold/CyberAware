// server/api/session/close-session.ts
import db from '../../db/database';

export default defineEventHandler(async (event) => {
  const { code } = await readBody(event);

  if (!code) {
    return createError({ statusCode: 400, statusMessage: 'Code de session manquant.' });
  }

  return new Promise((resolve, reject) => {
    db.run('UPDATE sessions SET status = ? WHERE code = ?', ['closed', code], (err) => {
      if (err) {
        console.error('Erreur lors de la fermeture de la session:', err);
        reject(createError({ statusCode: 500, statusMessage: 'Erreur lors de la fermeture de la session.' }));
      } else {
        db.run('DELETE FROM participants WHERE session_code = ?', [code], (err) => {
          if (err) {
            console.error('Erreur lors de la suppression des participants:', err);
            reject(createError({ statusCode: 500, statusMessage: 'Erreur lors de la suppression des participants.' }));
          } else {
            db.run('DELETE FROM sessions WHERE code = ?', [code], (err) => {
              if (err) {
                console.error('Erreur lors de la suppression de la session:', err);
                reject(createError({ statusCode: 500, statusMessage: 'Erreur lors de la suppression de la session.' }));
              } else {
                resolve({ success: true });
              }
            });
          }
        });
      }
    });
  });
});