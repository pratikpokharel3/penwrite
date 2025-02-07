<script setup lang="ts">
import { Codemirror } from "vue-codemirror"
import type { Props } from "vue-codemirror"

defineEmits(["code"])

const code = defineModel<string>()

defineProps<{
  editorHeight: number
  extensions: Props["extensions"]
}>()
</script>

<template>
  <Codemirror
    :extensions="extensions"
    :style="{ height: editorHeight + 'px' }"
    v-model="code"
  />
</template>

<style scoped>
:deep(.cm-scroller) {
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #666b7a #282c34;
}
</style>
