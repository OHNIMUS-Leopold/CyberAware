<script setup lang="ts">
const menuToggle = ref();
const mobileMenu = ref();

onMounted(() => {
    menuToggle.value = document.getElementById('menu-toggle');
    mobileMenu.value = document.getElementById('mobile-menu');
    menuToggle.value.addEventListener('click', () => {
        mobileMenu.value.classList.toggle('hidden');
        mobileMenu.value.classList.toggle('translate-y-0');
        mobileMenu.value.classList.toggle('opacity-100');
    });
});
</script>


<template>
    <header class="bg-white text-black border-b-2 border-blue-600 shadow-md fixed top-0 left-0 w-full z-10">
        <div class="container mx-auto flex items-center justify-between p-4 2xl:px-8 ">
            <!-- Logo + Nom -->
            <NuxtLink to="/" class="flex items-center">
                <span class="hover:text-blue-600 text-2xl font-bold tracking-wide">CyberAware</span>
            </NuxtLink>

            <!-- Navigation (Desktop) -->
            <nav class="hidden md:flex space-x-6">
                <NuxtLink to="/" class="hover:text-blue-600">Accueil</NuxtLink>
                <NuxtLink to="/" class="hover:text-blue-600">S'informer</NuxtLink>
                <NuxtLink to="/" class="hover:text-blue-600">Outils</NuxtLink>
                <NuxtLink to="/" class="hover:text-blue-600">Signaler</NuxtLink>
            </nav>

            <!-- Bouton Mobile -->
            <button id="menu-toggle" class="md:hidden focus:outline-none">
                <svg id="menu-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" class="w-10 h-10 text-black">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
        </div>
        
        <!-- Navigation Mobile -->
        <nav id="mobile-menu"
            class="hidden md:hidden flex-col bg-white border-b-2 border-t-2 border-t-gray-200 border-blue-600 text-black p-6 space-y-4 absolute inset-x-0 top-[4.5rem] shadow-lg rounded-b-lg ">
            <NuxtLink to="/" class="block py-2 px-4 hover:text-blue-600">Accueil</NuxtLink>
            <hr class="text-gray-200">
            <NuxtLink to="/" class="block py-2 px-4 hover:text-blue-600 ">S'informer</NuxtLink>
            <hr class="text-gray-200">
            <NuxtLink to="/" class="block py-2 px-4 hover:text-blue-600 ">Outils</NuxtLink>
            <hr class="text-gray-200">
            <NuxtLink to="/" class="block py-2 px-4 hover:text-blue-600 ">Signaler</NuxtLink>
        </nav>
    </header>
</template>