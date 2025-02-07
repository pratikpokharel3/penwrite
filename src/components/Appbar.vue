<script setup lang="ts">
import PrimaryButton from "./PrimaryButton.vue"

defineEmits(["runCode"])

const settingsModal = defineModel<boolean>()
</script>

<template>
  <nav
    id="header"
    class="flex items-center justify-between bg-primary px-3 py-2 text-white md:items-stretch"
  >
    <div class="flex shrink-0 items-center gap-x-2">
      <i class="fa-solid fa-code text-2xl"></i>

      <div>
        <div class="text-xl font-bold">CodeForge</div>
        <div class="text-sm text-gray-300">A Codepen Clone</div>
      </div>
    </div>

    <div class="flex gap-2">
      <PrimaryButton
        class="bg-green-600 hover:bg-green-700"
        @click="$emit('runCode')"
      >
        Run Code
      </PrimaryButton>

      <PrimaryButton
        class="flex items-center gap-x-1.5"
        @click="settingsModal = true"
      >
        <i class="fa-solid fa-gear"></i>
        Settings
      </PrimaryButton>
    </div>
  </nav>
</template>
