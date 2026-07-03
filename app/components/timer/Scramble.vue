<template>
    <v-card class="pa-4 mb-4">
        <div class="text-h6 text-center text-md-h5 font-monospace text-medium-emphasis">
            <span class="d-block" v-for="(line, index) in lines" :key="index">
                {{ line }}
            </span>
        </div>
    </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{
    scramble: string
}>()

const lines = computed(() => {
    return props.scramble.split('\n')
})
</script>

<style scoped>
.font-monospace {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  letter-spacing: 0.04em;
  text-wrap: balance;
}
</style>