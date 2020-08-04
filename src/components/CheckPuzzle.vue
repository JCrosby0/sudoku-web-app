<template>
  <el-dialog
    title="Check Puzzle"
    :visible.sync="$parent.showTestResults"
    width="330px"
    @close="hide">
    <el-table :data="checkData" @close="hide">
      <el-table-column
        v-for="col in tableColumns"
        :key="'col'+col.property"
        :property="col.property"
        :label="col.label"
        :width="col.width">
      </el-table-column>
      <el-table-column
        align="center"
        label="Result">
      <template slot-scope="scope">
        <div class="icon-styling">
          <i v-if="scope.row.result" class="el-icon-success success"></i>
          <i v-else class="el-icon-error danger"></i>
        </div>
      </template>
    </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="hide">OK</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: "CheckPuzzle",
  props: {
    testConfig: {
      type: Array,
      required: true,
    },
    show: {
      type: Boolean,
      required: false,
      default: () => true
    }
  },
  data () {
    return {
      showTable: false,
      tableColumns: [
        {
        property: 'description',
        label: 'Description', 
        width: 200
        }
        // },
        // {
        // property: 'result',
        // label: 'Result', 
        // width: 75
        // }
      ]
     }
  },
  watch: {
    show (o, n) {
      this.showTable = n
    },
    showTable (o, n) {
      if (o && !n) {
        this.hide()
      }
    }
  },
  
  computed: {
    checkData () {
      const dataToShow = this.testConfig.filter(test => test.active)
      return dataToShow
    }
  },
  methods: {
    hide() {
      this.$emit('hide')
    }
  }
}
</script>

<style>
.icon-styling {
  font-size: 1.5rem;
}
.danger {
  color: #F56C6C;
}
.success {
  color: #67C23A
}
</style>
