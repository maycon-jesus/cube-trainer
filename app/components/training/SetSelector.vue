<template>
  <div class="set-nav d-flex ga-3 py-2 overflow-x-auto">
    <button
      v-for="set in sets" :key="set.id" type="button"
      class="set-nav__card d-flex flex-column align-center flex-grow-0 flex-shrink-0 ga-2 pa-3 border rounded-lg bg-surface"
      @click="emit('select', set.id)">
        <nuxt-img :src="set.imageUrl" :alt="setNames[set.id]" height="72" width="72" class="set-nav__img rounded-lg" />
        <span class="text-body-2 font-weight-medium">{{ setNames[set.id] }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TrainingSet } from '~~/lib/cube/cubesDefinition';

const { t } = useI18n()

const props = defineProps<{
  sets: TrainingSet[]
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const setNames = computed(() => {
  const names: Record<string, string> = {}
  for (const set of props.sets) {
    names[set.id] = set.nameKey ? t(set.nameKey) : set.name ?? ''
  }
  return names
})
</script>

<style scoped lang="scss">
@use '../../assets/mixins' as mixins;

.set-nav {
  scroll-snap-type: x proximity;
}

.set-nav__card {
  width: 104px;
  cursor: pointer;
  scroll-snap-align: start;
  @include mixins.hover-primary-border;
}

.set-nav__img {
  background: rgba(var(--v-theme-on-surface), 0.04);
}
</style>
