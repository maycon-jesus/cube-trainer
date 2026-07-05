<template>
    <v-card>
        <v-card-text>
            <v-row>
                <v-col cols="12">
                    <SessionSelector v-model="configStore.sessionId"/>
                </v-col>
                <v-col cols="12">
                    <SessionCubeSelector/>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { useConfigStore } from '~/stores/db/config';

const configStore = useConfigStore()
</script>