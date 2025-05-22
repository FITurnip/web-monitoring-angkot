<template>
    <transition name="fade">
        <div v-if="isOpen" class="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
                <button @click="close" class="absolute top-3 right-3 text-gray-500 hover:text-black">
                    ✕
                </button>
                <slot name="header">
                    <h2 class="text-xl font-semibold mb-4">Modal Title</h2>
                </slot>

                <slot>
                    <p class="text-gray-600">This is the modal content.</p>
                </slot>

                <slot name="footer">
                    <div class="mt-6 flex justify-end">
                        <button @click="close" class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Close</button>
                    </div>
                </slot>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    isOpen: Boolean,
})
const emit = defineEmits(['close'])

const close = () => {
    emit('close')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>