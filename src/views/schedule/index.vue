<template>
	<div id='page-schedule'>
		<el-button
			size="small"
			type="primary"
			@click="openAddDialog"
		>
			新增定时
		</el-button>
		<el-button
			size="small"
			type="danger"
			@click="deleteAll"
		>
			清空列表
		</el-button>
		<el-table
			:data="scheduleListPerPage"
			style="width: 100%">
			<el-table-column
				prop="id"
				label="ID"
				width="60"
			>
			</el-table-column>
			<el-table-column
				prop="name"
				label="名称"
				:show-overflow-tooltip="true"
			>
			</el-table-column>
			<el-table-column
				prop="dates"
				label="日期"
				:show-overflow-tooltip="true"
			>
				<template slot-scope="prop">
					<span>{{prop.row.dates | computedDates}}</span>
				</template>
			</el-table-column>
			<el-table-column
				prop="time"
				label="时间"
			>
			</el-table-column>
			<el-table-column
				prop="actions"
				label="动作"
			>
				<template slot-scope="prop">
					<span>{{prop.row.actions | computedActions}}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="操作"
				width="80"
			>
				<template slot-scope="prop">
					<el-button
						size="mini"
						type="warning"
						@click="deleteOne(prop.row)"
					>
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			background
			:hide-on-single-page="true"
			layout="prev, pager, next"
			:total="total"
			:page-size.sync="size"
			:current-page.sync="page"
			@current-change="changePage"
		>
		</el-pagination>
		<schedule-add/>
	</div>
</template>

<script>
  /**
   * @Author: lifuzhao
   * @Date: 2019-11-28 00:22
   * @Project: dsWork
   */
  import scheduleAdd from './parts/add'
  import {mapState, mapGetters} from 'vuex'
  import {actionsList} from "../../config/constant";

  export default {
    name: "index",
    components: {
      scheduleAdd
    },
    data() {
      return {
        columns: [{
          label: 'ID',
          key: 'id'
        }, {
          label: '名称',
          key: 'name'
        }, {
          label: '日期',
          key: 'dates'
        }, {
          label: '时间',
          key: 'time'
        }, {
          label: '动作',
          key: 'actions'
        }],
        tableData: [{}],
        page: 1,
        size: 10
      }
    },
    computed: {
      ...mapGetters([
        'scheduleList',
        'nextScheduleId'
      ]),
      total() {
        return this.scheduleList.length
      },
      scheduleListPerPage() {
        let page = this.page,
          size = this.size,
          start = (page - 1) * size,
          end = page * size
        let scheduleList = this.scheduleList

        return scheduleList.slice(start, end)
      }
    },
    async mounted() {
    },
    methods: {
      openAddDialog() {
        this.$router.push({
          path: '/schedule/add'
        })
      },
      deleteOne(row){
        this.$confirm(`确认删除 ${row.name} ?`, '清空提示', {}).then(() => {
          this.$store.dispatch('deleteScheduleItem', row.id)
        }).catch(() => {
        })
      },
      deleteAll() {
        this.$confirm('确认清空列表?', '清空提示', {}).then(() => {
          this.$store.dispatch('deleteAllSchedule')
        }).catch(() => {
        })

      },
      changePage(page) {
        this.page = page
      }
    },
    filters: {
      computedDates(dates) {
        return dates.join(',')
      },
      computedActions(actions) {
        return actionsList.filter(action => actions.includes(action.value)).map(action => action.label).join(',')
      }
    }
  }
</script>

<style lang='less'>
	#page-schedule {

	}
</style>
