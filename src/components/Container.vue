<template>
    <div :class="`max-w-7xl mx-auto p-4 sm:px-6 lg:p- shadow-lg rounded-2xl ${className}`">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        className: { type: String, default: "" }
    }
};
</script>