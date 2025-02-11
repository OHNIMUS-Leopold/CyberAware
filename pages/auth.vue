<script setup lang="ts">
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const { $firebase } = useNuxtApp();
const auth = $firebase.auth;
const db = $firebase.db;


const user = ref({ email: '', password: '', pseudo: '', isMod: false });
const message = ref<string | null>(null);
const valeur = ref<number | null>(null);
const router = useRouter();
const authMode = ref('login');

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      message.value = "Utilisateur déjà connecté";
      valeur.value = 1;
    } else {
      message.value = "Utilisateur non connecté";
      valeur.value = null;
    }
  });
});

function togglePasswordVisibility() {
  const passwordInput = document.getElementById('password') as HTMLInputElement | null;
  if (passwordInput) {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }
}

function onCnx() {
  if (user.value.email && user.value.password) {
    signInWithEmailAndPassword(auth, user.value.email, user.value.password)
      .then(response => {
        console.log('Utilisateur connecté', response.user);
        message.value = "Utilisateur connecté";
        valeur.value = 1;
        router.push('/');
      })
      .catch(error => {
        console.log('Erreur connexion', error);
        message.value = "Erreur d'authentification";
        valeur.value = null;
      });
  }
}

function onDcnx() {
  signOut(auth)
    .then(() => {
      user.value = { email: '', password: '', pseudo: '', isMod: false };
      console.log("Utilisateur déconnecté");
      message.value = "Utilisateur non connecté";
      valeur.value = null;
      router.push('/');
    })
    .catch(error => {
      console.log("Erreur déconnexion", error);
    });
}

function onInscr() {
  if (user.value.email && user.value.password && user.value.pseudo) {
    createUserWithEmailAndPassword(auth, user.value.email, user.value.password)
      .then(async (response) => {
        console.log('Utilisateur inscrit', response.user);
        message.value = "Utilisateur inscrit et connecté";
        valeur.value = 1;
        await setDoc(doc(db, 'users', response.user.uid), {
          pseudo: user.value.pseudo,
          isMod: user.value.isMod
        });
        router.push('/');
      })
      .catch(error => {
        console.log('Erreur inscription', error);
        message.value = "Erreur d'inscription";
        valeur.value = null;
      });
  } else {
    message.value = "Veuillez remplir tous les champs";
  }
}
</script>

<template>
  <main class="mb-20 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h1 class="mb-4 text-center">Authentification</h1>
    <p class="mb-4 text-red-500 text-center">{{ message }}</p>
    <div v-if="valeur !== 1" class="mb-4 text-center">
      <label class="mr-4">
        <input v-model="authMode" type="radio" value="login" class="mr-2" > Connexion
      </label>
      <label>
        <input v-model="authMode" type="radio" value="register" class="mr-2" > Inscription
      </label>
    </div>
    <div v-if="valeur !== 1 && authMode === 'login'" class="mb-4">
      <h2 class="mb-2">Connexion</h2>
      <form class="space-y-4" @submit.prevent="onCnx">
        <input v-model="user.email" type="email" placeholder="Email" required class="w-full p-2 border border-gray-300 rounded" >
        <input id="password" v-model="user.password" type="password" placeholder="Mot de passe" required class="w-full p-2 border border-gray-300 rounded" >
        <button type="button" class="text-primary hover:underline" @click="togglePasswordVisibility">Afficher/Masquer le mot de passe</button>
        <RoundedButton label="Se connecter" bg-color="bg-primary" class="hover:bg-blue-800" @click="onCnx" />
      </form>
    </div>
    <div v-if="valeur !== 1 && authMode === 'register'" class="mb-4">
      <h2 class="mb-2">Inscription</h2>
      <form class="space-y-4" @submit.prevent="onInscr">
        <input v-model="user.email" type="email" placeholder="Email" required class="w-full p-2 border border-gray-300 rounded" >
        <input id="password" v-model="user.password" type="password" placeholder="Mot de passe" required class="w-full p-2 border border-gray-300 rounded" >
        <button type="button" class="text-green-500 hover:underline" @click="togglePasswordVisibility">Afficher/Masquer le mot de passe</button>
        <input v-model="user.pseudo" type="text" placeholder="Pseudo" required class="w-full p-2 border border-gray-300 rounded" >
        <label class="flex items-center">
          <input v-model="user.isMod" type="checkbox" class="mr-2 bg-green-500" > Modérer les sessions
        </label>
        <RoundedButton label="S'inscrire" bg-color="bg-green-500" class="hover:bg-green-600" @click="onInscr" />
      </form>
    </div>
    <RoundedButton v-if="valeur === 1" label="Se déconnecter" bg-color="bg-red-500" class="hover:bg-red-600" @click="onDcnx" />
  </main>
</template>
