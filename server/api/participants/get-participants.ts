import { db } from '../../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default defineEventHandler(async (event) => {
  const { code } = getQuery(event);

  if (!code) {
    return createError({ statusCode: 400, statusMessage: 'Code manquant' });
  }

  try {
    const participantsRef = collection(db, 'participants');
    const q = query(participantsRef, where('session_code', '==', code));
    const querySnapshot = await getDocs(q);

    const participants = querySnapshot.docs.map((doc) => doc.data().pseudo);
    return { participants };
  } catch (error) {
    console.error('Erreur lors de la récupération des participants:', error);
    return createError({ statusCode: 500, statusMessage: 'Erreur interne du serveur.' });
  }
});