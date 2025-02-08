import { db } from '../../utils/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default defineEventHandler(async (event) => {
  const { code } = await readBody(event);

  if (!code) {
    return createError({ statusCode: 400, statusMessage: 'Code de session manquant.' });
  }

  try {
    const sessionsRef = collection(db, 'sessions');
    await addDoc(sessionsRef, { code, status: 'open', created_at: new Date() });
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la création de la session:', error);
    return createError({ statusCode: 500, statusMessage: 'Erreur interne du serveur.' });
  }
});