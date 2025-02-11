<template>
    <button
        :class="['w-full', 'p-2', 'rounded', 'text-white', bgColor]"
    >
        {{ label }}
    </button>
</template>

<script setup lang="ts">

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    bgColor: {
        type: String,
        default: 'bg-primary', 
    },
});

</script>