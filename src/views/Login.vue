<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <LoginForm @login="handleLogin" />
  </div>
</template>

<script setup>
import LoginForm from '../components/LoginForm.vue'

const handleLogin = (formData) => {
  console.log('User logged in with:', formData)
  // Simulasi login atau arahkan ke dashboard sesuai role
  alert(`Login sebagai: ${formData.role}, Email: ${formData.email}`)
}
</script>