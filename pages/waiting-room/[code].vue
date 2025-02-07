<template>
  <div>
    <h1>Salle d'attente</h1>
    <p>Code de la session : <strong>{{ sessionCode }}</strong></p>

    <div v-if="isModerator">
      <h2>Vous êtes le modérateur</h2>
      <ul>
        <li v-for="(pseudo, index) in participants" :key="index">{{ pseudo }}</li>
      </ul>
      <button class="bg-red-500 text-white px-4 py-2 rounded" @click="closeSession">Clore la session</button>
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
        <li v-for="(pseudo, index) in participants" :key="index">{{ pseudo }}</li>
      </ul>
    </div>
  </div>
</template>


<script setup lang="ts">

const route = useRoute();
const router = useRouter();

const sessionCode = ref(route.params.code);
const isModerator = ref(localStorage.getItem('role') === 'moderator');
const pseudo = ref('');
const pseudoChosen = ref(false);
const participants = ref([]);
const isSessionClosed = ref(false);


// Charger les participants en temps réel
const fetchParticipants = async () => {
  try {
    const response = await fetch(`http://localhost:4000/participants/get-participants?code=${sessionCode.value}`);
    const data = await response.json();
    participants.value = data.participants || [];
  } catch (error) {
    console.error('Erreur lors du chargement des participants:', error);
  }
};

// Actualisation 
onMounted(() => {
  fetchParticipants();
  const interval = setInterval(fetchParticipants, 5000);
  return () => clearInterval(interval);
});

// Fonction pour rejoindre une session
const setPseudo = async () => {
  if (!pseudo.value) {
    alert('Veuillez entrer un pseudo.');
    return;
  }

  try {
    pseudoChosen.value = true;
    // Vérification et enregistrement du pseudo
    const response = await fetch('http://localhost:4000/participants/set-pseudo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pseudo: pseudo.value, code: router.currentRoute.value.params.code }),
    });

    const data = await response.json();
    
    if (data.success) {
      router.push(`/waiting-room/${router.currentRoute.value.params.code}`);
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
    const response = await fetch('http://localhost:4000/session/close-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: sessionCode.value }),
    });

    const data = await response.json();

    if (data.success) {
      // alert('Session fermée avec succès.');
      checkSessionStatus();
      window.location.href = '/';
    } else {
      alert(data.error || 'Erreur lors de la fermeture de la session.');
    }
  } catch (error) {
    console.error('Erreur lors de la fermeture de la session:', error);
    alert('Une erreur est survenue.');
  }
};

// Fonction pour vérifier si la session est fermée et informer tous les participants
const checkSessionStatus = async () => {
  try {
    const response = await fetch('http://localhost:4000/session/check-session', {
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
    alert('Une erreur est survenue.');
  }
};

// Fonction de polling pour vérifier l'état de la session
let pollingInterval: any = null;
const startPolling = () => {
  pollingInterval = setInterval(checkSessionStatus, 5000); // Vérifier toutes les 5 secondes
};

// Arrêter le polling lorsqu'on quitte la page
onBeforeUnmount(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});

// Lancer le polling lors du montage de la page
onMounted(() => {
  startPolling();
});

</script>
