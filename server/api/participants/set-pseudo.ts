import { db } from '../../utils/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default defineEventHandler(async (event) => {
  const { pseudo, code } = await readBody(event);

  if (!pseudo || !code) {
    return createError({ statusCode: 400, statusMessage: 'Pseudo ou code de session manquant.' });
  }

  try {
    const participantsRef = collection(db, 'participants');
    await addDoc(participantsRef, { session_code: code, pseudo });
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du pseudo:', error);
    return createError({ statusCode: 500, statusMessage: 'Erreur interne du serveur.' });
  }
});