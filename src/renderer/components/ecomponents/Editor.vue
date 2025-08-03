<template>
  <textarea class="text-area" ref="editor" :value="input" @input="$emit('update', $event)" @scroll="$emit('scroll')" @focus="$emit('focus')"></textarea>
</template>

<script>
export default {
  props: ['input']
};
</script>