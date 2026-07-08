<template>
    <v-card class="pa-4">
        <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-subtitle-1 font-weight-bold">{{ $t('timer.scramble.title') }}</span>
            <v-btn size="small" variant="text"  icon="mdi-refresh" :title="$t('actions.newScramble')" @click="emits('refresh')"/>
        </div>
        <v-card-text class="text-headline-small text-center text-md-headline-medium font-monospace text-medium-emphasis">
            <span v-for="(line, index) in getScrambleLines(props.scramble)" :key="index" class="d-block">
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
</script>

<style scoped lang="scss">
@use '../../assets/variables' as vars;

.font-monospace {
  font-family: vars.$font-family-mono;
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