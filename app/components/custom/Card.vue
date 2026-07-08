<template>
    <v-card>
        <template v-if="props.title" #title>
            <div class="d-flex justify-space-between align-center">
                <span class="text-title-medium font-weight-bold">{{props.title}}</span>
                <slot name="title-append" />
            </div>
        </template>

        <template v-if="props.subtitle" #subtitle>
            <span class="text-title-medium">{{props.subtitle}}</span>
        </template>

        <template #text>
            <slot/>
        </template>
    </v-card>
</template>

<script setup lang="ts">
import { templateRef } from 'vuetify/lib/util/helpers.mjs';

const props = defineProps<{
    title?: string
    subtitle?: string
}>()
</script>