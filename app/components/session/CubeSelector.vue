<template>
    <div>
        <v-autocomplete label="Puzzle" :items="items" v-model="configStore.selectedCubeType">
        </v-autocomplete>
    </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '~/stores/db/config';
import { useSessionsStore } from '~/stores/db/sessions';
import { cubesDefinition } from '~~/lib/cube/cubesDefinition';
const {t} = useI18n()

const items = Object.entries(cubesDefinition).map(([,cube]) => {
    return {
        value: cube.id,
        title: t(`cube.${cube.id}`)
    }
})

const configStore = useConfigStore()
</script>