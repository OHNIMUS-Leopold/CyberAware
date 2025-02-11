<template>
    <footer class="bg-black text-white py-6 w-full absolute transform -translate-x-1/2 left-1/2">
        <div class="mx-auto px-4 md:px-8">

            <nav class="flex flex-wrap justify-center gap-6 text-white">
                <RouterLink to="/" class="hover:text-primary">Accueil</RouterLink>
                <RouterLink to="/" class="hover:text-primary">S'informer</RouterLink>
                <RouterLink to="/" class="hover:text-primary">Outils</RouterLink>
                <RouterLink to="/" class="hover:text-primary">Signaler</RouterLink>
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