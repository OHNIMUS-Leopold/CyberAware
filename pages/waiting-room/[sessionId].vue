<template>
  <div class="py-20">
    <h1>Salle d'attente</h1>
    <p>Code de session: {{ sessionId }}</p>
    <p>Modérateur: {{ moderatorName }}</p>
    <h2>Participants :</h2>
    <ul>
      <li v-for="participant in participants" :key="participant.uid">
        {{ participant.pseudo }}
      </li>
    </ul>
    <div v-if="isModerator">
      <button @click="deleteSession">Supprimer la session</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { doc, onSnapshot, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { AuthUser, FirestoreUser } from '~/types/firebase';

const auth = getAuth();
const { $firebase: { db } } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const sessionId = route.params.sessionId as string;

const participants = ref<Array<{ uid: string; pseudo: string }>>([]);
const moderatorName = ref('');
const isModerator = ref(false);
let unsubscribeSession: () => void;

const setupSessionListener = () => {
  const sessionRef = doc(db, 'sessions', sessionId);
  
  return onSnapshot(sessionRef, async (sessionDoc) => {
    // Si la session est supprimée
    if (!sessionDoc.exists()) {
      alert('Le modérateur a supprimé la session');
      router.push('/');
      return;
    }

    // Mise à jour normale
    const session = sessionDoc.data();

    // Vérifier si l'utilisateur est modérateur
    const currentUser = auth.currentUser as AuthUser;
    isModerator.value = currentUser?.uid === session.moderatorId;

    // Récupérer le pseudo du modérateur
    const moderatorRef = doc(db, 'users', session.moderatorId);
    const moderatorSnap = await getDoc(moderatorRef);
    moderatorName.value = (moderatorSnap.data() as FirestoreUser)?.pseudo || 'Modérateur';

    // Récupérer les pseudos des participants
    const participantsPromises = session.participants.map(async (participantId: string) => {
      const userSnap = await getDoc(doc(db, 'users', participantId));
      return userSnap.exists()
        ? { uid: participantId, pseudo: (userSnap.data() as FirestoreUser).pseudo }
        : null;
    });

    participants.value = (await Promise.all(participantsPromises))
      .filter((p): p is { uid: string; pseudo: string } => p !== null);
  });
};

onMounted(() => {
  unsubscribeSession = setupSessionListener();
});

onUnmounted(() => {
  if (unsubscribeSession) unsubscribeSession();
});

const deleteSession = async () => {
  if (confirm('Supprimer définitivement la session pour tous les participants ?')) {
    try {
      const sessionRef = doc(db, 'sessions', sessionId);
      await deleteDoc(sessionRef);
    } catch (error) {
      alert('Erreur suppression : ' + 
        (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  }
};

</script>