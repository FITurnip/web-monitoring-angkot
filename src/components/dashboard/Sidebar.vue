<template>
    <div class="h-screen w-64 bg-gray-900 text-white flex flex-col p-4 space-y-6">
        <h1 class="text-2xl font-bold text-center">Dashboard</h1>

        <!-- Group: Dashboard -->
        <div>
            <h2 class="text-gray-400 uppercase text-xs font-semibold mb-2 px-2">Dashboard</h2>
            <nav class="flex flex-col space-y-2">
                <NavItem to="/" icon="home" label="Home" />
            </nav>
        </div>

        <!-- Group: Transportasi -->
        <div>
            <h2 class="text-gray-400 uppercase text-xs font-semibold mb-2 px-2">Transportasi</h2>
            <nav class="flex flex-col space-y-2">
                <NavItem to="/halt" icon="monitor" label="Halt" />
                <NavItem to="/jurusan/list" icon="route" label="Route" />
                <NavItem to="/angkot/list" icon="car" label="Angkot" />
                <NavItem to="/supir" icon="person" label="Supir" />
            </nav>
        </div>

        <!-- Group: Pengaturan & Profil -->
        <div>
            <h2 class="text-gray-400 uppercase text-xs font-semibold mb-2 px-2">Pengaturan & Profil</h2>
            <nav class="flex flex-col space-y-2">
                <NavItem to="/profile" icon="user" label="Profile" />
                <NavItem to="/settings" icon="settings" label="Settings" />
            </nav>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavItem from './NavItem.vue';

export default defineComponent({
    components: {
        NavItem
    }
});
</script>