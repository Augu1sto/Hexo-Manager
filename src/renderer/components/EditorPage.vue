<template>
  <div
    class="preview-vditor"
    v-loading="isLoading"
    element-loading-text="正在努力，请稍候..."
  >
    <div id="khaleesi" class="vditor-preview" />
  </div>
</template>

<script>
import Vditor from 'vditor'
import 'vditor/dist/index.css'

export default {
  name: 'editor-page',
  data () {
    return {
      isLoading: true
    }
  },
  mounted () {
    this.initVditor()
  },
  methods: {
    initVditor () {
      const options = {
        width: '61.8%',
        mode: 'sv',
        toolbarConfig: {
          pin: true
        },
        preview: {
          delay: 1000,
          show: true
        }
      }
      this.vditor = new Vditor('khaleesi', options)
      this.$nextTick(() => {
        this.isLoading = false
      })
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
