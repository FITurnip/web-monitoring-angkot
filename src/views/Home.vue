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
            <LineChart
                :chart-labels="requestPerJam.label"
                :chart-data="requestPerJam.data"
                chart-label="Jumlah Request Naik Angkot per Jam"
            />
        </Container>


        <Container className="w-1/2">
            <LineChart
                :chart-labels="penumpangPerJam.label"
                :chart-data="penumpangPerJam.data"
                chart-label="Jumlah Penumpang Naik Angkot per Jam"
            />
        </Container>
    </div>

</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Container from "@/components/Container.vue";
import LineChart from "@/components/charts/LineChart.vue";
import axios from 'axios';

export default defineComponent({
    name: "DashboardView",
    components: {
        Container,
        LineChart
    },
    setup() {
        let map, marker;
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

        const requestPerJam = ref({
            label: [], data: []
        });

        const setGrafikRequestPerJam = async () => {
            const response = await axios.post(
                'http://127.0.0.1:8000/get-request-per-jam'
            );
            const result = response.data.result;

            const labelRequestPerJam = [], dataRequestPerJam = [];
            result.forEach(e => {
                labelRequestPerJam.push(e._id.hour);
                dataRequestPerJam.push(e.total);
            });

            // requestPerJam.value = { label : labelRequestPerJam, data : dataRequestPerJam };
            requestPerJam.value = {
                label: ['23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00'],
                data: [4, 2, 1, 1, 0, 3, 7, 15, 28, 34, 26, 19]
            };
        }

        const penumpangPerJam = ref({
            label: [], data: []
        });

        const setGrafikPenumpangPerJam = async () => {
            // const response = await axios.post(
            //     'http://127.0.0.1:8000/get-penumpang-per-jam'
            // );
            // const result = response.data.result;

            // const labelPenumpangPerJam = [], dataPenumpangPerJam = [];
            // result.forEach(e => {
            //     labelPenumpangPerJam.push(e._id.hour);
            //     dataPenumpangPerJam.push(e.total);
            // });

            // PenumpangPerJam.value = { label : labelPenumpangPerJam, data : dataPenumpangPerJam };
            penumpangPerJam.value = {
                label: ['23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00'],
                data: [4, 2, 1, 1, 0, 3, 7, 10, 25, 33, 24, 5]
            };
        }

        onMounted(() => {
            setMap();
            setGrafikRequestPerJam();
            setGrafikPenumpangPerJam();
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
                // menu.innerHTML = `
                //     <h3>Map Menu</h3>
                //     <button id="zoom-in">Zoom In</button>
                //     <button id="zoom-out">Zoom Out</button>
                //     <button id="reset-view">Reset View</button>
                // `;

                // setTimeout(() => {
                //     document.getElementById("zoom-in").onclick = () => map.zoomIn();
                //     document.getElementById("zoom-out").onclick = () => map.zoomOut();
                //     document.getElementById("reset-view").onclick = () => map.setView([0, 0], 13);
                // }, 100);

                return menu;
            };
            menuControl.addTo(map);
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

            // Center the map
            const { lat, lng } = centerLocation;
            map.flyTo([lat, lng], 15);

            // Clear existing markers
            if (window.markers) {
                window.markers.forEach((m) => map.removeLayer(m));
            }
            window.markers = [];

            // Add markers
            locations.forEach((loc) => {
                if (
                    loc.location &&
                    Array.isArray(loc.location.coordinates) &&
                    loc.location.coordinates.length === 2
                ) {
                    const [lng, lat] = loc.location.coordinates; // GeoJSON format
                    const newMarker = L.marker([lat, lng]) // Leaflet expects [lat, lng]
                        .addTo(map)
                        .bindPopup(loc.popupText || `Marker at (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
                    window.markers.push(newMarker);

                    // console.log(loc.location.coordinates);
                }
            });

            // Optional: Open popup on first marker
            // if (window.markers.length > 0) {
            //     window.markers[0].openPopup();
            // }
        };

        return {
            getCurrentLocation,
            isLocationAvailable,
            isLoading,

            haltList,

            requestPerJam,
            penumpangPerJam
        };
    },
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
