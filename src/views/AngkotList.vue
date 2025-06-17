<template>
    <Container>
        <div class="flex justify-between items-center mb-6">
            <h1 class="font-bold text-xl">Daftar Angkot</h1>
            <RouterLink
            to="/angkot/form"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
            + Tambah Angkot
            </RouterLink>

        </div>
        <div v-if="angkotList.length === 0">Belum ada data angkot.</div>
        <table v-else class="w-full">
            <thead>
                <tr class="bg-gray-200">
                    <th class="p-2 text-left">No</th>
                    <th class="p-2 text-left">Nomor Polisi</th>
                    <th class="p-2 text-left">Rute</th>
                    <th class="p-2 text-left">Kapasitas Maksimum</th>
                    <th class="p-2 text-left">Tarif (Rp)</th>
                    <th class="p-2 text-left">Tahun Kendaraan</th>
                    <th class="p-2 text-left">OnBoardDeviceId</th>
                    <th class="p-2 text-left"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(angkot, i) in angkotList" :key="i" class="odd:bg-white even:bg-gray-50">
                    <td class="p-2">{{ i + 1 }}</td>
                    <td class="p-2">{{ angkot.nomorPolisi }}</td>
                    <td class="p-2">{{ angkot.rute }}</td>
                    <td class="p-2">{{ angkot.kapasitas }}</td>
                    <td class="p-2">Rp {{ angkot.tarif.toLocaleString('id-ID') }}</td>
                    <td class="p-2">{{ angkot.tahun }}</td>
                    <td class="p-2">{{ angkot.deviceId }}</td>
                    <td class="p-2 space-x-2 flex">
                        <button
                            @click="handleEdit(i)"
                            class="p-1 rounded hover:bg-gray-200"
                            title="Edit"
                            aria-label="Edit angkot"
                        >
                            <Edit class="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                            @click="handleDelete(i)"
                            class="p-1 rounded hover:bg-red-100"
                            title="Hapus"
                            aria-label="Hapus angkot"
                        >
                            <Trash2 class="w-5 h-5 text-red-600" />
                        </button>
                        </td>
                </tr>
            </tbody>
        </table>
    </Container>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import Container from '@/components/Container.vue'
import Modal from '@/components/Modal.vue'
import { Edit, Trash2 } from 'lucide-vue-next'

export default defineComponent({
    components: {
        Container,
        Modal,
        Edit,
        Trash2,
    },
    setup() {
        const angkotList = ref([])

        const ruteOptions = [
            'Terminal A – Pasar Baru',
            'Stasiun – Kampus XYZ',
            'Terminal B – Mall Sentra',
            'Pasar Induk – Perumahan Elok',
            'Kantor Pos – RS Umum'
        ]

        const currentYear = new Date().getFullYear()
        const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i)

        // Tarif tetap per rute (harus bulat)
        const tarifPerRute = {
            'Terminal A – Pasar Baru': 5000,
            'Stasiun – Kampus XYZ': 7000,
            'Terminal B – Mall Sentra': 6000,
            'Pasar Induk – Perumahan Elok': 4000,
            'Kantor Pos – RS Umum': 5500
        }

        function generateDummyData() {
            const list = []
            for (let i = 1; i <= 20; i++) {
                const rute = ruteOptions[Math.floor(Math.random() * ruteOptions.length)]
                list.push({
                    nomorPolisi: `B ${Math.floor(1000 + Math.random() * 9000)} XYZ`,
                    rute,
                    kapasitas: Math.floor(10 + Math.random() * 20),
                    tarif: tarifPerRute[rute],  // pakai tarif fix dari mapping
                    tahun: yearOptions[Math.floor(Math.random() * yearOptions.length)],
                    deviceId: `DEV-${Math.floor(1000 + Math.random() * 9000)}`
                })
            }
            return list
        }

        onMounted(() => {
            angkotList.value = generateDummyData()
        })

        return { angkotList }
    }
})
</script>
