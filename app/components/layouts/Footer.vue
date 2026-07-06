<script setup lang="ts">
const { t } = useI18n()
const { public: { version, githubUrl, licenseUrl, buyMeCoffeeUrl } } = useRuntimeConfig()

const stickerStrip = ['green', 'white', 'red', 'yellow', 'blue', 'orange', 'white', 'green', 'yellow', 'red', 'orange', 'blue']

const cubeFaces = ['front', 'back', 'right', 'left', 'top', 'bottom']
</script>

<template>
  <v-footer class="cube-footer d-flex flex-column align-center ga-1 pt-6 pb-4 text-caption text-medium-emphasis">
    <div class="sticker-strip" aria-hidden="true">
      <span
        v-for="(color, i) in stickerStrip"
        :key="i"
        class="sticker-strip__sticker"
        :style="{ backgroundColor: `var(--c-${color})` }"
      />
    </div>

    <div class="d-flex align-center flex-wrap justify-center ga-2">
      <span>v{{ version }}</span>
      <span class="sticker-dot" :style="{ backgroundColor: 'var(--c-red)' }" aria-hidden="true" />
      <a
        :href="githubUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="footer-link d-inline-flex align-center ga-1"
        :style="{ '--accent': 'var(--c-blue)' }"
      >
        <v-icon icon="mdi-github" size="small" />
        <span>GitHub</span>
      </a>
      <span class="sticker-dot" :style="{ backgroundColor: 'var(--c-yellow)' }" aria-hidden="true" />
      <a
        :href="buyMeCoffeeUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="footer-link d-inline-flex align-center ga-1"
        :style="{ '--accent': 'var(--c-orange)' }"
      >
        <v-icon icon="mdi-coffee" size="small" />
        <span>{{ t('footer.buyMeCoffee') }}</span>
      </a>
      <span class="sticker-dot" :style="{ backgroundColor: 'var(--c-blue)' }" aria-hidden="true" />
      <a
        :href="licenseUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="footer-link d-inline-flex align-center ga-1"
        :style="{ '--accent': 'var(--c-green)' }"
      >
        <v-icon icon="mdi-license" size="small" />
        <span>{{ t('footer.license') }}</span>
      </a>
    </div>

    <div class="d-flex align-center justify-center ga-2 mt-1">
      <div class="mini-cube" aria-hidden="true">
        <div class="mini-cube__inner">
          <div
            v-for="face in cubeFaces"
            :key="face"
            class="mini-cube__face"
            :class="`mini-cube__face--${face}`"
          />
        </div>
      </div>
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
.cube-footer {
  // Cores de sticker estilo WCA, apenas decorativas (a engine usa lib/cube ColorHex)
  --c-white: #f5f5f5;
  --c-yellow: #ffd500;
  --c-green: #009b48;
  --c-blue: #0045ad;
  --c-red: #b71234;
  --c-orange: #ff5800;

  position: relative;
}

.sticker-strip {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 3px;
  padding: 0 3px;

  &__sticker {
    flex: 1;
    height: 4px;
    border-radius: 0 0 2px 2px;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
  }
}

.sticker-dot {
  width: 7px;
  height: 7px;
  border-radius: 2px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);
}

.footer-link {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--accent, currentColor);
  }
}

.mini-cube {
  width: 22px;
  height: 22px;
  perspective: 120px;

  &__inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    animation: cube-tumble 14s linear infinite;
  }

  &__face {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(0, 0, 0, 0.8);
    border-radius: 2px;
    // Linhas do "plástico" desenhando a grade 3x3 de cada face
    background-image:
      linear-gradient(to right, rgba(0, 0, 0, 0.8) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 1px, transparent 1px);
    background-size: calc(100% / 3) calc(100% / 3);

    &--front { background-color: var(--c-green); transform: rotateY(0deg) translateZ(11px); }
    &--back { background-color: var(--c-blue); transform: rotateY(180deg) translateZ(11px); }
    &--right { background-color: var(--c-red); transform: rotateY(90deg) translateZ(11px); }
    &--left { background-color: var(--c-orange); transform: rotateY(-90deg) translateZ(11px); }
    &--top { background-color: var(--c-white); transform: rotateX(90deg) translateZ(11px); }
    &--bottom { background-color: var(--c-yellow); transform: rotateX(-90deg) translateZ(11px); }
  }
}

@keyframes cube-tumble {
  from {
    transform: rotateX(-25deg) rotateY(0deg);
  }

  to {
    transform: rotateX(-25deg) rotateY(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mini-cube__inner {
    animation: none;
    transform: rotateX(-25deg) rotateY(35deg);
  }
}
</style>
