<template>
    <div class="flex gap-4">
        <Container className="w-1/2">
            <template v-if="informasiAngkot">
                <div class="flex justify-between items-center">
                    <p>Angkot</p>
                    <p>{{ informasiAngkot.nomor_polisi }}</p>
                </div>
                <div class="flex justify-between items-center">
                    <p>Penumpang</p>
                    <p>Jumlah Terisi: <span id="jumlah-penumpang" class="font-semibold">{{ informasiAngkot.jumlah_penumpang ?? 0 }}</span></p>
                </div>
                <div class="flex justify-between items-center">
                    <p>Kapasitas</p>
                    <p>Maks: {{ informasiAngkot.kapasitas_penumpang }}</p>
                </div>
            </template>

            <div class="text-center my-6">
                <span id="persentase" class="text-8xl font-extrabold text-black-600">
                    <template v-if="informasiAngkot">{{ ((informasiAngkot.jumlah_penumpang / informasiAngkot.kapasitas_penumpang) * 100).toFixed() }}%</template>
                    <template v-else>0%</template>
                </span>
                <p class="my-3">
                    <template v-if="informasiAngkot">
                        <template>
                        {{ (informasiAngkot.kapasitas_penumpang - informasiAngkot.jumlah_penumpang) === 0 
                            ? 'Penuh' 
                            : 'Tersisa ' + (informasiAngkot.kapasitas_penumpang - informasiAngkot.jumlah_penumpang) }}
                        </template>
                    </template>
                    <template v-else>Belum Tersedia Data</template>
                </p>
            </div>
        </Container>

        <Container className="w-1/2">
            <div class="flex justify-between items-center">
                <h2>Halte</h2>
            </div>

            <div class="p-4">
                <div class="overflow-x-auto">
                    <div class="max-h-48 overflow-y-auto">
                        <table class="min-w-full table-fixed bg-white border border-gray-200 rounded-lg shadow">
                            <thead>
                                <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal sticky top-0 z-10">
                                    <th class="py-3 px-6 border-b text-center">No.</th>
                                    <th class="py-3 px-6 border-b text-center">Jarak</th>
                                    <th class="py-3 px-6 border-b">Jumlah Request</th>
                                </tr>
                            </thead>
                            <tbody class="text-gray-700 text-sm">
                                <tr
                                    v-for="halt, haltIndex in haltList"
                                    :key="halt._id"
                                    class="border-b hover:bg-gray-50"
                                >
                                    <td class="py-3 px-6 text-center">{{ haltIndex + 1 }}</td>
                                    <td class="py-3 px-6">{{ hitungJarak(
                                        currentLocation.lat,
                                        currentLocation.lng,
                                        halt.location.coordinates[1],
                                        halt.location.coordinates[0],
                                    ) }} m</td>
                                    <td class="py-3 px-6 text-center">1</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Container>
    </div>

    <Container>
        <div class="relative w-full h-96">
            <!-- Loading Overlay -->
            <div v-if="isLoading" class="loading-overlay">
                <p>Loading map...</p>
            </div>

            <div id="map" class="w-full h-full"></div>
        </div>
    </Container>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, onUnmounted } from "vue";
import Container from "@/components/Container.vue";
import Modal from "@/components/Modal.vue";
import { Edit, Trash2 } from 'lucide-vue-next';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from 'axios';
import { getDistance } from 'geolib';

export default defineComponent({
    components: {
        Container,
        Modal,

        Edit,
        Trash2,
    },
    setup() {
        let map, marker;
        let isMarkingMode = false;
        let userMarker = null;
        const isLocationAvailable = ref(false);
        const isLoading = ref(true); // Show loading initially

        const informasiAngkot = ref(null);

        const getInformasiAngkot = async (idAngkot) => {
            const response = await axios.post(
                'http://127.0.0.1:8000/get-info-angkot',
                {
                    'angkot_id': idAngkot,
                }
            );
            informasiAngkot.value = response.data.result[0];
        }

        const haltList = ref([]);

        const getHalts = async (lat, lng) => {
            const response = await axios.post(
                'http://127.0.0.1:8000/get-nearby-halts',
                {
                    'cur_lat': lat,
                    'cur_long': lng,
                    'max_distance': 10000
                }
            );
            haltList.value = response.data.result;
            console.log(haltList.value);
        }

        onMounted(() => {
            // Initialize the map
            setMap();
            const intervalId = setInterval(() => {
                getInformasiAngkot("6821ea7a1ea62f0c45c59f62");
            }, 1000); // setiap 1000ms = 1 detik

            onUnmounted(() => {
                clearInterval(intervalId); // bersihkan interval saat komponen unmount
            });
        });

        const setMap = () => {
            // Initialize the map
            map = L.map("map", { zoomControl: false }).setView([-6.9175, 107.6191], 13);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "", // Remove attribution
            }).addTo(map);

            // Get current location on load
            getCurrentLocation();

            // Add "Get Current Location" button
            const locationControl = L.control({ position: "bottomright" });
            locationControl.onAdd = function () {
                const btn = L.DomUtil.create("button", "custom-location-btn");
                btn.innerHTML = `<i class="fas fa-location-arrow"></i>`;
                btn.onclick = getCurrentLocation;
                return btn;
            };
            locationControl.addTo(map);

            // Add menu control
            const menuControl = L.control({ position: "bottomright" });
            menuControl.onAdd = function () {
                const menu = L.DomUtil.create("div", "custom-menu");

                
                return menu;
            };

            menuControl.addTo(map);
        }

        const currentLocation = ref(null);

        // Function to get current location
        function getCurrentLocation() {
            isLoading.value = true; // Show loading
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        currentLocation.value = {lat, lng};
            
                        await getHalts(lat, lng);
                        updateMap({lat, lng}, haltList.value);

                        isLocationAvailable.value = true;
                        isLoading.value = false; // Hide loading
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                        isLoading.value = false; // Hide loading even if error
                    },
                    { enableHighAccuracy: true }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
                isLoading.value = false;
            }
        }

        // Function to update map with multiple locations
        const updateMap = (centerLocation, locations) => {
            if (!Array.isArray(locations) || locations.length === 0 || !centerLocation) return;

            const { lat, lng } = centerLocation;
            map.flyTo([lat, lng], 15);

            // Hapus semua marker halte lama
            if (window.markers) {
                window.markers.forEach((m) => map.removeLayer(m));
            }
            window.markers = [];

            // Tambahkan marker untuk setiap halte
            locations.forEach((loc) => {
                if (
                    loc.location &&
                    Array.isArray(loc.location.coordinates) &&
                    loc.location.coordinates.length === 2
                ) {
                    const [lng, lat] = loc.location.coordinates;

                    const marker = L.circleMarker([lat, lng], {
                        radius: 8,
                        color: 'blue',
                        fillColor: '#30a1ff',
                        fillOpacity: 0.8
                    }).addTo(map)
                    .bindPopup(loc.popupText || `Marker at (${lat.toFixed(4)}, ${lng.toFixed(4)})`);

                    window.markers.push(marker);
                }
            });

            // **Tambahkan/memperbarui marker lokasi user**
            if (userMarker) {
                // Update posisi marker user yang sudah ada
                userMarker.setLatLng([lat, lng]);
            } else {
                // Buat marker user baru dengan icon default Leaflet
                userMarker = L.marker([lat, lng]).addTo(map).bindPopup('Lokasi Anda Saat Ini');
            }
        };

        function hitungJarak(lat1, lon1, lat2, lon2) {
            // console.log(lat1, lon1, lat2, lon2);
            // return 0;
            // getDistance hasilnya dalam meter
            const distance = getDistance(
                { latitude: lat1, longitude: lon1 },
                { latitude: lat2, longitude: lon2 }
            );
            return distance; // dalam meter
        }

        return {
            getCurrentLocation,
            isLocationAvailable,
            isLoading,

            informasiAngkot,

            haltList,
            currentLocation,
            hitungJarak
        }
    }
});
</script>


<style>
#map {
    height: 400px;
}

.leaflet-control-attribution {
    display: none !important;
}

/* Loading Overlay */
.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    z-index: 1000;
}

/* Custom Button Style */
.custom-location-btn {
    background-color: #3b82f6;
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.custom-location-btn:hover {
    background-color: #2563eb;
}

/* Custom Menu Style */
.custom-menu {
    background: white;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.custom-menu h3 {
    margin: 0;
    font-size: 16px;
}

.custom-menu button {
    background: #4caf50;
    color: white;
    border: none;
    padding: 6px;
    border-radius: 4px;
    cursor: pointer;
}

.custom-menu button:hover {
    background: #388e3c;
}
</style>
