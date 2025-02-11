<script setup lang="ts">
const passwordInput = ref<HTMLInputElement | null>(null);
const progressBar = ref<HTMLDivElement | null>(null);
const feedback = ref<HTMLDivElement | null>(null);
const crackTime = ref<HTMLParagraphElement | null>(null);
const fact = ref<HTMLParagraphElement | null>(null);

const checkPassword = () => {
    if (!passwordInput.value) return;

    const password = passwordInput.value.value;
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    const levels = [
        { percent: "10%", color: "bg-red-500", time: "Quelques secondes", fact: "C'est le temps qu'il faut pour faire un clin d'œil." },
        { percent: "30%", color: "bg-orange-400", time: "Quelques heures", fact: "C'est le temps qu'il vous faut pour regarder un film." },
        { percent: "50%", color: "bg-yellow-400", time: "28 jours", fact: "C'est le temps qu'il vous faut pour parcourir 65 970 kilomètres en voiture." },
        { percent: "75%", color: "bg-blue-500", time: "5 ans", fact: "C'est le temps qu'il faut pour terminer des études universitaires." },
        { percent: "100%", color: "bg-green-500", time: "33 siècles", fact: "C'est le temps qu'il faut pour que la Tour Eiffel rouille complètement." }
    ];

    const level = levels[strength];

    if (progressBar.value) {
        progressBar.value.style.width = level.percent;
        progressBar.value.className = `h-2 rounded-full transition-all duration-500 ${level.color}`;
    }

    if (feedback.value) {
        if (strength >= 3) {
            feedback.value.classList.remove('hidden');
        } else {
            feedback.value.classList.add('hidden');
        }
    }

    if (crackTime.value) crackTime.value.textContent = level.time;
    if (fact.value) fact.value.textContent = level.fact;
};

const toggleVisibility = () => {
    if (!passwordInput.value) return;

    if (passwordInput.value.type === "password") {
        passwordInput.value.type = "text";
    } else {
        passwordInput.value.type = "password";
    }
};

onMounted(() => {
    if (passwordInput.value) {
        passwordInput.value.addEventListener('input', checkPassword);
    }
});
</script>

<template>
    <div>
        <label for="password" class="block mb-4">Testez votre mot de passe :</label>
        <div class="relative">
            <input
                ref="passwordInput"
                id="password"
                type="password"
                class="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Entrez votre mot de passe..."
            />
            <div class="absolute top-1/2 right-4 transform -translate-y-1/2">
                <button @click="toggleVisibility" class="text-gray-500 focus:outline-none">
                    <svg
                        id="eye-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M1 12C3.2 7.6 7.6 4 12 4s8.8 3.6 11 8c-2.2 4.4-6.6 8-11 8s-8.8-3.6-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
            </div>
        </div>

        <div class="w-full h-2 bg-gray-200 rounded-full mt-4">
            <div
                ref="progressBar"
                id="progress-bar"
                class="h-2 bg-primary rounded-full transition-all duration-500"
                style="width: 0%;"
            ></div>
        </div>

        <div ref="feedback" id="feedback" class="mt-8 p-6 border border-primary rounded-lg bg-blue-50 hidden">
            <h2 class="flex items-center gap-2 text-primary">✅ Bon mot de passe!</h2>
            <ul class="list-disc pl-5 mt-2">
                <li>Votre mot de passe est résistant au piratage.</li>
                <li>Votre mot de passe n'apparaît dans aucune base de données ayant fait l'objet d'une fuite.</li>
            </ul>
        </div>

        <div class="mt-8 text-center">
            <p>Votre mot de passe peut être craqué avec un ordinateur de bureau standard en environ...</p>
            <p ref="crackTime" id="crack-time" class="mt-2 text-primary font-bold text-2xl">-</p>
            <p ref="fact" id="fact" class="mt-2">-</p>
        </div>
    </div>
</template>