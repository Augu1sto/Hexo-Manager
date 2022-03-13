<template>
  <div id="app">
    <el-row :gutter="20">
      <el-col :span="12">
        <textarea :value="input" @input="update" id="markdown"></textarea>
      </el-col>
      <el-col :span="12"><div v-html="compiledMarkdown"></div></el-col>
    </el-row>
  </div>
</template>

<script>
import { marked } from 'marked'
export default {
  name: 'editor-page',
  data () {
    return {
      input: ''
    }
  },
  computed: {
    compiledMarkdown: function () {
      return marked(this.input, { sanitize: true }) // sanitize过滤掉html标签，防止xss攻击
    }
  },
  methods: {
    update (e) {
      this.input = e.target.value
    }
  }
}
</script>

<style>
textarea {
  border: none;
  border: 1px solid rgb(216, 216, 216);
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 20px;
  color: rgb(12, 107, 98);
  font-family: 'Monaco', courier, monospace;
  padding: 20px;
  min-height: -webkit-fill-available;
  width: 80%;
}

el-row {
  min-height: -webkit-fill-available;
}
</style>
