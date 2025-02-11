<script setup lang="ts">
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const { $firebase } = useNuxtApp();
const auth = $firebase.auth;
const db = $firebase.db;

const userName = ref<string | null>(null);

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            userName.value = userDoc.data().pseudo;
        }
    } else {
        userName.value = null;
    }
});
</script>


<template>
    <footer class="bg-black text-white py-6 w-full absolute transform -translate-x-1/2 left-1/2">
        <div class="mx-auto px-4 md:px-8">

            <nav class="flex flex-wrap justify-center gap-6 text-white">
                <RouterLink to="/" class="hover:text-primary">Accueil</RouterLink>
                <RouterLink to="/info" class="hover:text-primary">S'informer</RouterLink>
                <RouterLink to="/warn" class="hover:text-primary">Signaler</RouterLink>
                <div class="contents">
                    <NuxtLink v-if="userName" to="/auth" class="hover:text-primary">Se déconnecter</NuxtLink>
                    <NuxtLink v-else to="/auth" class="hover:text-primary">S'authentifier</NuxtLink>
                </div>
            </nav>

            <div class="border-t border-gray-700 my-5"/>

            <div class="flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
                <p>&copy; 2025 CyberProtect. Tous droits réservés.</p>
                <div class="flex gap-6 mt-2 md:mt-0">
                    <p>Mentions légales</p>
                    <p>Politique de confidentialité</p>
                </div>
            </div>
        </div>
    </footer>
</template>