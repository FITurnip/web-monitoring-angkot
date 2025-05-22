<template>
    <RouterLink :to="to" class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 transition">
        <component :is="IconComponent" class="w-5 h-5" />
        <span>{{ label }}</span>
    </RouterLink>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Home, BarChart, Settings, User, Car, Route, Monitor } from 'lucide-vue-next';

export default defineComponent({
    props: ['to', 'icon', 'label'],
    computed: {
        IconComponent() {
            return { 
                home: Home,
                'bar-chart': BarChart,
                user: User,
                settings: Settings,
                car: Car,
                route: Route,
                monitor: Monitor
             }[this.icon];
        }
    }
});
</script>