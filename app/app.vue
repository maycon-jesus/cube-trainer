<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
const nuxtApp = useNuxtApp()
const loader = useLoader()
// nuxtApp.hook('page:start', () => {
//   loader.start()
// })

// nuxtApp.hook('page:finish', () => {
//   loader.end()
// })
</script>