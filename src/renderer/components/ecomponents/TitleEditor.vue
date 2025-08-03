<template>
  <div class="title">
    <div class="title-show" v-if="!titleEditable">
      <div class="title-text">{{ localTitle }}</div>
      <div class="icon el-icon-edit" @click="onEdit"></div>
    </div>
    <div class="title-edit" v-else>
      <el-input v-model="localTitle"></el-input>
      <div class="icon el-icon-check" @click="onConfirm"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TitleEditor',
  props: ['title'],
  data() {
    return {
      localTitle: this.title,
      titleEditable: false
    };
  },
  watch: {
    title(newVal) {
      this.localTitle = newVal;
    }
  },
  methods: {
    onEdit() {
      this.titleEditable = true;
    },
    onConfirm() {
      this.titleEditable = false;
      this.$emit('update:title', this.localTitle); // 传出新标题
      this.$emit('unsaved'); // 通知父组件设置 isSaved = false
    }
  }
}
</script>

<style scope>
.title {
  flex: auto;
  width: calc(100% - 300px);
}

.title-show,
.title-edit {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

.title-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.title .icon {
  font-size: 1.2em;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  width: 30px;
}

.title .icon:hover {
  color: rgba(255, 255, 255);
}

.title-show {
  color: white;
  font-size: 1.5em;
  font-weight: bold;
}

.title-edit .el-input {
  max-width: 100%;
  width: auto;
  font-size: 1.4em;
}
</style>