<template>
  <div class="html-area" ref="previewContainer" @scroll="$emit('scroll')" @mouseenter="$emit('focus', 'preview')" @mouseleave="$emit('focus', 'editor')">
    <div v-for="(block, index) in compiledParagraphs" :key="index" :ref="'preview-block-' + index" v-html="block" class="preview-block"></div>
  </div>
</template>

<script>
export default {
  props: ['compiledParagraphs']
};
</script>