<template lang="pug">
Parent
    router-view
</template>
<script setup>
import { render } from 'vue';
import Parent from '@/components/Parent.vue';
</script>
<style lang="scss">
#app {
    width: 100%;
    height: 100%;
    background-color: #ccc;
}
</style>
