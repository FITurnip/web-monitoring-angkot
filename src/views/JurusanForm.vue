<template>
    <Container>
        <h1 class="font-bold text-xl mb-6">Tambah Jurusan Angkot</h1>
        <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
                <label class="block font-semibold">Rute</label>
                <input v-model="form.rute" type="text" class="w-full border border-gray-400 rounded p-3" />
            </div>

            <div>
                <label class="block font-semibold">Tarif (Rp)</label>
                <input v-model.number="form.tarif" type="number" class="w-full border border-gray-400 rounded p-3" />
            </div>

            <div>
                <label class="block font-semibold">Jam Operasional</label>
                <input v-model="form.jam" type="text" class="w-full border border-gray-400 rounded p-3" />
            </div>

            <div>
                <label class="block font-semibold">Jenis Angkot</label>
                <select v-model="form.jenis" class="w-full border border-gray-400 rounded p-3">
                    <option disabled value="">-- Pilih Jenis --</option>
                    <option>Reguler</option>
                    <option>AC</option>
                    <option>Listrik</option>
                </select>
            </div>

            <div>
                <label class="block font-semibold">Keterangan</label>
                <textarea v-model="form.keterangan" class="w-full border border-gray-400 rounded p-3" rows="3" />
            </div>

            <div class="flex gap-4">
                <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Simpan</button>
                <RouterLink to="/jurusan" class="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">Batal
                </RouterLink>
            </div>
        </form>
    </Container>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import Container from '@/components/Container.vue'

export default defineComponent({
    components: { Container },
    setup() {
        const router = useRouter()
        const form = ref({
            rute: '',
            tarif: null,
            jam: '',
            jenis: '',
            keterangan: ''
        })

        const handleSubmit = () => {
            alert('Jurusan berhasil ditambahkan (simulasi).')
            router.push('/jurusan')
        }

        return { form, handleSubmit }
    }
})
</script>
