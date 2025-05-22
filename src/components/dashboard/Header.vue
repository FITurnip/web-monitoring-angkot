<template>
    <header class="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
        <!-- Title -->
        <h1 class="text-xl font-semibold">Dashboard</h1>

        <!-- Right Section (Icons) -->
        <div class="flex items-center space-x-4">
            <button class="p-2 rounded-md hover:bg-gray-700 transition">
                <Settings class="w-6 h-6" />
            </button>
            <button class="p-2 rounded-md hover:bg-gray-700 transition">
                <User class="w-6 h-6" />
            </button>
        </div>
    </header>
</template>

<script>
import { defineComponent } from 'vue';
import { User, Settings } from 'lucide-vue-next';

export default defineComponent({
    components: { User, Settings }
});
</script>