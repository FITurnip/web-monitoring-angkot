<template>
    <div class="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white p-6">
        <img :src="imageSrc" alt="Card Image" class="w-full rounded-xl" />
        <div class="py-4">
            <h2 class="text-xl font-semibold text-gray-800">{{ title }}</h2>
            <p class="text-gray-600 mt-2">{{ description }}</p>
        </div>
        <div class="mt-4">
            <button @click="onClick" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl">
                {{ buttonText }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        imageSrc: String,
        title: String,
        description: String,
        buttonText: {
            type: String,
            default: "Learn More",
        },
    },
    methods: {
        onClick() {
            this.$emit("click");
        },
    },
};
</script>