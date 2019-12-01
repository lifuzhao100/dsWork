<template>
	<div id='page-record' v-loading="loading">
		<el-button
			size="small"
			type="primary"
			@click="openAddDialog"
		>
			登记工时
		</el-button>
		<el-table
			:data="tableData"
			style="width: 100%">
			<el-table-column
				v-for="column in columns"
				:key="column.key"
				:prop="column.classes"
				:label="column.label"
				:show-overflow-tooltip="column.overflow"
			>
			</el-table-column>
		</el-table>
		<el-pagination
			background
			:hide-on-single-page="true"
			layout="prev, pager, next"
			:total="total"
			:page-size.sync="size"
			:current-page.sync="form.page"
			@current-change="search"
		>
		</el-pagination>
		<record-add/>
	</div>
</template>

<script>
  /**
   * @Author: lifuzhao
   * @Date: 2019-11-28 00:18
   * @Project: dsWork
   */
  import request from 'superagent'
  import cheerio from 'cheerio'
  import {timeEntriesUrl, filterUrl} from "../../config/constant";
  import qs from 'qs'
  import recordAdd from './parts/add'

  export default {
    name: "index",
    components: {
      recordAdd
    },
    data() {
      return {
        columns: [{
          label: '项目',
          classes: 'project',
          key: 'project'
        }, {
          label: '日期',
          classes: 'spent_on',
          key: 'spent_on'
        }, {
          label: '用户',
          classes: 'user',
          key: 'user'
        }, {
          label: '活动',
          classes: 'activity',
          key: 'activity'
        }, {
          label: '问题',
          classes: 'issue',
          key: 'issue'
        }, {
          label: '注释',
          classes: 'comments',
          key: 'comments',
          overflow: true
        }, {
          label: '小时',
          classes: 'hours',
          key: 'hours'
        }, {
          label: '执行部门',
          classes: 'project_cf_18',
          key: 'project.cf_18',
          overflow: true
        }],
        form: {
          page: 1
        },
        tableData: [],
        size: 10,
        total: 0,
        loading: false
      }
    },
    computed: {
      params() {
        let {page} = this.form
        return {
          c: this.columns.map(column => column.key),
          f: ['user_id', ''],
          group_by: '',
          op: {
            user_id: '='
          },
          page: page,
          set_filter: 1,
          sort: 'spent_on:desc',
          t: ['hours', ''],
          utf8: '✓',
          v: {
            user_id: ['me']
          }
        }
      }
    },
    mounted() {
      this.search(1)
    },
    methods: {
      search(page) {
        this.form.page = page
        this.getList()
      },
      async getList() {
        this.loading = true
        request.get(timeEntriesUrl)
          .query(qs.stringify(this.params, {arrayFormat: 'brackets'}))
          .end((err, res) => {
            this.loading = false
            let list = [],
              total = 0,
              size = 10
            if (!err) {
              let $ = cheerio.load(res.text)
              let pagination = $('.pagination')
              $('.items', pagination).text().replace(/[0-9]+(?=\))/, function ($1) {
	              total = parseInt($1)
              })
              size = $('.selected', pagination).text()
              $('.time-entry', '.time-entries tbody').each((index, tr) => {
                let item = {}
                this.columns.forEach(column => {
                  let tds = $('.' + column.classes, tr)
                  item[column.classes] = tds.text()
                })
                list.push(item)
              })
            }
            this.tableData = list
            this.total = parseInt(total)
            this.size = parseInt(size)
          })
      },
      openAddDialog() {
        this.$router.push({
	        path: '/record/add'
        })
        // this.$bus.$emit('dialog_record-add')
      }
    }
  }
</script>

<style lang='less'>
	#page-record {

	}
</style>
