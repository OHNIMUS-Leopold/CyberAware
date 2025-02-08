import { db } from '../../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default defineEventHandler(async (event) => {
  const { code } = await readBody(event);

  if (!code) {
    return createError({ statusCode: 400, statusMessage: 'Code de session manquant.' });
  }

  try {
    const sessionsRef = collection(db, 'sessions');
    const q = query(sessionsRef, where('code', '==', code), where('status', '==', 'open'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: 'Session non trouvée ou fermée.' };
    } else {
      return { success: true };
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de la session:', error);
    return createError({ statusCode: 500, statusMessage: 'Erreur interne du serveur.' });
  }
});