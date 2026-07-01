<template>
    <div>
        <v-autocomplete label="Session" :items="items" v-model="configStore.selectedSessionId">
            <template #append-item>
                <v-list-item>
                    <v-list-item-title>AAA</v-list-item-title>
                </v-list-item>
            </template>
        </v-autocomplete>
    </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '~/stores/db/config';
import { useSessionsStore } from '~/stores/db/sessions';

const sessionStore = useSessionsStore()
const configStore = useConfigStore()
const items = computed(()=>{
    return sessionStore.sessions.map(it => {
        return {
            title: it.name,
            value: it.id
        }
    })
})
</script>