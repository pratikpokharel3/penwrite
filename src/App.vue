<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { useWindowSize } from "@vueuse/core"
import { EditorView } from "@codemirror/view"
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { javascript } from "@codemirror/lang-javascript"
import { oneDark } from "@codemirror/theme-one-dark"

import { getElementWidthAndHeight } from "./helpers/elementWidthAndHeight"
import type { Settings } from "./types"

import Appbar from "./components/Appbar.vue"
import Editor from "./components/Editor.vue"
import SettingsModal from "./components/SettingsModal.vue"

import HTMLSVG from "./assets/html.svg"
import CSSSVG from "./assets/css.svg"
import JSSVG from "./assets/javascript.svg"

const { width: screenWidth } = useWindowSize()

const htmlEditorWidth = ref(0)
const cssEditorWidth = ref(0)
const jsEditorWidth = ref(0)
const sectionOneHeight = ref(0)
const sectionTwoHeight = ref(0)
const isIFrameCollaspsed = ref(false)
const htmlContent = ref("")
const cssContent = ref("")
const jsContent = ref("")
const srcDoc = ref("")
const settingsModal = ref(false)
const settings = ref<Settings>()
const isEditorReady = ref(false)
const selectedTab = ref("html")

const htmlExtensions = [EditorView.lineWrapping, oneDark, html()]
const cssExtensions = [EditorView.lineWrapping, oneDark, css()]
const jsExtensions = [EditorView.lineWrapping, oneDark, javascript()]

let codeHandleBarOne: HTMLElement | null
let codeHandleBarTwo: HTMLElement | null
let bottomNavHandle: HTMLElement | null

onMounted(() => {
  window.addEventListener("resize", handleLayoutResize)

  handleLayoutResize()

  handleAppSettings()

  codeHandleBarOne = document.getElementById("html-css-handle-bar")
  codeHandleBarTwo = document.getElementById("css-js-handle-bar")
  bottomNavHandle = document.getElementById("bottom-handle-bar")

  codeHandleBarOne?.addEventListener("mousedown", handleHTMLCSSBarScroll)
  codeHandleBarTwo?.addEventListener("mousedown", handleCSSJSBarScroll)
  bottomNavHandle?.addEventListener("mousedown", handleBottomNavScroll)

  isEditorReady.value = true
})

const editorHeight = computed(() => {
  const editorHeader = getElementWidthAndHeight("html-editor-header")
  const mobileNavHeader = getElementWidthAndHeight("mobile-nav-header")

  return sectionOneHeight.value - editorHeader.height - mobileNavHeader.height
})

watch(
  [htmlContent, cssContent, jsContent],
  () => {
    runCode()
  },
  {
    once: true
  }
)

watch([htmlContent, cssContent, jsContent], () => {
  if (settings.value?.auto_update) {
    runCode()
  }

  if (settings.value?.auto_save) {
    const data: Settings = {
      ...settings.value,
      code: {
        html: htmlContent.value,
        css: cssContent.value,
        js: jsContent.value
      }
    }

    localStorage.setItem("codeforge", JSON.stringify(data))
  }
})

function handleAppSettings() {
  const codeforge = localStorage.getItem("codeforge")

  if (codeforge) {
    settings.value = JSON.parse(codeforge)

    htmlContent.value = settings.value!.code.html
    cssContent.value = settings.value!.code.css
    jsContent.value = settings.value!.code.js

    return
  }

  settings.value = {
    auto_save: true,
    auto_update: true,
    code: {
      html: "",
      css: "",
      js: ""
    }
  }

  localStorage.setItem("codeforge", JSON.stringify(settings.value))
}

function runCode() {
  srcDoc.value = `<!DOCTYPE html>
  <head>
    <style>${cssContent.value}</style>
  </head>
  <body>
    ${htmlContent.value}
    <script>${jsContent.value}<\/script>
  </body>
</html>`
}

function handleLayoutResize() {
  const htmlCSSHandleBarEl = getElementWidthAndHeight("html-css-handle-bar")
  const headerEl = getElementWidthAndHeight("header")
  const bottomHandleBarEl = getElementWidthAndHeight("bottom-handle-bar")
  const footerEl = getElementWidthAndHeight("footer")

  htmlEditorWidth.value =
    (window.innerWidth - 2 * htmlCSSHandleBarEl.width - 16) / 3
  cssEditorWidth.value = htmlEditorWidth.value
  jsEditorWidth.value = htmlEditorWidth.value

  sectionOneHeight.value = window.innerHeight / 2
  sectionTwoHeight.value =
    sectionOneHeight.value -
    headerEl.height -
    bottomHandleBarEl.height -
    footerEl.height
}

function handleHTMLCSSBarScroll(e: MouseEvent) {
  const startX = e.clientX
  const initialWidth = htmlEditorWidth.value

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)

    document.body.classList.remove("select-none")
    document.body.style.cursor = "auto"
  }

  const handleMouseMove = (e: MouseEvent) => {
    document.body.classList.add("select-none")
    document.body.style.cursor = "e-resize"

    const deltaX = startX - e.clientX
    const newWidth = initialWidth - deltaX

    const htmlCSSHandleBarEl = getElementWidthAndHeight("html-css-handle-bar")
    const cssJSHandleBarEl = getElementWidthAndHeight("css-js-handle-bar")

    if (newWidth <= 0) {
      return
    }

    cssEditorWidth.value =
      window.innerWidth -
      htmlCSSHandleBarEl.width -
      cssJSHandleBarEl.width -
      jsEditorWidth.value -
      newWidth -
      16

    if (cssEditorWidth.value <= 0) {
      return
    }

    htmlEditorWidth.value = newWidth
  }

  document.addEventListener("mousemove", handleMouseMove)
  document.addEventListener("mouseup", handleMouseUp)
}

function handleCSSJSBarScroll(e: MouseEvent) {
  const startX = e.clientX
  const initialWidth = jsEditorWidth.value

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)

    document.body.classList.remove("select-none")
    document.body.style.cursor = "auto"
  }

  const handleMouseMove = (e: MouseEvent) => {
    document.body.classList.add("select-none")
    document.body.style.cursor = "e-resize"

    const deltaX = startX - e.clientX
    const newWidth = initialWidth + deltaX

    const htmlCSSHandleBarEl = getElementWidthAndHeight("html-css-handle-bar")
    const cssJSHandleBarEl = getElementWidthAndHeight("css-js-handle-bar")

    if (newWidth <= 0) {
      return
    }

    cssEditorWidth.value =
      window.innerWidth -
      htmlCSSHandleBarEl.width -
      cssJSHandleBarEl.width -
      htmlEditorWidth.value -
      newWidth -
      16

    if (cssEditorWidth.value <= 0) {
      return
    }

    jsEditorWidth.value = newWidth
  }

  document.addEventListener("mousemove", handleMouseMove)
  document.addEventListener("mouseup", handleMouseUp)
}

function handleBottomNavScroll(e: MouseEvent) {
  const startY = e.clientY
  const initialHeight = sectionTwoHeight.value

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)

    document.body.classList.remove("select-none")
    document.body.style.cursor = "auto"
  }

  const handleMouseMove = (e: MouseEvent) => {
    document.body.classList.add("select-none")
    document.body.style.cursor = "e-resize"

    const deltaY = startY - e.clientY
    const newHeight = initialHeight + deltaY

    const header = getElementWidthAndHeight("header")
    const bottomHandleBar = getElementWidthAndHeight("bottom-handle-bar")
    const footer = getElementWidthAndHeight("footer")

    if (window.innerHeight - newHeight < 270) {
      return
    }

    if (isIFrameCollaspsed.value && newHeight >= 2) {
      isIFrameCollaspsed.value = false
    }

    if (!isIFrameCollaspsed.value && newHeight < 2) {
      sectionOneHeight.value =
        window.innerHeight -
        header.height -
        bottomHandleBar.height -
        footer.height

      sectionTwoHeight.value = 0

      isIFrameCollaspsed.value = true

      handleMouseUp()

      return
    }

    sectionOneHeight.value =
      window.innerHeight -
      header.height -
      bottomHandleBar.height -
      footer.height -
      newHeight

    sectionTwoHeight.value = newHeight
  }

  document.addEventListener("mousemove", handleMouseMove)
  document.addEventListener("mouseup", handleMouseUp)
}
</script>

<template>
  <Teleport to="body">
    <SettingsModal
      v-model:settings="settings"
      v-model:modal="settingsModal"
      v-if="settingsModal"
    />
  </Teleport>

  <Appbar @run-code="runCode" v-model="settingsModal" />

  <main>
    <div
      class="hidden border-y border-slate bg-secondary pl-4 sm:flex"
      :style="{ height: sectionOneHeight + 'px' }"
    >
      <div
        class="relative border-x border-slate"
        :style="{ width: htmlEditorWidth + 'px' }"
      >
        <div id="html-editor-header" class="absolute left-0 top-0 flex">
          <div
            class="editor-no-collapse"
            :class="{
              'editor-collapse': isEditorReady && htmlEditorWidth < 110,
              'editor-no-collapse-transition':
                isEditorReady && htmlEditorWidth > 110
            }"
          >
            <HTMLSVG />
            HTML
          </div>
        </div>

        <div class="mt-[38px]">
          <Editor
            :extensions="htmlExtensions"
            :editor-height="editorHeight"
            v-model="htmlContent"
          />
        </div>
      </div>

      <div id="html-css-handle-bar" class="w-4 cursor-col-resize"></div>

      <div
        class="relative border-x border-slate"
        :style="{ width: cssEditorWidth + 'px' }"
      >
        <div
          id="css-editor-header"
          class="absolute left-0 top-0 flex bg-secondary"
        >
          <div
            class="editor-no-collapse"
            :class="{
              'editor-collapse': isEditorReady && cssEditorWidth < 110,
              'editor-no-collapse-transition':
                isEditorReady && cssEditorWidth > 110
            }"
          >
            <CSSSVG />
            CSS
          </div>
        </div>

        <div class="mt-[38px]">
          <Editor
            :extensions="cssExtensions"
            :editor-height="editorHeight"
            v-model="cssContent"
          />
        </div>
      </div>

      <div id="css-js-handle-bar" class="w-4 cursor-col-resize"></div>

      <div
        class="relative border-l border-slate"
        :style="{ width: jsEditorWidth + 'px' }"
      >
        <div
          id="js-editor-header"
          class="absolute left-0 top-0 flex bg-secondary"
        >
          <div
            class="editor-no-collapse"
            :class="{
              'editor-collapse': isEditorReady && jsEditorWidth < 110,
              'editor-no-collapse-transition':
                isEditorReady && jsEditorWidth > 110
            }"
          >
            <JSSVG />
            <span class="ml-1">JS</span>
          </div>
        </div>

        <div class="mt-[38px]">
          <Editor
            :extensions="jsExtensions"
            :editor-height="editorHeight"
            v-model="jsContent"
          />
        </div>
      </div>
    </div>

    <div class="bg-primary sm:hidden">
      <div
        id="mobile-nav-header"
        class="flex gap-x-0.5 border-t border-slate px-3 pt-1"
      >
        <div
          class="bg-[#2c303a] px-5 pb-1 pt-1.5 text-white"
          :class="{ 'bg-tertiary': selectedTab === 'html' }"
          @click="selectedTab = 'html'"
        >
          HTML
        </div>

        <div
          class="bg-[#2c303a] px-5 pb-1 pt-1.5 text-white"
          :class="{ 'bg-tertiary': selectedTab === 'css' }"
          @click="selectedTab = 'css'"
        >
          CSS
        </div>

        <div
          class="bg-[#2c303a] px-5 pb-1 pt-1.5 text-white"
          :class="{ 'bg-tertiary': selectedTab === 'js' }"
          @click="selectedTab = 'js'"
        >
          JS
        </div>
      </div>

      <div class="bg-[#282C34]">
        <div
          :style="{ width: screenWidth + 'px' }"
          v-show="selectedTab === 'html'"
        >
          <Editor
            :extensions="htmlExtensions"
            :editor-height="editorHeight"
            v-model="htmlContent"
          />
        </div>

        <div
          :style="{ width: screenWidth + 'px' }"
          v-show="selectedTab === 'css'"
        >
          <Editor
            :extensions="cssExtensions"
            :editor-height="editorHeight"
            v-model="cssContent"
          />
        </div>

        <div
          :style="{ width: screenWidth + 'px' }"
          v-show="selectedTab === 'js'"
        >
          <Editor
            :extensions="jsExtensions"
            :editor-height="editorHeight"
            v-model="jsContent"
          />
        </div>
      </div>
    </div>

    <div
      id="bottom-handle-bar"
      class="h-8 cursor-row-resize border-t border-gray-900 bg-secondary"
    ></div>

    <iframe class="w-full" :srcdoc="srcDoc" :height="sectionTwoHeight"></iframe>
  </main>

  <footer id="footer" class="bg-grill px-2 pb-1.5 pt-2 text-xs text-white">
    <a target="_blank" href="https://github.com/pratikpokharel3/codeforge">
      <span class="bg-lead rounded-sm px-1.5 py-0.5">Github</span>
    </a>
  </footer>
</template>

<style>
.editor-no-collapse {
  display: flex;
  align-items: center;
  column-gap: 4px;
  border-top: 4px solid #383a42;
  padding: 4px 12px 6px 8px;
  font-weight: bold;
  color: #9ca3af;
  background-color: #282c34;
}

.editor-no-collapse-transition {
  transition: ease-out 0.1s;
}

.editor-no-collapse svg {
  width: 18px;
  height: 18px;
}

.editor-collapse {
  transform: rotate(90deg);
  transform-origin: left;
  transition: ease-out 0.1s;
  position: absolute;
  top: -8px;
  left: -9px;
  font-size: 10px;
  border-top: 0;
  padding: 0 2px;
  background-color: #060606;
}

.editor-collapse svg {
  width: 12px;
  height: 12px;
}
</style>
