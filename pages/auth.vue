<script setup lang="ts">
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const user = ref({ email: '', password: '', pseudo: '', isMod: false });
const message = ref<string | null>(null);
const valeur = ref<number | null>(null);
const router = useRouter();
const authMode = ref('login');

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      message.value = "Utilisateur déjà connecté";
      console.log(currentUser);
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
  <div class="mt-28 mb-20 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h1 class="mb-4 text-center">Authentification</h1>
    <p class="mb-4 text-red-500 text-center">{{ message }}</p>
    <div v-if="valeur !== 1" class="mb-4 text-center">
      <label class="mr-4">
        <input type="radio" v-model="authMode" value="login" class="mr-2" /> Connexion
      </label>
      <label>
        <input type="radio" v-model="authMode" value="register" class="mr-2" /> Inscription
      </label>
    </div>
    <div v-if="valeur !== 1 && authMode === 'login'" class="mb-4">
      <h2 class="text-xl font-semibold mb-2">Connexion</h2>
      <form @submit.prevent="onCnx" class="space-y-4">
        <input v-model="user.email" type="email" placeholder="Email" required class="w-full p-2 border border-gray-300 rounded" />
        <input id="password" v-model="user.password" type="password" placeholder="Mot de passe" required class="w-full p-2 border border-gray-300 rounded" />
        <button type="button" @click="togglePasswordVisibility" class="text-primary hover:underline">Afficher/Masquer</button>
        <button type="submit" class="w-full bg-primary text-white p-2 rounded hover:bg-blue-800">Se connecter</button>
      </form>
    </div>
    <div v-if="valeur !== 1 && authMode === 'register'" class="mb-4">
      <h2 class="text-xl font-semibold mb-2">Inscription</h2>
      <form @submit.prevent="onInscr" class="space-y-4">
        <input v-model="user.email" type="email" placeholder="Email" required class="w-full p-2 border border-gray-300 rounded" />
        <input v-model="user.password" type="password" placeholder="Mot de passe" required class="w-full p-2 border border-gray-300 rounded" />
        <input v-model="user.pseudo" type="text" placeholder="Pseudo" required class="w-full p-2 border border-gray-300 rounded" />
        <label class="flex items-center">
          <input type="checkbox" v-model="user.isMod" class="mr-2" />
          Modérateur
        </label>
        <button type="submit" class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">S'inscrire</button>
      </form>
    </div>
    <button v-if="valeur === 1" @click="onDcnx" class="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">Se déconnecter</button>
  </div>
  
</template>
