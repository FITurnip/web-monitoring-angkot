<template>
    <div class="h-screen flex">
        <!-- Sidebar on the left -->
        <Sidebar class="fixed left-0 top-0 h-full w-64" />

        <div class="flex flex-col flex-1 ml-64">
            <!-- Header at the top -->
            <Header class="fixed top-0 left-64 right-0 h-16 z-10" />

            <!-- Main Content -->
            <main class="flex-1 p-6 mt-16 overflow-auto">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'

export default defineComponent({
    components: {
        Sidebar,
        Header
    }
});
</script>

<style scoped>
/* Ensure Sidebar and Header remain fixed while content scrolls */
main {
    height: calc(100vh - 4rem); /* Adjust based on header height */
}
</style>
