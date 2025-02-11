<script setup lang="ts">
import { getDatabase, ref as dbRef, push, set } from 'firebase/database';
import { ref } from 'vue';

const database = getDatabase();

const contactInfoRef = dbRef(database, 'formulaire');

const name = ref('');
const email = ref('');
const message = ref('');
const checkbox = ref(false);
const messageConf = ref('');
const errorMessage = ref('');

const saveContactInfo = () => {
    const newContactInfo = push(contactInfoRef); 
    set(newContactInfo, {
        name: name.value,
        email: email.value,
        message: message.value,
    });
};

const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const submitForm = () => {
    if (!checkbox.value) {
        errorMessage.value = 'Vous devez accepter le traitement des données.';
        return;
    }
    if (!validateEmail(email.value)) {
        errorMessage.value = 'Veuillez entrer une adresse email valide.';
        return;
    }
    errorMessage.value = '';
    saveContactInfo();
    name.value = '';
    email.value = '';
    message.value = '';
    checkbox.value = false;
    messageConf.value = 'Votre message a été envoyé !';
    setTimeout(() => {
        messageConf.value = '';
    }, 5000);
};
</script>

<template>
    <main class="mb-20 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 class="mb-4 text-center">Contactez-nous</h1>
        <form class="space-y-4" @submit.prevent="submitForm">
            <input v-model="name" type="text" placeholder="Nom" required class="w-full p-2 border border-gray-300 rounded">
            <input v-model="email" type="email" placeholder="Email" required class="w-full p-2 border border-gray-300 rounded">
            <textarea v-model="message" placeholder="Message" required class="w-full p-2 border border-gray-300 rounded"></textarea>
            <div class="flex items-center">
                <input v-model="checkbox" type="checkbox" id="dataConsent" required class="mr-2">
                <label for="dataConsent">J'accepte le traitement des données</label>
            </div>
            <RoundedButton label="Envoyer" bg-color="bg-primary" class="hover:bg-blue-800" @click="submitForm" />
        </form>
        <p v-if="messageConf" class="mt-4 text-green-500">{{ messageConf }}</p>
        <p v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</p>
    </main>
</template>