<script setup lang="ts">
import { useTemplateRef } from "vue"
import { onClickOutside } from "@vueuse/core"

import PrimaryButton from "./PrimaryButton.vue"
import type { Settings } from "../types"

const modal = defineModel<boolean>("modal", { required: true })
const settings = defineModel<Settings | undefined>("settings", {
  required: true
})

const modalRef = useTemplateRef("settings-modal")

onClickOutside(modalRef, () => {
  modal.value = false
})

function saveSettings() {
  localStorage.setItem("codeforge", JSON.stringify(settings.value))
}
</script>

<template>
  <div
    class="absolute left-0 top-0 z-10 h-full w-full bg-black opacity-40"
  ></div>

  <div
    ref="settings-modal"
    class="absolute left-1/2 top-1/2 z-10 mx-auto w-11/12 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-slate bg-secondary text-white md:w-1/2"
  >
    <div class="flex justify-between border-b border-slate px-3 pt-3">
      <div class="border-b-2 border-green-400 pb-2 text-lg font-bold">
        Pen Settings
      </div>

      <button
        type="button"
        class="bg-lead mb-1.5 self-center px-1.5"
        @click="modal = false"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <div class="flex gap-x-5 py-3 pr-3">
      <div class="w-72">
        <div class="bg-smoke cursor-pointer border-l-2 border-green-400 py-0.5">
          <div class="pl-2.5 font-semibold">Behavior</div>
        </div>
      </div>

      <div>
        <div class="border-lead border-l-4 bg-grill p-3">
          <div class="font-semibold">Auto Save</div>

          <div class="text-sm text-gray-400">
            If active, Pens will save code locally in the browser.
          </div>

          <div class="mt-2">
            <label class="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                class="peer sr-only"
                v-model="settings!.auto_save"
                @change="saveSettings"
              />

              <div
                class="peer relative h-6 w-11 rounded-full bg-gray-700 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-green-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-0"
              ></div>

              <span class="ms-3 text-sm font-medium">
                <template v-if="settings?.auto_save">On</template>
                <template v-else>Off</template>
              </span>
            </label>
          </div>
        </div>

        <div class="border-lead mt-3 border-l-4 bg-grill p-3">
          <div class="font-semibold">Auto-Updating Preview</div>

          <div class="text-sm text-gray-400">
            If enabled, the preview panel updates automatically as you code. If
            disabled, use the "Run Code" button to update.
          </div>

          <div class="mt-2">
            <label class="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                class="peer sr-only"
                v-model="settings!.auto_update"
                @change="saveSettings"
              />

              <div
                class="peer relative h-6 w-11 rounded-full bg-gray-700 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-green-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-0"
              ></div>

              <span class="ms-3 text-sm font-medium">
                <template v-if="settings?.auto_update">On</template>
                <template v-else>Off</template>
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="flex h-16 justify-end bg-grill px-3 py-2.5">
      <PrimaryButton
        class="bg-green-600 hover:bg-green-700"
        @click="modal = false"
      >
        Close
      </PrimaryButton>
    </div>
  </div>
</template>
