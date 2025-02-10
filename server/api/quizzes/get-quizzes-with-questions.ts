import { db } from '../../utils/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export default defineEventHandler(async (event) => {
  try {
    const quizzesRef = collection(db, 'quizzes');
    const quizzesSnapshot = await getDocs(quizzesRef);

    const quizzes = await Promise.all(quizzesSnapshot.docs.map(async (quizDoc) => {
      const quizData = quizDoc.data();
      const questions = await Promise.all(quizData.questions.map(async (questionId: string) => {
        const questionDoc = await getDoc(doc(db, 'questions', questionId));
        return questionDoc.data();
      }));
      return { ...quizData, questions };
    }));

    return { quizzes };
  } catch (error) {
    console.error('Erreur lors de la récupération des quizz et des questions:', error);
    return createError({ statusCode: 500, statusMessage: 'Erreur interne du serveur.' });
  }
});