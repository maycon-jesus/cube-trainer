<template>
    <v-card class="pa-4">
        <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-subtitle-1 font-weight-bold">Embaralhamento</span>
            <v-btn size="small" variant="text"  icon="mdi-refresh" :title="$t('actions.newScramble')" @click="emits('refresh')"/>
        </div>
        <v-card-text class="text-headline-small text-center text-md-headline-medium font-monospace text-medium-emphasis">
            <span v-for="(line, index) in lines" :key="index" class="d-block">
                {{ line }}
            </span>
        </v-card-text>
        
    </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{
    scramble: string
}>()

const emits = defineEmits<{
    (e: 'refresh'): void
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

.sizing-borderbox{
    box-sizing: border-box;
    position: relative;
}

.aaa{
    position: absolute;
    right: 0;
    top: 0;
}
</style>