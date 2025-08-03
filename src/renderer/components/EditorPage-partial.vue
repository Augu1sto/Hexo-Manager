<template>
    <el-main class="editor">
      <textarea
        class="text-area"
        ref="editor"
        :value="input"
        @input="update"
        @scroll="onEditorScroll"
        @focus="focusedArea = 'editor'"
      ></textarea>
      <div
        class="html-area"
        ref="previewContainer"
        @scroll="onPreviewScroll"
        @mouseenter="focusedArea = 'preview'"
        @mouseleave="focusedArea = 'editor'"
      >
        <div
          v-for="(block, index) in compiledParagraphs"
          :key="index"
          :ref="'preview-block-' + index"
          v-html="block"
          class="preview-block"
        ></div>
      </div>
    </el-main>
  </template>
  
  <script>
  import { marked } from 'marked'
  import * as DOMPurify from 'dompurify'
  
  export default {
    data() {
      return {
        input: '',
        focusedArea: 'editor', // 当前焦点（editor / preview）
        lineToParagraphMap: [], // 每行对应的段落索引映射
        paragraphHTMLCache: [], // 缓存渲染结果
      }
    },
    computed: {
      compiledParagraphs() {
        // 按段落拆分并用marked转成html
        let clean = DOMPurify.sanitize(this.input)
        let blocks = clean.split(/\n\s*\n/) // 按空行分段
        return blocks.map((l) => marked(l))
      },
    },
    methods: {
      buildLineToParagraphMap(content) {
        // 生成从行号到段落索引的映射
        const lines = content.split('\n')
        const map = []
        let paragraphIndex = 0
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (line === '' && i < lines.length - 1 && lines[i + 1].trim() !== '') {
            paragraphIndex++
          }
          map.push(paragraphIndex)
        }
        return map
      },
  
      update(e) {
        this.input = e.target.value
        this.lineToParagraphMap = this.buildLineToParagraphMap(this.input)
      },
  
      onEditorScroll(e) {
        if (this.focusedArea !== 'editor') return
        const scrollTop = e.target.scrollTop
        const approxLineHeight = 20
        const currentLine = Math.floor(scrollTop / approxLineHeight)
        const paragraphIndex = this.lineToParagraphMap[currentLine]
        if (typeof paragraphIndex === 'number') {
          this.scrollPreviewTo(paragraphIndex)
        }
      },
  
      scrollPreviewTo(paragraphIndex) {
        this.$nextTick(() => {
          const el = this.$refs[`preview-block-${paragraphIndex}`]
          if (el && el[0]) {
            el[0].scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        })
      },
  
      onPreviewScroll(e) {
        if (this.focusedArea !== 'preview') return
        const scrollTop = e.target.scrollTop
        const blocks = this.$refs.previewContainer.querySelectorAll('.preview-block')
        let foundIndex = 0
        for (let i = 0; i < blocks.length; i++) {
          const el = blocks[i]
          const offset = el.offsetTop
          if (offset > scrollTop) break
          foundIndex = i
        }
        const lineIndex = this.lineToParagraphMap.indexOf(foundIndex)
        if (lineIndex !== -1) {
          const approxLineHeight = 20
          const scrollTarget = lineIndex * approxLineHeight
          this.$refs.editor.scrollTop = scrollTarget
        }
      },
    },
  }
  </script>
  