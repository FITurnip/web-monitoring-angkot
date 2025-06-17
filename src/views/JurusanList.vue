<template>
    <Container>
        <div class="flex justify-between items-center mb-6">
            <h1 class="font-bold text-xl">Data Jurusan Angkot</h1>
            <RouterLink to="/jurusan/form" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                + Tambah Jurusan
            </RouterLink>
        </div>

        <table class="w-full border">
            <thead>
                <tr class="bg-gray-200">
                    <th class="p-2 text-left">No</th>
                    <th class="p-2 text-left">Rute</th>
                    <th class="p-2 text-left">Tarif</th>
                    <th class="p-2 text-left">Jam Operasional</th>
                    <th class="p-2 text-left">Jenis</th>
                    <th class="p-2 text-left">Keterangan</th>
                    <th class="p-2 text-left"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(jurusan, i) in jurusanList" :key="i" class="odd:bg-white even:bg-gray-50">
                    <td class="p-2">{{ i + 1 }}</td>
                    <td class="p-2">{{ jurusan.rute }}</td>
                    <td class="p-2">Rp {{ jurusan.tarif.toLocaleString('id-ID') }}</td>
                    <td class="p-2">{{ jurusan.jam }}</td>
                    <td class="p-2">{{ jurusan.jenis }}</td>
                    <td class="p-2">{{ jurusan.keterangan }}</td>
                    <td class="p-2 space-x-2">
                    <RouterLink
                        :to="`/jurusan/edit/${i}`"
                        class="inline-flex items-center text-yellow-600 hover:text-yellow-800"
                    >
                        <Edit class="w-4 h-4" />
                    </RouterLink>
                    <button
                        @click="handleDelete(i)"
                        class="inline-flex items-center text-red-600 hover:text-red-800"
                    >
                        <Trash2 class="w-4 h-4" />
                    </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </Container>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Container from '@/components/Container.vue'
import { Edit, Trash2 } from 'lucide-vue-next'

export default defineComponent({
    components: { Container, Edit, Trash2 },
    setup() {
        const jurusanList = ref([])

        onMounted(() => {
            jurusanList.value = [
                {
                    rute: 'Terminal A – Kampus B',
                    tarif: 5000,
                    jam: '05.00 – 20.00',
                    jenis: 'Reguler',
                    keterangan: 'Trayek utama'
                },
                {
                    rute: 'Stasiun – Mall Sentra',
                    tarif: 7000,
                    jam: '06.00 – 22.00',
                    jenis: 'AC',
                    keterangan: 'Trayek AC'
                }
            ]
        })

        return { jurusanList }
    }
})
</script>
