<template>
  <div style="display:inline-block;">
    <label class="radio-label">适应列宽: </label>
    <el-radio-group v-model="autoWidth">
      <el-radio :label="true">
        是
      </el-radio>
      <el-radio :label="false">
        否
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    autoWidth: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
