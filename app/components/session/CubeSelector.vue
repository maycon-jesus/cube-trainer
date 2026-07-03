<template>
    <div>
        <v-select :label="t('puzzle.label')" :items="items" v-model="configStore.puzzle" hide-details>
        </v-select>
    </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '~/stores/db/config';
import { cubesDefinition } from '~~/lib/cube/cubesDefinition';
const { t } = useI18n()

const items = Object.entries(cubesDefinition).map(([, cube]) => {
    return {
        value: cube.id,
        title: t(`cube.${cube.id}`)
    }
})

const configStore = useConfigStore()
</script>