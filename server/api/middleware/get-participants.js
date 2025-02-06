import db from '../db/database';
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { code } = query;

  if (!code) {
    return { error: 'Code manquant' };
  }

  return new Promise((resolve, reject) => {
    db.all('SELECT pseudo FROM participants WHERE session_code = ?', [code], (err, rows) => {
      if (err) {
        reject({ error: 'Erreur lors de la récupération des participants' });
      } else {
        resolve({ participants: rows.map(row => row.pseudo) });
      }
    });
  });
});