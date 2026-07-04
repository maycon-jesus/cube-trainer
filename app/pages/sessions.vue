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

const solvesBySession = ref<Record<number, Solve[]>>({})
const sessionStats = ref<Record<number, SessionStats>>({})

watch(() => sessionsStore.sessions, async () => {
  for (const session of sessionsStore.sessions) {
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
  return session.id !== undefined && session.id === config.sessionId
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
const formName = ref('')
const formTarget = ref<Session | null>(null)
const saving = ref(false)

function openCreate() {
  formMode.value = 'create'
  formName.value = ''
  formTarget.value = null
  formDialog.value = true
}

function openRename(session: Session) {
  formMode.value = 'rename'
  formName.value = session.name
  formTarget.value = session
  formDialog.value = true
}

async function submitForm() {
  const name = formName.value.trim()
  if (!name) return
  saving.value = true
  try {
    if (formMode.value === 'create') {
      const id = await sessionsStore.add({ name, createdAt: Date.now() })
      config.sessionId = id
    } else if (formTarget.value) {
      await sessionsStore.update({ ...formTarget.value, name })
    }
    formDialog.value = false
  } finally {
    saving.value = false
  }
}

// Delete dialog
const deleteDialog = ref(false)
const deleteTarget = ref<Session | null>(null)
const deleting = ref(false)

function openDelete(session: Session) {
  deleteTarget.value = session
  deleteDialog.value = true
}

async function confirmDelete() {
  const target = deleteTarget.value
  if (!target || target.id === undefined) return
  deleting.value = true
  try {
    const wasCurrent = isCurrent(target)
    await sessionsStore.remove(target.id)
    if (sessionsStore.sessions.length === 0) await sessionsStore.load()
    const first = sessionsStore.sessions[0]
    if (wasCurrent && first?.id !== undefined) config.sessionId = first.id
    deleteDialog.value = false
  } finally {
    deleting.value = false
  }
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
      <v-btn color="primary" rounded="xl" prepend-icon="mdi-plus" @click="openCreate">
        {{ t('sessions.new') }}
      </v-btn>
    </div>

    <!-- Overview -->
    <v-row density="comfortable" class="mb-4">
      <v-col cols="6">
        <v-card variant="tonal" color="primary" rounded="lg">
          <v-card-text class="d-flex align-center ga-4">
            <v-avatar variant="tonal" color="primary">
              <v-icon icon="mdi-folder-multiple-outline" />
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">{{ sessionsStore.sessions.length }}</div>
              <div class="text-body-2">{{ t('sessions.totalSessions') }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card variant="tonal" color="secondary" rounded="lg">
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
      <v-col v-for="session in sessionsStore.sessions" :key="session.id" cols="12" sm="6">
        <v-card
rounded="lg" class="session-card h-100 d-flex flex-column"
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
                <v-list density="compact" rounded="lg">
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
            <v-btn color="primary" variant="text" rounded="xl" @click="openSession(session)">
              {{ t('sessions.open') }}
            </v-btn>
            <v-btn v-if="!isCurrent(session)" variant="text" rounded="xl" @click="setCurrent(session)">
              {{ t('sessions.setCurrent') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create / rename dialog -->
    <v-dialog v-model="formDialog" max-width="440">
      <v-card rounded="xl">
        <v-card-item>
          <template #prepend>
            <v-icon :icon="formMode === 'create' ? 'mdi-plus-circle-outline' : 'mdi-pencil-outline'" color="primary" />
          </template>
          <v-card-title>
            {{ formMode === 'create' ? t('sessions.new') : t('sessions.rename') }}
          </v-card-title>
        </v-card-item>
        <v-card-text>
          <v-text-field
v-model="formName" :label="t('sessions.nameLabel')" variant="outlined" rounded="lg" autofocus
            hide-details @keyup.enter="submitForm" />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn :disabled="saving" @click="formDialog = false">
            {{ t('sessions.cancel') }}
          </v-btn>
          <v-btn
color="primary" variant="flat" rounded="xl" :loading="saving" :disabled="!formName.trim()"
            @click="submitForm">
            {{ formMode === 'create' ? t('sessions.create') : t('sessions.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete confirmation -->
    <v-dialog v-model="deleteDialog" max-width="440" persistent>
      <v-card rounded="xl">
        <v-card-item>
          <template #prepend>
            <v-icon icon="mdi-alert-outline" color="error" />
          </template>
          <v-card-title>{{ t('sessions.deleteConfirmTitle') }}</v-card-title>
        </v-card-item>
        <v-card-text class="text-body-2 text-medium-emphasis">
          {{ t('sessions.deleteConfirmText', { name: deleteTarget?.name ?? '' }) }}
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn :disabled="deleting" @click="deleteDialog = false">
            {{ t('sessions.cancel') }}
          </v-btn>
          <v-btn color="error" variant="flat" rounded="xl" :loading="deleting" @click="confirmDelete">
            {{ t('sessions.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.session-card--current {
  border: 1px solid rgb(var(--v-theme-primary));
}
</style>
