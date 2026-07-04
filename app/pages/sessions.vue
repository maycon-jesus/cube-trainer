<script setup lang="ts">
import { useConfigStore } from '~/stores/db/config'
import { useSessionsStore, type Session } from '~/stores/db/sessions'
import { useSolvesStore, type Solve } from '~/stores/db/solves'

const { t, locale } = useI18n()
const sessionsStore = useSessionsStore()
const solvesStore = useSolvesStore()
const config = useConfigStore()

type SessionStats = {
  count: number
  best: number | null
  ao5: number | null
  ao12: number | null
  lastActive: number
}

const sessions = ref<Session[]>([])
const solvesBySession = ref<Record<number, Solve[]>>({})
const sessionStats = ref<Record<number, SessionStats>>({})

async function reload(){
  sessions.value = await sessionsStore.getAll()
}

onBeforeMount(async()=>{
  await reload()
})

watch(sessions, async () => {
  for (const session of sessions.value) {
    const solves = await solvesStore.getAllBySessionId(session.id!)
    solvesBySession.value[session.id!] = solves

    sessionStats.value[session.id!] = {
      count: solves.length,
      best: bestOf(solves),
      ao5: averageOf(solves, 5),
      ao12: averageOf(solves, 12),
      lastActive: solves[0]?.createdAt ?? session.createdAt,
    }
  }
}, {
  immediate: true,
})

const emptyStats: SessionStats = { count: 0, best: null, ao5: null, ao12: null, lastActive: 0 }

function statsFor(session: Session): SessionStats {
  return (session.id !== undefined && sessionStats.value[session.id]) || emptyStats
}

const dateFormatter = computed(
  () => new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium' }),
)

function formatDate(timestamp: number): string {
  return dateFormatter.value.format(timestamp)
}

function isCurrent(session: Session): boolean {
  return config.sessionId === session.id
}

function setCurrent(session: Session) {
  if (session.id === undefined) return
  config.sessionId = session.id
}

async function openSession(session: Session) {
  setCurrent(session)
  await navigateTo({ name: 'index' })
}

// Create / rename dialog
const formDialog = ref(false)
const formMode = ref<'create' | 'rename'>('create')
const formTarget = ref<Session | null>(null)

function openCreate() {
  formMode.value = 'create'
  formTarget.value = null
  formDialog.value = true
}

function openRename(session: Session) {
  formMode.value = 'rename'
  formTarget.value = session
  formDialog.value = true
}

// Delete dialog
const deleteDialog = ref(false)
const deleteTarget = ref<Session | null>(null)

function openDelete(session: Session) {
  deleteTarget.value = session
  deleteDialog.value = true
}
</script>

<template>
  <v-container class="py-6" style="max-width: 960px">
    <!-- Header -->
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold">{{ t('nav.sessions') }}</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">{{ t('sessions.subtitle') }}</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreate">
        {{ t('sessions.new') }}
      </v-btn>
    </div>

    <!-- Overview -->
    <v-row density="comfortable" class="mb-4">
      <v-col cols="6">
        <v-card variant="tonal" color="primary">
          <v-card-text class="d-flex align-center ga-4">
            <v-avatar variant="tonal" color="primary">
              <v-icon icon="mdi-folder-multiple-outline" />
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">{{ sessions.length }}</div>
              <div class="text-body-2">{{ t('sessions.totalSessions') }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card variant="tonal" color="secondary">
          <v-card-text class="d-flex align-center ga-4">
            <v-avatar variant="tonal" color="secondary">
              <v-icon icon="mdi-timer-outline" />
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">{{ solvesStore.solves.length }}</div>
              <div class="text-body-2">{{ t('sessions.totalSolves') }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Session cards -->
    <v-row density="comfortable">
      <v-col v-for="session in sessions" :key="session.id" cols="12" sm="6">
        <v-card
 class="session-card h-100 d-flex flex-column"
          :class="{ 'session-card--current': isCurrent(session) }">
          <v-card-item>
            <template #prepend>
              <v-avatar variant="tonal" :color="isCurrent(session) ? 'primary' : undefined">
                <v-icon icon="mdi-cube-outline" />
              </v-avatar>
            </template>
            <v-card-title class="d-flex align-center ga-2">
              <span class="text-truncate">{{ session.name }}</span>
              <v-chip v-if="isCurrent(session)" color="primary" size="x-small" variant="flat">
                {{ t('sessions.current') }}
              </v-chip>
            </v-card-title>
            <v-card-subtitle>
              {{ t('sessions.lastActive', { date: formatDate(statsFor(session).lastActive) }) }}
            </v-card-subtitle>
            <template #append>
              <v-menu>
                <template #activator="{ props: menuProps }">
                  <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="menuProps" />
                </template>
                <v-list density="compact">
                  <v-list-item
prepend-icon="mdi-check-circle-outline" :disabled="isCurrent(session)"
                    @click="setCurrent(session)">
                    <v-list-item-title>{{ t('sessions.setCurrent') }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-pencil-outline" @click="openRename(session)">
                    <v-list-item-title>{{ t('sessions.rename') }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-delete-outline" base-color="error" @click="openDelete(session)">
                    <v-list-item-title>{{ t('sessions.delete') }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-card-item>

          <v-card-text class="pt-0">
            <div class="d-flex text-center">
              <div class="flex-1-1">
                <div class="text-caption text-medium-emphasis">{{ t('sessions.solves') }}</div>
                <div class="text-subtitle-2 font-weight-bold">{{ statsFor(session).count }}</div>
              </div>
              <v-divider vertical class="mx-2" />
              <div class="flex-1-1">
                <div class="text-caption text-medium-emphasis">{{ t('sessions.best') }}</div>
                <div class="text-subtitle-2 font-weight-bold">{{ formatMs(statsFor(session).best) }}</div>
              </div>
              <v-divider vertical class="mx-2" />
              <div class="flex-1-1">
                <div class="text-caption text-medium-emphasis">{{ t('sessions.ao5') }}</div>
                <div class="text-subtitle-2 font-weight-bold">{{ formatMs(statsFor(session).ao5) }}</div>
              </div>
              <v-divider vertical class="mx-2" />
              <div class="flex-1-1">
                <div class="text-caption text-medium-emphasis">{{ t('sessions.ao12') }}</div>
                <div class="text-subtitle-2 font-weight-bold">{{ formatMs(statsFor(session).ao12) }}</div>
              </div>
            </div>
          </v-card-text>

          <v-spacer />

          <v-card-actions>
            <v-btn color="primary" variant="text" @click="openSession(session)">
              {{ t('sessions.open') }}
            </v-btn>
            <v-btn v-if="!isCurrent(session)" variant="text" @click="setCurrent(session)">
              {{ t('sessions.setCurrent') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create / rename dialog -->
    <SessionCreateRenameDialog v-model="formDialog" :form-mode="formMode" :session="formTarget" @updated="reload()" />

    <!-- Delete confirmation -->
    <SessionDeleteDialog v-model="deleteDialog" :target="deleteTarget" @updated="reload()" />
  </v-container>
</template>

<style scoped>
.session-card--current {
  border: 1px solid rgb(var(--v-theme-primary));
}
</style>
