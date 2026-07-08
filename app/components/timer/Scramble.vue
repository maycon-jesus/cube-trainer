<template>
    <CustomCard :title="$t('timer.scramble.title')">
        <template #title-append>
            <v-btn size="small" variant="text"  icon="mdi-refresh" :title="$t('actions.newScramble')" @click="emits('refresh')"/>
        </template>

        <span v-for="(line, index) in getScrambleLines(props.scramble)" :key="index" class="d-block text-headline-small text-center text-md-headline-medium font-monospace text-medium-emphasis">
                {{ line }}
            </span>
    </CustomCard>
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