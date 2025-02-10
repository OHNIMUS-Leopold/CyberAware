<template>
  <div>
    <div v-if="isClientReady">
      <h1>Salle d'attente</h1>
      <p>Code de la session : <strong>{{ sessionCode }}</strong></p>
      <div v-if="isModerator">
        <h2>Vous êtes le modérateur</h2>
        <ul>
          <li v-for="(participant, index) in participants" :key="index">{{ participant }}</li>
        </ul>
        <button class="bg-red-500 text-white px-4 py-2 rounded" @click="closeSession">Clore la session</button>
        <h2>Liste des quizz</h2>
        <ul class="list-disc ml-5">
          <li v-for="(quiz, index) in quizzes" :key="index">
            <h3>{{ quiz.title }}</h3>
            <p>{{ quiz.description }}</p>
            <ul class="list-disc ml-5">
              <li v-for="(question, qIndex) in quiz.questions" :key="qIndex">
                <p>{{ question.text }}</p>
                <ul class="list-disc ml-5">
                  <li v-for="(option, oIndex) in question.options" :key="oIndex">{{ option }}</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div v-else>
        <h2>Vous êtes un participant</h2>
        <div v-if="!pseudoChosen">
          <label for="pseudo">Choisissez un pseudo :</label>
          <input
            id="pseudo"
            v-model="pseudo"
            type="text"
            placeholder="Votre pseudo"
            class="border p-2 rounded"
          >
          <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="setPseudo">Rejoindre</button>
        </div>
        <ul v-else>
          <li v-for="(participant, index) in participants" :key="index">{{ participant }}</li>
        </ul>
      </div>
    </div>
    <div v-if="!isClientReady">
      <p>Chargement de la salle</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const isClientReady = ref(false);

const route = useRoute();
const router = useRouter();

const sessionCode = ref(route.params.code);
const isModerator = ref(false);
const pseudo = ref('');
const pseudoChosen = ref(false);
const participants = ref<string[]>([]);
const isSessionClosed = ref(false);
const quizzes = ref<any[]>([]);
const { public: { apiBaseUrl } } = useRuntimeConfig();

// Vérifier si localStorage est disponible et récupérer les valeurs
if (typeof window !== 'undefined') {
  isModerator.value = localStorage.getItem('role') === 'moderator';
  pseudo.value = localStorage.getItem('pseudo') || '';
  pseudoChosen.value = !!localStorage.getItem('pseudo');
}

// Charger les participants en temps réel
const fetchParticipants = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/participants/get-participants?code=${sessionCode.value}`);
    const data = await response.json();
    participants.value = data.participants || [];
  } catch (error) {
    console.error('Erreur lors du chargement des participants:', error);
  }
};

// Charger les quizz et leurs questions
const fetchQuizzes = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/quizzes/get-quizzes-with-questions`);
    const data = await response.json();
    quizzes.value = data.quizzes || [];
  } catch (error) {
    console.error('Erreur lors du chargement des quizz:', error);
  }
};

// Actualisation des participants et des quizz
onMounted(() => {
  fetchParticipants();
  fetchQuizzes();
  const interval = setInterval(fetchParticipants, 5000);
  isClientReady.value = true;
  return () => clearInterval(interval);
});

// Fonction pour rejoindre une session
const setPseudo = async () => {
  if (!pseudo.value) {
    alert('Veuillez entrer un pseudo.');
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/participants/set-pseudo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pseudo: pseudo.value, code: sessionCode.value }),
    });

    const data = await response.json();
    if (data.success) {
      pseudoChosen.value = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('pseudo', pseudo.value); // Stocker le pseudo dans le localStorage
      }
      fetchParticipants(); // Recharger la liste des participants
    } else {
      alert(data.error || 'Erreur lors de l\'enregistrement du pseudo.');
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du pseudo :', error);
    alert('Une erreur est survenue.');
  }
};

// Fonction pour fermer la session
const closeSession = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/session/close-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: sessionCode.value }),
    });

    const data = await response.json();
    if (data.success) {
      // alert('Session fermée avec succès.');
      checkSessionStatus();
      // router.push('/');
    } else {
      alert(data.error || 'Erreur lors de la fermeture de la session.');
    }
  } catch (error) {
    console.error('Erreur lors de la fermeture de la session:', error);
    alert('Une erreur est survenue.');
  }
};

// Fonction pour vérifier si la session est fermée
const checkSessionStatus = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/session/check-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: sessionCode.value }),
    });

    const data = await response.json();
    if (!data.success && !isSessionClosed.value) {
      isSessionClosed.value = true;
      alert('Session fermée par le modérateur. Vous allez être redirigé vers l\'accueil.');
      router.push('/');
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'état de la session:', error);
  }
};

// Polling pour vérifier l'état de la session
let pollingInterval: NodeJS.Timeout | null = null;
onMounted(() => {
  pollingInterval = setInterval(checkSessionStatus, 5000);
});

onBeforeUnmount(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});
</script>