<template>
  <div class="flex flex-col items-center justify-center min-h-screen space-y-4">
    <h1 class="text-3xl font-bold">Bienvenue !</h1>
    <div class="flex space-x-4">
      <button class="bg-green-500 text-white px-4 py-2 rounded" @click="createSession">
        Créer une session
      </button>

      <div>
        <label for="sessionCode" class="block mb-2">Code de session :</label>
        <input
          id="sessionCode"
          v-model="sessionCode"
          type="text"
          maxlength="6"
          placeholder="Code (ex: ZKA0XI)"
          class="border p-2 rounded mb-2"
        >
        <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="joinSession">
          Rejoindre
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const sessionCode = ref('');
const { public: { apiBaseUrl } } = useRuntimeConfig();

// Définir un type pour la réponse de l'API
interface ApiResponse {
  success: boolean;
  error?: string;
  participants?: string[];
}

// Fonction pour générer un code aléatoire
const generateCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Fonction pour créer une session
const createSession = async () => {
  const code = generateCode();
  try {
    const data = await $fetch<ApiResponse>(`${apiBaseUrl}/api/session/create-session`, {
      method: 'POST',
      body: { code },
    });

    if (data.success) {
      localStorage.setItem('role', 'moderator');
      localStorage.setItem('sessionCode', code);
      router.push(`/waiting-room/${code}`);
    } else {
      alert(data.error || 'Erreur lors de la création de la session.');
    }
  } catch (error) {
    console.error('Erreur lors de la création de la session :', error);
    alert('Une erreur est survenue.');
  }
};

// Fonction pour rejoindre une session
const joinSession = async () => {
  if (!sessionCode.value || sessionCode.value.length !== 6) {
    alert('Veuillez entrer un code valide à 6 caractères.');
    return;
  }

  try {
    const data = await $fetch<ApiResponse>(`${apiBaseUrl}/api/session/check-session`, {
      method: 'POST',
      body: { code: sessionCode.value },
    });

    if (data.success) {
      localStorage.setItem('role', 'participant');
      localStorage.setItem('sessionCode', sessionCode.value);
      router.push(`/waiting-room/${sessionCode.value}`);
    } else {
      alert(data.error || 'Session non trouvée ou fermée.');
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de la session :', error);
    alert('Une erreur est survenue.');
  }
};
</script>