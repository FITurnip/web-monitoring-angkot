<template>
    <div class="space-y-8 max-w-lg mx-auto mt-10">
        <!-- Container 1: User (Email & Password) -->
        <Container>
            <h3 class="text-xl font-semibold mb-4">User Account</h3>
            <div class="space-y-4">
                <div>
                    <label for="email" class="block mb-1 font-medium">Email</label>
                    <input id="email" v-model="email" type="email" placeholder="Masukkan email"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required />
                </div>

                <div>
                    <label for="password" class="block mb-1 font-medium">Password</label>
                    <input id="password" v-model="password" type="password" placeholder="Masukkan password"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required />
                </div>

                <button @click="submitUserAccount"
                    class="mt-3 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition w-full">
                    Simpan User Account
                </button>
            </div>
        </Container>

        <!-- Container 2: Profil Supir -->
        <Container>
            <h3 class="text-xl font-semibold mb-4">Profil Supir</h3>
            <form @submit.prevent="submitForm" class="space-y-4">
                <div>
                    <label for="name" class="block mb-1 font-medium">Nama Supir</label>
                    <input id="name" v-model="name" type="text" placeholder="Masukkan nama supir"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required />
                </div>

                <div>
                    <label for="phone" class="block mb-1 font-medium">Nomor Telepon</label>
                    <input id="phone" v-model="phone" type="tel" placeholder="Masukkan nomor telepon"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required />
                </div>

                <div>
                    <label class="block mb-1 font-medium">Foto Profil</label>
                    <input type="file" accept="image/*" @change="onFileChange" class="w-full" />
                    <div v-if="photoPreview" class="mt-3">
                        <img :src="photoPreview" alt="Preview Foto"
                            class="w-32 h-32 object-cover rounded-full border" />
                    </div>
                </div>

                <div>
                    <label for="experience" class="block mb-1 font-medium">Pengalaman (tahun)</label>
                    <input id="experience" :value="experience" type="number" readonly
                        class="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed" />
                </div>
            </form>
        </Container>

        <!-- Container 3: Informasi Angkot -->
        <Container>
            <h3 class="text-xl font-semibold mb-4">Informasi Angkot</h3>
            <form @submit.prevent="submitForm" class="space-y-4">
                <div>
                    <label for="vehicleNumber" class="block mb-1 font-medium">Nomor Kendaraan</label>
                    <input id="vehicleNumber" v-model="vehicleNumber" type="text" placeholder="Masukkan nomor kendaraan"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required />
                </div>

                <div>
                    <label for="route" class="block mb-1 font-medium">Rute Angkot</label>
                    <input id="route" :value="route" readonly
                        class="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed" />
                </div>


                <div>
                <label for="onBoardDeviceId" class="block mb-1 font-medium">onBoardDeviceId</label>
                <input
                    id="onBoardDeviceId"
                    type="text"
                    placeholder=""
                    value=""
                    disabled
                    class="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
                </div>

            </form>
        </Container>

        <button @click="submitForm" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Simpan Seluruhnya
        </button>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import Container from '@/components/Container.vue' // sesuaikan path

export default defineComponent({
    name: 'DriverProfileForm',
    components: { Container },
    setup() {
        const email = ref('supir@example.com')
        const password = ref('password123')
        const name = ref('Budi Santoso')
        const phone = ref('081234567890')
        const vehicleNumber = ref('D 1234 XY')
        const route = ref('Rute 2: Stasiun - Mall')
        const experience = ref(5)
        const photoFile = ref(null)
        const photoPreview = ref(null)

        const onFileChange = (e) => {
            const file = e.target.files[0]
            if (file) {
                photoFile.value = file
                const reader = new FileReader()
                reader.onload = (event) => {
                    photoPreview.value = event.target.result
                }
                reader.readAsDataURL(file)
            }
        }

        const submitUserAccount = () => {
            alert(`User Account Disimpan:
            Email: ${email.value}
            Password: ${'*'.repeat(password.value.length)}`)
        }

        const submitForm = () => {
            alert(`Profil Supir Disimpan:
            Nama: ${name.value}
            Telepon: ${phone.value}
            No Kendaraan: ${vehicleNumber.value}
            Rute: ${route.value}
            Pengalaman: ${experience.value} tahun
            Foto: ${photoFile.value ? photoFile.value.name : 'Tidak ada foto'}`)
        }

        return {
            email,
            password,
            name,
            phone,
            vehicleNumber,
            route,
            experience,
            photoFile,
            photoPreview,
            onFileChange,
            submitUserAccount,
            submitForm,
        }
    },
})
</script>
