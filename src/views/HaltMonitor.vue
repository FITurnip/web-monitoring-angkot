<template>
    <Container>
        <div class="relative w-full h-96">
            <!-- Loading Overlay -->
            <div v-if="isLoading" class="loading-overlay">
                <p>Loading map...</p>
            </div>

            <div id="map" class="w-full h-full"></div>
        </div>
    </Container>

    <div class="flex gap-4">
        <Container className="w-1/2">
            <div class="flex justify-between items-center">
                <h2>Rute</h2>

                <button class="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded" @click="showModal = true">+</button>
            </div>

            <div class="p-4">
                <div class="overflow-x-auto">
                    <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                        <thead>
                            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                                <th class="py-3 px-6 border-b text-center">Pilih</th>
                                <th class="py-3 px-6 border-b">rute</th>
                                <th class="py-3 px-6 border-b text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-700 text-sm">
                            <template v-if="selectedCoordinate != null">\
                                <tr
                                    v-for="rute in ruteList"
                                    :key="rute.id"
                                    class="border-b hover:bg-gray-50"
                                >
                                    <td class="py-3 px-6 text-center">
                                    <input
                                        type="radio"
                                        v-model="ruteSelected"
                                        :value="rute.id"
                                    />
                                    </td>
                                    <td class="py-3 px-6">{{ rute.rute }}</td>
                                    <td class="py-3 px-6 text-center">
                                        <div class="flex justify-center gap-2">
                                            <button class="text-blue-500 hover:text-blue-700">
                                                <Edit class="w-5 h-5" />
                                            </button>
                                            <button class="text-red-500 hover:text-red-700">
                                                <Trash2 class="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <template v-else>
                                <tr>
                                    <td colspan="3" class="py-3 px-6 text-center">Pilih halte pada map</td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </Container>

        <Container className="w-1/2">
            <div class="flex justify-between items-center">
                <h2>Angkot</h2>

                <button class="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">+</button>
            </div>

            <div class="p-4">
                <div class="overflow-x-auto">
                    <div class="max-h-64 overflow-y-auto">
                        <table class="min-w-full table-fixed bg-white border border-gray-200 rounded-lg shadow">
                            <thead>
                                <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal sticky top-0 z-10">
                                    <th class="py-3 px-6 border-b text-center">No.</th>
                                    <th class="py-3 px-6 border-b">Nomor Polisi</th>
                                    <th class="py-3 px-6 border-b text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="text-gray-700 text-sm">
                                <template v-if="ruteSelected">
                                    <template v-if="filteredAngkot.length > 0">
                                        <tr
                                            v-for="angkot, angkotIndex in filteredAngkot"
                                            :key="angkot.id"
                                            class="border-b hover:bg-gray-50"
                                        >
                                            <td class="py-3 px-6 text-center">{{ angkotIndex + 1 }}</td>
                                            <td class="py-3 px-6">{{ angkot.nopol }}</td>
                                            <td class="py-3 px-6 text-center">
                                                <div class="flex justify-center gap-2">
                                                    <button class="text-blue-500 hover:text-blue-700">
                                                        <Edit class="w-5 h-5" />
                                                    </button>
                                                    <button class="text-red-500 hover:text-red-700">
                                                        <Trash2 class="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </template>
                                    <template v-else>
                                        <tr>
                                            <td colspan="3" class="py-3 px-6 text-center">Data kosong</td>
                                        </tr>
                                    </template>
                                </template>
                                <template v-else>
                                    <tr>
                                        <td colspan="3" class="py-3 px-6 text-center">Rute Belum dipilih</td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Container>
    </div>

    <Modal :isOpen="showModal" @close="showModal = false">
      <template #header>
        <h2 class="text-2xl font-bold">Hello 👋</h2>
      </template>

      <template #default>
        <p>This is some custom modal content. You can slot anything here.</p>
      </template>

      <template #footer>
        <button @click="showModal = false" class="px-4 py-2 bg-blue-600 text-white rounded-xl">Got it!</button>
      </template>
    </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import Container from "@/components/Container.vue";
import Modal from "@/components/Modal.vue";
import { Edit, Trash2 } from 'lucide-vue-next';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from 'axios';

export default defineComponent({
    components: {
        Container,
        Modal,

        Edit,
        Trash2,
    },
    setup() {
        const ruteList = ref([
            { id: 1, rute: 'Pasar - SMP' },
            { id: 2, rute: 'A - V' },
            { id: 3, rute: 'V - B' },
        ]);

        const ruteSelected = ref(null);

        const angkotList = ref(
            Array.from({ length: 100 }, (_, index) => {
                const id = index + 1;

                // Random rute_id from 1, 2, or 3
                const rute_id = Math.floor(Math.random() * 3) + 1;

                // Generate random plate number like "D 1234 AB"
                const randomNumber = Math.floor(1000 + Math.random() * 9000); // 1000 - 9999
                const randomLetters = () =>
                String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                String.fromCharCode(65 + Math.floor(Math.random() * 26));
                const nopol = `D ${randomNumber} ${randomLetters()}`;

                return {
                    id,
                    nopol,
                    rute_id,
                };
            })
        );


        const filteredAngkot = computed(() => {
            return angkotList.value.filter(
                (angkot) => angkot.rute_id === ruteSelected.value
            );
        });

        let map, marker;
        let isMarkingMode = false;
        let userMarker = null;
        const isLocationAvailable = ref(false);
        const isLoading = ref(true); // Show loading initially

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
        }

        onMounted(() => {
            // Initialize the map
            setMap();
        });
        
        const selectedCoordinate = ref(null);

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
                menu.innerHTML = `
                    <button id="clear-marker-btn" style="display: none;">Bersihkan</button>
                    <button id="cancel-mark-btn" style="display: none;">Batal</button>
                    <button id="mark-location-btn">Tambah Halt</button>
                `;

                
                return menu;
            };

            menuControl.addTo(map);
            
            // Attach event to button
            setTimeout(() => {
                const markBtn = document.getElementById("mark-location-btn");
                const cancelBtn = document.getElementById("cancel-mark-btn");
                const clearBtn = document.getElementById("clear-marker-btn");

                if (markBtn && cancelBtn && clearBtn) {
                    markBtn.onclick = () => {
                        setTimeout(() => {
                            isMarkingMode = true;
                        }, 100);
                        
                        markBtn.style.display = "none";
                        cancelBtn.style.display = "inline-block";
                        clearBtn.style.display = window.customMarker ? "inline-block" : "none";

                        // Deselect selected marker
                        if (window.selectedMarker) {
                            window.selectedMarker.setStyle({
                                color: 'blue',
                                fillColor: '#30a1ff'
                            });
                            window.selectedMarker = null;
                        }
                    };

                    cancelBtn.onclick = () => {
                        isMarkingMode = false;

                        // Hide cancel button, show mark button
                        markBtn.style.display = "inline-block";
                        cancelBtn.style.display = "none";
                        clearBtn.style.display = userMarker ? "inline-block" : "none";
                    };

                    clearBtn.onclick = () => {
                        if (window.customMarker) {
                            map.removeLayer(window.customMarker);
                            window.customMarker = null;
                        }
                        clearBtn.style.display = "none";
                    };

                }
            }, 100);

            // Handle map click for marker
            map.on("click", (e) => {
                if (!isMarkingMode) return;

                const { lat, lng } = e.latlng;
                console.log(e.latlng);

                // Remove existing custom marker if any
                if (window.customMarker) {
                    map.removeLayer(window.customMarker);
                }

                // Create and store new custom marker
                window.customMarker = L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup(`Marker at:<br>Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`)
                    .openPopup();

                // Turn off marking mode
                isMarkingMode = false;

                // Show/hide buttons accordingly
                const markBtn = document.getElementById("mark-location-btn");
                const cancelBtn = document.getElementById("cancel-mark-btn");
                const clearBtn = document.getElementById("clear-marker-btn");

                if (markBtn && cancelBtn && clearBtn) {
                    markBtn.style.display = "inline-block";
                    cancelBtn.style.display = "none";
                    clearBtn.style.display = "inline-block";
                }
            });

        }

        // Function to get current location
        function getCurrentLocation() {
            isLoading.value = true; // Show loading
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
            
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

            if (window.markers) {
                window.markers.forEach((m) => map.removeLayer(m));
            }
            window.markers = [];

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

                    marker.on('click', () => {
                        if (!isMarkingMode) {
                            if (window.selectedMarker && window.selectedMarker !== marker) {
                                window.selectedMarker.setStyle({
                                    color: 'blue',
                                    fillColor: '#30a1ff'
                                });
                            }
    
                            marker.setStyle({
                                color: 'red',
                                fillColor: '#ff4d4d'
                            });
    
                            window.selectedMarker = marker;
                        }

                        selectedCoordinate.value = {
                            lat: loc.location.coordinates[0],
                            lng: loc.location.coordinates[1]
                        }
                    });

                    window.markers.push(marker);
                }
            });
        };

        const showModal = ref(false)

        return {
            ruteList,
            ruteSelected,

            angkotList,
            filteredAngkot,

            getCurrentLocation,
            isLocationAvailable,
            isLoading,

            showModal,

            selectedCoordinate
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
