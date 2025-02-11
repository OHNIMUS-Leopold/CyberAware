<script setup lang="ts">
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const { $firebase } = useNuxtApp();
const auth = $firebase.auth;
const db = $firebase.db;

const userName = ref<string | null>(null);
const menuToggle = ref(false);

const toggleMenu = () => {
    menuToggle.value = !menuToggle.value;
};

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
    <header class="bg-white text-black border-b-2 border-primary shadow-md fixed top-0 left-0 w-full z-10">
        <div class="mx-auto flex items-center justify-between p-4 md:px-8 ">
            
            <div class="flex items-center space-x-2">
                <NuxtLink to="/" class="hover:text-primary text-2xl font-bold tracking-wide">
                    CyberAware
                </NuxtLink>
                <div v-if="userName">
                    <p class="hidden md:block">(connecté sur le compte {{ userName }})</p>
                    <p class="md:hidden">({{ userName }})</p>
                </div>
            </div>

            <nav class="hidden md:flex space-x-4 items-center">
                <NuxtLink to="/" class="hover:text-primary">Accueil</NuxtLink>
                <NuxtLink to="/" class="hover:text-primary">S'informer</NuxtLink>
                <NuxtLink to="/formation" class="hover:text-primary">Se former</NuxtLink>
                <NuxtLink to="/" class="hover:text-primary pr-4">Signaler</NuxtLink>
                <div class="contents">
                    <NuxtLink v-if="userName" to="/auth" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Se déconnecter</NuxtLink>
                    <NuxtLink v-else to="/auth" class="bg-primary text-white px-4 py-2 rounded hover:bg-blue-800">S'authentifier</NuxtLink>
                </div>
            </nav>

            <button class="md:hidden focus:outline-none transition-transform" @click="toggleMenu">
                <svg
v-if="!menuToggle" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" class="w-10 h-10 text-black transform transition-transform">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                <svg
v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" class="w-10 h-10 text-black transform transition-transform">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <nav
    :class="{'hidden': !menuToggle, 'flex': menuToggle, 'translate-y-0': menuToggle, 'opacity-100': menuToggle}"
            class="md:hidden flex-col bg-white border-b-2 border-t-2 border-t-gray-200 border-primary text-black p-6 space-y-4 absolute inset-x-0 top-[4.5rem] shadow-lg rounded-b-lg transition-all">
            <NuxtLink to="/" class="block py-2 px-4 hover:text-primary" @click="toggleMenu">Accueil</NuxtLink>
            <hr class="text-gray-200">
            <NuxtLink to="/" class="block py-2 px-4 hover:text-primary" @click="toggleMenu">S'informer</NuxtLink>
            <hr class="text-gray-200">
            <NuxtLink to="/formation" class="block py-2 px-4 hover:text-primary" @click="toggleMenu">Se former</NuxtLink>
            <hr class="text-gray-200">
            <NuxtLink to="/" class="block py-2 px-4 hover:text-primary" @click="toggleMenu">Signaler</NuxtLink>
            <hr class="text-gray-200">
            <div class="py-2">
            <NuxtLink v-if="userName" to="/auth" class="w-fit bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" @click="toggleMenu">Se déconnecter</NuxtLink>
            <NuxtLink v-else to="/auth" class="w-fit bg-primary text-white ml-4 px-4 py-2 rounded hover:bg-blue-800" @click="toggleMenu">S'authentifier</NuxtLink>
            </div>
        </nav>
    </header>
</template>