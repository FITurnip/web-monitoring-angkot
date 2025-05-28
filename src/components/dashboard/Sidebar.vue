<template>
    <div class="h-screen w-64 bg-gray-900 text-white flex flex-col p-4 space-y-6">
        <h1 class="text-2xl font-bold text-center">Dashboard</h1>
        <nav class="flex flex-col space-y-4">
            <NavItem to="/" icon="home" label="Home" />
            <NavItem to="/halt" icon="monitor" label="Halt" />
            <NavItem to="/jurusan" icon="route" label="Route" />
            <NavItem to="/angkot" icon="car" label="Angkot" />
            <NavItem to="/supir" icon="person" label="Supir" />
            <NavItem to="/profile" icon="user" label="Profile" />
            <NavItem to="/settings" icon="settings" label="Settings" />
        </nav>
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