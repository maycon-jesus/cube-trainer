<script setup lang="ts">
const { t } = useI18n()
const { public: { version, githubUrl, licenseUrl, buyMeCoffeeUrl } } = useRuntimeConfig()
</script>

<template>
  <v-footer class="d-flex flex-column align-center ga-1 py-4 text-caption text-medium-emphasis">
    <div class="d-flex align-center flex-wrap justify-center ga-1">
      <span>v{{ version }}</span>
      <span>·</span>
      <a :href="githubUrl" target="_blank" rel="noopener noreferrer" class="footer-link d-inline-flex align-center ga-1">
        <v-icon icon="mdi-github" size="small" />
        <span>GitHub</span>
      </a>
      <span>·</span>
      <a :href="buyMeCoffeeUrl" target="_blank" rel="noopener noreferrer" class="footer-link d-inline-flex align-center ga-1">
        <v-icon icon="mdi-coffee" size="small" />
        <span>{{ t('footer.buyMeCoffee') }}</span>
      </a>
      <span>·</span>
      <a :href="licenseUrl" target="_blank" rel="noopener noreferrer" class="footer-link d-inline-flex align-center ga-1">
        <v-icon icon="mdi-license" size="small" />
        <span>{{ t('footer.license') }}</span>
      </a>
    </div>
    <div>
      <i18n-t keypath="footer.madeWith" tag="span" scope="global">
        <template #heart>
          <v-icon icon="mdi-heart" size="x-small" color="primary" />
        </template>
        <template #author>
          <a href="https://mayconjesus.dev" target="_blank" rel="noopener noreferrer" class="footer-link">Maycon Jesus</a>
        </template>
      </i18n-t>
    </div>
  </v-footer>
</template>

<style lang="scss" scoped>
.footer-link {
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
