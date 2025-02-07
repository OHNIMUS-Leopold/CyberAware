// server/api/participants/get-participants.ts
import db from '../../db/database';

// Définir un type pour les lignes retournées par la base de données
interface ParticipantRow {
  pseudo: string;
}

export default defineEventHandler(async (event) => {
  const { code } = getQuery(event);

  if (!code) {
    return createError({ statusCode: 400, statusMessage: 'Code manquant' });
  }

  return new Promise((resolve, reject) => {
    db.all<ParticipantRow>(
      'SELECT pseudo FROM participants WHERE session_code = ?',
      [code],
      (err, rows) => {
        if (err) {
          reject(createError({ statusCode: 500, statusMessage: 'Erreur lors de la récupération des participants' }));
        } else {
          resolve({ participants: rows.map(row => row.pseudo) });
        }
      }
    );
  });
});