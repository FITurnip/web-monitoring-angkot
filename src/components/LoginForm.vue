<template>
  <div class="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-sm relative">
    <!-- Gambar Angkot -->
    <div class="absolute -top-12 left-1/2 transform -translate-x-1/2">
      <img src="https://www.malukuterkini.com/wp-content/uploads/2021/10/ANGKOT-241021-1-OK.jpg" alt="Angkot" class="w-24 h-24 rounded-full border-4 border-white shadow-md" />
    </div>

    <h2 class="mt-16 text-center text-2xl font-bold text-orange-700">Login</h2>

    <form @submit.prevent="submitForm" class="mt-6">
      <div class="mb-4">
        <label class="block text-sm font-semibold text-gray-600">Email</label>
        <input
          type="email"
          v-model="email"
          class="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="supir@example.com"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-semibold text-gray-600">Password</label>
        <input
          type="password"
          v-model="password"
          class="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-all font-semibold"
      >
        Masuk
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const emit = defineEmits(['login'])

const submitForm = () => {
  if (!email.value || !password.value) {
    alert('Silakan isi email dan password.')
    return
  }

  emit('login', { email: email.value, password: password.value })
}
</script>