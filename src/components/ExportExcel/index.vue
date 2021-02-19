<template>
  <div>
    <el-dialog title="列表数据导出" :visible.sync="excleForm" width="450px" center close-on-click-modal>
      <FilenameOption v-model="excel.filename" />
      <div style="margin-bottom: 30px;" />
      <BookTypeOption v-model="excel.bookType" />
      <div style="margin-bottom: 30px;" />
      <AutoWidthOption v-model="excel.autoWidth" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="excleForm = false">取消</el-button>
        <el-button type="primary" @click="handleDownload">导出</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { parseTime } from '@/utils'
import AutoWidthOption from './components/AutoWidthOption'
import BookTypeOption from './components/BookTypeOption'
import FilenameOption from './components/FilenameOption'
export default {
  components: {
    AutoWidthOption,
    BookTypeOption,
    FilenameOption
  },
  props: {
    eData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      excleForm: false,
      excel: {
        list: null,
        listLoading: true,
        downloadLoading: false,
        filename: '',
        autoWidth: true,
        bookType: 'xlsx'
      }
    }
  },
  // watch: {
  //   eData: {
  //     handler(newValue, oldValue) {
  //       console.log(newValue, oldValue)
  //     }
  //   }
  // },
  methods: {
    handleDownload() {
      this.excel.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.eData.tHeader
        const filterVal = this.eData.filterVal
        const list = this.eData.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.excel.filename,
          autoWidth: this.excel.autoWidth,
          bookType: this.excel.bookType
        })
        this.excel.downloadLoading = false
        this.excleForm = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'level') {
          // return parseTime(v[j])
          return (v[j] === 3 || v[j] === '3') ? '玩家' : '代理'
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
