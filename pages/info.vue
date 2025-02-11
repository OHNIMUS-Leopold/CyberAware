<script setup lang="ts">
import data from '@/data/infos.json';

const openSections = ref<{ threats: Set<number>; practices: Set<number> }>({
    threats: new Set(),
    practices: new Set(),
});

const toggleSection = (index: number, category: 'threats' | 'practices') => {
    if (openSections.value[category].has(index)) {
        openSections.value[category].delete(index);
    } else {
        openSections.value[category].add(index);
    }
};

const isSectionOpen = (index: number, category: 'threats' | 'practices') => {
    return openSections.value[category].has(index);
};
</script>


<template>
    <main>
        <h1 class="mb-10 text-center">S'informer : Menaces et Bonnes Pratiques</h1>
  
        <div class="mb-20">
            <h2 class="mb-4">Menaces</h2>
            <div
            v-for="(threat, index) in data.threats"
            :key="index"
            class="mb-4 border rounded-lg"
            >
                <button
                    class="w-full p-2 bg-gray-200 text-left flex justify-between items-center"
                    @click="toggleSection(index, 'threats')"
                >
                    {{ threat.title }}
                    <span class="ml-2">{{ isSectionOpen(index, 'threats') ? '-' : '+' }}</span>
                </button>
                <div
                    v-if="isSectionOpen(index, 'threats')"
                    class="p-4 bg-gray-100"
                >
                    {{ threat.description }}
                </div>
            </div>
      </div>
  
        <div>
            <h2 class="mb-4">Bonnes Pratiques</h2>
            <div
                v-for="(practice, index) in data.practices"
                :key="index"
                class="mb-4 border rounded-lg"
                >
                <button
                    class="w-full p-2 bg-green-200 text-left flex justify-between items-center"
                    @click="toggleSection(index, 'practices')"
                >
                    {{ practice.title }}
                    <span class="ml-2">{{ isSectionOpen(index, 'practices') ? '-' : '+' }}</span>
                </button>
                <div
                    v-if="isSectionOpen(index, 'practices')"
                    class="p-4 bg-green-100"
                >
                    {{ practice.description }}
                </div>
            </div>
        </div>
    </main>
</template>