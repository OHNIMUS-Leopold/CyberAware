<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Card {
  type: 'term' | 'definition';
  content: string;
}

const cardData = [
  { term: 'Authentification à deux facteurs (A2F)', definition: "Méthode de sécurité nécessitant deux formes d'identification." },
  { term: 'Phishing', definition: "Tentative d'escroquerie pour obtenir des informations sensibles." },
  { term: 'Malware', definition: "Logiciel malveillant conçu pour endommager un ordinateur." },
  { term: 'Ransomware', definition: "Malware bloquant l'accès à des données jusqu'à paiement d'une rançon." },
  { term: 'Pare-feu', definition: "Système de sécurité surveillant et contrôlant le trafic réseau." },
  { term: 'VPN', definition: "Réseau privé virtuel sécurisant votre connexion Internet." },
];

const cards = ref<Card[]>([]);
const matchedPairs = ref(0);
const firstCard = ref<HTMLElement | null>(null);
const secondCard = ref<HTMLElement | null>(null);
const hasFlippedCard = ref(false);
const lockBoard = ref(false);
const showResetButton = ref(false);

const initializeGame = () => {
  matchedPairs.value = 0;
  hasFlippedCard.value = false;
  lockBoard.value = false;
  showResetButton.value = false;

  // Réinitialiser toutes les cartes
  const cardElements = document.querySelectorAll('.card-inner');
  cardElements.forEach(card => {
    card.classList.remove('flipped', 'matched');
  });

  const shuffledCards: Card[] = [];
  cardData.forEach(card => {
    shuffledCards.push({ type: 'term', content: card.term });
    shuffledCards.push({ type: 'definition', content: card.definition });
  });
  shuffledCards.sort(() => Math.random() - 0.5);
  cards.value = shuffledCards;
};

const flipCard = (cardElement: HTMLElement) => {
  if (lockBoard.value || cardElement === firstCard.value) return;

  const cardInner = cardElement.querySelector('.card-inner') as HTMLElement | null;

  if (cardInner) {
    cardInner.classList.add('flipped');
  } else {
    console.warn("L'élément '.card-inner' est introuvable dans la carte.");
    return; // Évitez de continuer si '.card-inner' est introuvable
  }

  if (!hasFlippedCard.value) {
    hasFlippedCard.value = true;
    firstCard.value = cardElement;
    return;
  }

  secondCard.value = cardElement;
  lockBoard.value = true;

  checkForMatch();
};

const checkForMatch = () => {
  const firstContent = firstCard.value?.querySelector('.card-back')?.textContent;
  const secondContent = secondCard.value?.querySelector('.card-back')?.textContent;

  const isMatch = cardData.some(card =>
    (card.term === firstContent && card.definition === secondContent) ||
    (card.definition === firstContent && card.term === secondContent)
  );

  if (isMatch) {
    markAsMatched();
  } else {
    markAsNotMatched();
  }
};

const markAsMatched = () => {
  matchedPairs.value++;

  firstCard.value?.querySelector('.card-inner')?.classList.add('matched');
  secondCard.value?.querySelector('.card-inner')?.classList.add('matched');

  resetBoard();

  if (matchedPairs.value === cardData.length) {
    showResetButton.value = true;
  }
};

const markAsNotMatched = () => {
  setTimeout(() => {
    firstCard.value?.querySelector('.card-inner')?.classList.remove('flipped');
    secondCard.value?.querySelector('.card-inner')?.classList.remove('flipped');
    resetBoard();
  }, 1000);
};

const resetBoard = () => {
  hasFlippedCard.value = false;
  lockBoard.value = false;
  firstCard.value = null;
  secondCard.value = null;
};

onMounted(() => {
  initializeGame();
});
</script>

<template>
  <div class="mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="card w-full h-40"
        @click="
        // @ts-ignore
        flipCard($event.currentTarget)"
      >
        <div class="card-inner">
          <div class="card-front text-center bg-blue-200 flex items-center justify-center">Jeu de Cybersécurité</div>
          <div class="card-back bg-white flex items-center justify-center">{{ card.content }}</div>
        </div>
      </div>
    </div>

    <div class="text-center mt-2">
      <RoundedButton v-show="showResetButton" label="Recommencer" bg-color="bg-primary" class="hover:bg-blue-800 text-white px-4 py-2 rounded" @click="initializeGame" />
    </div>
  </div>
</template>

<style scoped>
.card {
  perspective: 1000px;
  cursor: pointer;
}
.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}
.card-inner.flipped {
  transform: rotateY(180deg);
}
.card-inner.matched {
  background-color: #d4edda;
  pointer-events: none;
}
.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}
.card-front {
  background: #2563eb;
  color: #fff;
}
.card-back {
  transform: rotateY(180deg);
}
</style>