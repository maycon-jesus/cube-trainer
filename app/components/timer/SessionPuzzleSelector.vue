<template>
    <CustomCard class="center">
        <v-row>
            <v-col cols="12">
                <SessionSelector v-model="configStore.sessionId"/>
            </v-col>
            <v-col cols="12">
                <SessionCubeSelector v-model="configStore.puzzle" />
            </v-col>
        </v-row>
    </CustomCard>
</template>

<script setup lang="ts">
import { useConfigStore } from '~/stores/db/config';

const configStore = useConfigStore()
</script>

<style scoped>
.center {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>