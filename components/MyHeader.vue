<script setup lang="ts">
const menuToggle = ref(false);

const toggleMenu = () => {
    menuToggle.value = !menuToggle.value;
};
</script>

<template>
    <header class="bg-white text-black border-b-2 border-primary shadow-md fixed top-0 left-0 w-full z-10">
        <div class="container mx-auto flex items-center justify-between p-4 2xl:px-8 ">
            <!-- Logo + Nom -->
            <NuxtLink to="/" class="flex items-center">
                <span class="hover:text-primary text-2xl font-bold tracking-wide">CyberAware</span>
            </NuxtLink>

            <!-- Navigation (Desktop) -->
            <nav class="hidden md:flex space-x-6">
                <NuxtLink to="/" class="hover:text-primary">Accueil</NuxtLink>
                <NuxtLink to="/" class="hover:text-primary">S'informer</NuxtLink>
                <NuxtLink to="/" class="hover:text-primary">Outils</NuxtLink>
                <NuxtLink to="/" class="hover:text-primary">Signaler</NuxtLink>
            </nav>

            <!-- Bouton Mobile -->
            <button @click="toggleMenu" class="md:hidden focus:outline-none transition-transform">
                <svg v-if="!menuToggle" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" class="w-10 h-10 text-black transform transition-transform">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" class="w-10 h-10 text-black transform transition-transform">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <!-- Navigation Mobile -->
        <nav :class="{'hidden': !menuToggle, 'flex': menuToggle, 'translate-y-0': menuToggle, 'opacity-100': menuToggle}"
            class="md:hidden flex-col bg-white border-b-2 border-t-2 border-t-gray-200 border-primary text-black p-6 space-y-4 absolute inset-x-0 top-[4.5rem] shadow-lg rounded-b-lg transition-all duration-300">
            <NuxtLink to="/" class="block py-2 px-4 hover:text-primary">Accueil</NuxtLink>
            <hr class="text-gray-200">
            <NuxtLink to="/" class="block py-2 px-4 hover:text-primary ">S'informer</NuxtLink>
            <hr class="text-gray-200">
            <NuxtLink to="/" class="block py-2 px-4 hover:text-primary ">Outils</NuxtLink>
            <hr class="text-gray-200">
            <NuxtLink to="/" class="block py-2 px-4 hover:text-primary ">Signaler</NuxtLink>
        </nav>
    </header>
</template>