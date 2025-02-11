<script setup lang="ts">
const checkPassword = () => {
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const progressBar = document.getElementById('progress-bar') as HTMLDivElement;
    const feedback = document.getElementById('feedback') as HTMLDivElement;
    const crackTime = document.getElementById('crack-time') as HTMLParagraphElement;
    const fact = document.getElementById('fact') as HTMLParagraphElement;

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

    progressBar.style.width = level.percent;
    progressBar.className = `h-2 rounded-full transition-all duration-500 ${level.color}`;

    if (strength >= 3) {
        feedback.classList.remove('hidden');
    } else {
        feedback.classList.add('hidden');
    }

    crackTime.textContent = level.time;
    fact.textContent = level.fact;
};

const toggleVisibility = () => {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
};

onMounted(() => {
    (document.getElementById('password') as HTMLInputElement).addEventListener('input', checkPassword);
    (document.querySelector('button[onclick="toggleVisibility()"]') as HTMLButtonElement).addEventListener('click', toggleVisibility);
});
</script>

<template>
    <div>
        <label for="password" class="block mb-4">Testez votre mot de passe :</label>
        <div class="relative">
            <input
                id="password"
                type="password"
                class="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                oninput="checkPassword()"
                placeholder="Entrez votre mot de passe..."
            />
            <div class="absolute top-1/2 right-4 transform -translate-y-1/2">
                <button onclick="toggleVisibility()" class="text-gray-500 focus:outline-none">
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
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="w-full h-2 bg-gray-200 rounded-full mt-4">
            <div
                id="progress-bar"
                class="h-2 bg-primary rounded-full transition-all duration-500"
                style="width: 0%;"
            ></div>
        </div>

        <div id="feedback" class="mt-8 p-6 border border-primary rounded-lg bg-blue-50 hidden">
            <h2 class="flex items-center gap-2 text-primary">✅ Bon mot de passe!</h2>
            <ul class="list-disc pl-5 mt-2">
                <li>Votre mot de passe est résistant au piratage.</li>
                <li>Votre mot de passe n'apparaît dans aucune base de données ayant fait l'objet d'une fuite.</li>
            </ul>
        </div>

        <div class="mt-8 text-center">
            <p>Votre mot de passe peut être craqué avec un ordinateur de bureau standard en environ...</p>
            <p id="crack-time" class="mt-2 text-primary">-</p>
            <p id="fact" class="mt-2">-</p>
        </div>
    </div>
</template>
