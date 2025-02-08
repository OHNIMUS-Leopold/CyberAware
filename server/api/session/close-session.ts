import { db } from '../../utils/firebase';
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default defineEventHandler(async (event) => {
  const { code } = await readBody(event);

  if (!code) {
    return createError({ statusCode: 400, statusMessage: 'Code de session manquant.' });
  }

  try {
    const sessionsRef = collection(db, 'sessions');
    const q = query(sessionsRef, where('code', '==', code));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return createError({ statusCode: 404, statusMessage: 'Session non trouvée.' });
    }

    const sessionDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, 'sessions', sessionDoc.id), { status: 'closed' });

    const participantsRef = collection(db, 'participants');
    const participantsQuery = query(participantsRef, where('session_code', '==', code));
    const participantsSnapshot = await getDocs(participantsQuery);

    participantsSnapshot.forEach(async (participantDoc) => {
      await deleteDoc(doc(db, 'participants', participantDoc.id));
    });

    await deleteDoc(doc(db, 'sessions', sessionDoc.id));

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la fermeture de la session:', error);
    return createError({ statusCode: 500, statusMessage: 'Erreur interne du serveur.' });
  }
});