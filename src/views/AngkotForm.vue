<template>
  <Container>
    <h1 class="font-bold mb-6">Formulir Data Angkot</h1>
    <form @submit.prevent="handleSubmit" class="space-y-4">

      <div>
        <label>Nomor Polisi</label>
        <input v-model="form.nomorPolisi" type="text" class="w-full border border-black rounded p-3" />
      </div>

      <div>
        <label>Rute</label>
        <select v-model="form.rute" class="w-full border border-black rounded p-3">
          <option disabled value="">-- Pilih Rute --</option>
          <option v-for="rute in ruteOptions" :key="rute" :value="rute">{{ rute }}</option>
        </select>
      </div>

      <div>
        <label>Kapasitas Maksimum</label>
        <input v-model.number="form.kapasitas" type="number" min="1" class="w-full border border-black rounded p-3" />
      </div>

      <div>
        <label>Tarif</label>
        <div class="flex">
          <span class="inline-flex items-center px-3 border border-r-0 border-black rounded-l bg-gray-200 text-black">Rp</span>
          <input v-model.number="form.tarif" type="number" min="0" class="w-full border border-black rounded-r p-3" />
        </div>
      </div>

      <div>
        <label>Tahun Kendaraan</label>
        <select v-model="form.tahun" class="w-full border border-black rounded p-3">
          <option disabled value="">-- Pilih Tahun --</option>
          <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>

      <div>
        <label>OnBoardDeviceId</label>
        <input v-model="form.deviceId" type="text" class="w-full border border-black rounded p-3" />
      </div>

      <button type="submit" class="bg-black text-white px-4 py-2 rounded">Simpan</button>
    </form>
  </Container>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue'
import Container from '@/components/Container.vue' // contoh import
import Modal from '@/components/Modal.vue'
import { Edit, Trash2 } from 'lucide-vue-next' // contoh icon

export default defineComponent({
  components: {
    Container,
    Modal,
    Edit,
    Trash2,
  },
  setup() {
    const currentYear = new Date().getFullYear()

    const form = reactive({
      nomorPolisi: '',
      rute: '',
      kapasitas: null,
      tarif: null,
      tahun: '',
      deviceId: ''
    })

    const ruteOptions = [
      'Terminal A – Pasar Baru',
      'Stasiun – Kampus XYZ',
      'Terminal B – Mall Sentra',
      'Pasar Induk – Perumahan Elok',
      'Kantor Pos – RS Umum'
    ]

    const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i)

    function resetForm() {
      form.nomorPolisi = ''
      form.rute = ''
      form.kapasitas = null
      form.tarif = null
      form.tahun = ''
      form.deviceId = ''
    }

    function handleSubmit() {
      const list = JSON.parse(localStorage.getItem('angkotList') || '[]')
      list.push({ ...form })
      localStorage.setItem('angkotList', JSON.stringify(list))
      alert('Data angkot berhasil disimpan!')
      resetForm()
    }

    return {
      form,
      ruteOptions,
      yearOptions,
      handleSubmit,
    }
  }
})
</script>
