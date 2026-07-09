<template>
    <v-card>
        <template v-if="props.title" #title>
            <div class="d-flex justify-space-between align-center">
                <span>
                    <v-icon v-if="props.icon" class="mr-2" :color="props.iconColor">{{ props.icon }}</v-icon>
                    <span class="text-title-medium font-weight-bold">{{props.title}}</span>
                </span>
                <slot name="title-append" />
            </div>
        </template>

        <template v-if="props.subtitle" #subtitle>
            <span class="text-title-medium">{{props.subtitle}}</span>
        </template>

        <template #text>
            <slot/>
        </template>

        <template v-if="$slots.actions" #actions>
            <slot name="actions"/>
        </template>
    </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{
    title?: string
    subtitle?: string
    icon?: string
    iconColor?: string
}>()
</script>