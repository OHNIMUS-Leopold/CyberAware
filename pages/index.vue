<script setup lang="ts">
interface Question {
    question: string;
    options: string[];
    correctAnswers: string[];
}

const currentQuestion = ref(0);
const selectedOptions = ref<string[]>([]);
const score = ref(0);
const showFeedback = ref(false);

const questions: Question[] = [
    {
        question: "Qu'est-ce qu'un pare-feu ?",
        options: [
            "Un type de logiciel malveillant",
            "Un dispositif de sécurité réseau",
            "Un protocole de communication",
            "Un type de virus",
            "Un outil de développement"
        ],
        correctAnswers: ["Un dispositif de sécurité réseau"]
    },
    {
        question: "Quelles sont les méthodes courantes de phishing ?",
        options: [
            "Emails frauduleux",
            "Sites web falsifiés",
            "Appels téléphoniques",
            "Messages texte",
            "Logiciels antivirus"
        ],
        correctAnswers: ["Emails frauduleux", "Sites web falsifiés", "Appels téléphoniques", "Messages texte"]
    },
    {
        question: "Qu'est-ce qu'un ransomware ?",
        options: [
            "Un logiciel qui demande une rançon",
            "Un type de pare-feu",
            "Un outil de cryptage",
            "Un protocole de sécurité",
            "Un logiciel antivirus"
        ],
        correctAnswers: ["Un logiciel qui demande une rançon"]
    },
    {
        question: "Quelles sont les mesures pour prévenir une attaque DDoS ?",
        options: [
            "Utiliser un pare-feu",
            "Mettre en place un système de détection d'intrusion",
            "Utiliser un VPN",
            "Avoir une sauvegarde régulière des données",
            "Limiter le trafic réseau"
        ],
        correctAnswers: ["Utiliser un pare-feu", "Mettre en place un système de détection d'intrusion", "Limiter le trafic réseau"]
    },
    {
        question: "Qu'est-ce qu'un VPN ?",
        options: [
            "Un réseau privé virtuel",
            "Un type de pare-feu",
            "Un outil de cryptage",
            "Un protocole de sécurité",
            "Un logiciel antivirus"
        ],
        correctAnswers: ["Un réseau privé virtuel"]
    }
];

const submitAnswer = () => {
    const correctAnswers = questions[currentQuestion.value].correctAnswers;
    if (selectedOptions.value.every(option => correctAnswers.includes(option)) && selectedOptions.value.length === correctAnswers.length) {
        score.value++;
    }
    showFeedback.value = true;
    setTimeout(() => {
        showFeedback.value = false;
        selectedOptions.value = [];
        currentQuestion.value++;
    }, 2000);
};

const resetQuiz = () => {
    currentQuestion.value = 0;
    selectedOptions.value = [];
    score.value = 0;
    showFeedback.value = false;
};

const getOptionClass = (option: string) => {
    if (!showFeedback.value) return '';
    const correctAnswers = questions[currentQuestion.value].correctAnswers;
    if (correctAnswers.includes(option)) {
        return 'correct';
    } else if (selectedOptions.value.includes(option)) {
        return 'incorrect';
    }
    return '';
};
</script>


<template>
    <main>
        <h1 class="text-center">Se former à la cybersécurité</h1>
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10 gap-4 mb-20" >
            <div class="md:col-span-1 lg:col-span-2">
                <h2 class="mb-4">Qu'est-ce que la cybersécurité ?</h2>
                <p>
                    La cybersécurité est la pratique de protéger les systèmes, les réseaux et les programmes contre les attaques numériques. Ces attaques visent généralement à accéder, modifier ou détruire des informations sensibles, extorquer de l'argent aux utilisateurs ou interrompre les processus commerciaux normaux.
                    <br><br>
                    Testez vos connaissances en cybersécurité en répondant à notre quiz interactif. Chaque question vous aidera à mieux comprendre les concepts clés et à renforcer vos compétences pour protéger vos informations en ligne.
                </p>
                <JoinQuiz />
            </div>
            <div class="text-center bg-gray-100 p-4 rounded-lg border border-gray-300 w-full md:w-11/12 lg:w-11/12 px-4 py-8 place-self-center">
                <h2 class="mb-8">Quiz interactif</h2>
                <div v-if="currentQuestion < questions.length">
                    <h3 class="mb-4">{{ questions[currentQuestion].question }}</h3>
                    <div v-for="(option, index) in questions[currentQuestion].options" :key="index" class="mb-1 space-x-2 flex items-center w-fit mx-auto p-2 rounded-lg" :class="getOptionClass(option)">
                        <input :id="'option' + index" v-model="selectedOptions" class="cursor-pointer" type="checkbox" :value="option" :disabled="showFeedback">
                        <label class="cursor-pointer" :for="'option' + index">{{ option }}</label>
                    </div>
                    <RoundedButton label="Soumettre" bg-color="bg-primary" class="hover:bg-blue-800 px-4" style="width: fit-content;" :disabled="showFeedback" @click="submitAnswer" />
                </div>
                
                <div v-else>
                    <h3>Votre score : {{ score }}/{{ questions.length }}</h3>
                    <RoundedButton label="Recommencer le quiz" bg-color="bg-green-500" class="hover:bg-green-600 px-4" style="width: fit-content;" @click="resetQuiz" />
                </div>
            </div>
        </section>
        <section class="mb-20">
            <div class="justify-center bg-white rounded-lg mt-10">
                <h2 class="text-center  mb-4">Testeur de mot de passe</h2>
                <p class="text-center mb-4">La sécurité de vos mots de passe est essentielle pour protéger vos informations personnelles et professionnelles. Utilisez notre testeur de mot de passe pour vérifier la robustesse de vos mots de passe et obtenir des conseils pour les renforcer.</p>
                <PasswordTester />
            </div>
        </section>
        <section class="mb-20">
            <div class="justify-center bg-white rounded-lg mt-10">
                <h2 class="text-center mb-4">Mémori sur la cybersécurité</h2>
                <p class="text-center mb-4">Ce mémori sur la cybersécurité est un excellent moyen de renforcer vos connaissances en matière de sécurité en ligne. Associez les cartes pour découvrir des conseils et des informations importantes sur la protection de vos données et la prévention des cyberattaques.</p>
                <MemoryCards />
            </div>
        </section>
    </main>
</template>


<style scoped>
.correct {
    background-color: #22c55e; 
    color: white;
}
.incorrect {
    background-color: #ef4444; 
    color: white;
}
</style>