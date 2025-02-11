<script setup lang="ts">
import { useFirebase } from '~/composables/useFirebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import type { AuthUser, UserData, QuizSession } from '~/types/firebase';

const router = useRouter();
const { $firebase: { db } } = useNuxtApp();
const { user } = useFirebase();
const sessionCode = ref('');
const isModerator = ref(false);

// Vérifier le statut modérateur
const checkModeratorStatus = async () => {
  try {
    const authUser = user.value as AuthUser;
    if (!authUser?.uid) return;
    
    const userDoc = await getDoc(doc(db, 'users', authUser.uid));
    const userData = userDoc.data() as UserData;
    isModerator.value = userData?.isMod === true;
    
  } catch (error) {
    console.error('Erreur vérification statut modérateur:', error);
    isModerator.value = false;
  }
};

// Vérifier au chargement et quand l'utilisateur change
onMounted(checkModeratorStatus);
watch(user, checkModeratorStatus);

// Création de session
const createSession = async () => {
  try {
    const authUser = user.value as AuthUser;
    
    if (!authUser?.uid) {
      alert('Connectez-vous pour créer une session');
      return;
    }

    const userDoc = await getDoc(doc(db, 'users', authUser.uid));
    const userData = userDoc.data() as UserData;

    if (!userData?.isMod) {
      alert('Seuls les modérateurs peuvent créer des sessions');
      return;
    }

    const sessionId = generateSessionId();
    const sessionData: QuizSession = {
      moderatorId: authUser.uid,
      participants: [],
      status: 'waiting',
      quizId: null,
      createdAt: new Date()
    };

    await setDoc(doc(db, 'sessions', sessionId), sessionData);
    router.push(`/waiting-room/${sessionId}`);

  } catch (error) {
    console.error('Erreur création session:', error);
    alert('Erreur technique');
  }
};

// Rejoindre une session
const joinSession = async () => {
  try {
    const authUser = user.value as AuthUser;
    
    if (!authUser?.uid) {
      alert('Connectez-vous pour rejoindre une session');
      return;
    }

    const sessionRef = doc(db, 'sessions', sessionCode.value);
    const sessionDoc = await getDoc(sessionRef);
    
    if (!sessionDoc.exists()) {
      alert('Session introuvable');
      return;
    }

    // const session = sessionDoc.data() as QuizSession;
    await updateDoc(sessionRef, {
      participants: arrayUnion(authUser.uid)
    });

    router.push(`/waiting-room/${sessionCode.value}`);

  } catch (error) {
    console.error('Erreur participation:', error);
    alert('Erreur technique');
  }
};

// Génération ID session
const generateSessionId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
</script>

<template>
  <div class="container mx-auto p-4">
    <div v-if="user" class="space-y-6">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <!-- Rejoindre une session -->
        <div class="bg-gray-50 p-6 rounded-lg">
          <h3 class="mb-4">Rejoindre une session de quiz existante</h3>
          <div class="flex flex-col md:flex-row gap-4">
            <input
              v-model="sessionCode"
              placeholder="Entrez le code de session"
              class="flex-1 p-2 border rounded"
            >
            <RoundedButton
              :label="'Rejoindre'"
              :bg-color="'bg-green-500'"
              class="hover:bg-green-600"
              @click="joinSession"
            />
          </div>
        </div>

        <!-- Création de session (visible uniquement pour les modérateurs) -->
        <div v-if="isModerator" class="text-center mt-6">
          <RoundedButton
            :label="'Créer une nouvelle session'"
            :bg-color="'bg-primary'"
            class="hover:bg-blue-800"
            @click="createSession"
          />
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <h3 class="mb-6">Veuillez vous connecter pour continuer</h3>
      <NuxtLink 
        to="/auth"
        class="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition-colors"
      >
        Se connecter
      </NuxtLink>
    </div>
  </div>
</template>