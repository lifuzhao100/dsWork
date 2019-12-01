<template>
	<el-dialog
		id="schedule-add"
		title="新增定时"
		:visible.sync="dialogVisible"
		width="65%"
		:beforeClose="beforeClose"
	>
		<el-form
			ref="form"
			:rules="rules"
			:model="form"
			label-width="60px">
			<el-form-item label="名称" prop="name" :rules="[{required: true, message:'请输入名称'}]">
				<el-input
					v-model="form.name"
					size="small"
					placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item label="日期" prop="dates">
				<el-select
					v-model="form.dates"
					multiple
					collapse-tags
					size="small"
					placeholder="日期">
					<el-option
						v-for="item in dateList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						<span style="float: left">{{ item.label }}</span>
						<span style="float: right; color: #8492a6; font-size: 13px;margin-right: 20px">{{ item.day }}</span>
					</el-option>
				</el-select>
				<div class="tag-container">
					<el-tag
						v-for="(date, index) in form.dates"
						:key="date"
						type="warning"
						closable
						@close="deleteDate(index)"
					>{{date}}
					</el-tag>
				</div>
			</el-form-item>
			<el-form-item label="时间" prop="time">
				<el-time-select
					v-model="form.time"
					size="small"
					:picker-options="pickerOptions"
					placeholder="选择时间">
				</el-time-select>
			</el-form-item>
			<el-form-item label="动作" prop="actions" :rules="[{validator: validateActions}]">
				<el-checkbox-group
					v-model="form.actions"
					:min="1"
					size="small"
				>
					<el-checkbox v-for="action in actionsList" :label="action.value" :key="action.value">{{action.label}}
					</el-checkbox>
				</el-checkbox-group>
				<template v-if="showRecordAddButton">
					<el-button size="mini" @click="openRecordAddDialog">登记工时配置</el-button>
					<el-table
						size="mini"
						:data="configTableData"
						style="width: 100%">
						<template slot="empty">
							<span></span>
						</template>
						<el-table-column
							v-for="column in columns"
							:key="column.key"
							:prop="column.key"
							:label="column.label"
							:show-overflow-tooltip="true"
						>
						</el-table-column>
					</el-table>
				</template>
			</el-form-item>
		</el-form>
		<record-add :is-nested="true" @submit="updateTimeEntryConfig"/>
		<span slot="footer" class="dialog-footer">
	    <el-button
		    size="small"
		    @click="dialogVisible = false"
	    >
		    取消
	    </el-button>
	    <el-button
		    size="small"
		    type="primary"
		    @click="addSchedule"
	    >
		    确定
	    </el-button>
	  </span>
	</el-dialog>
</template>

<script>
  /**
   * @Author: lifuzhao
   * @Date: 2019-11-28 00:25
   * @Project: dsWork
   */
  import recordAdd from '../../record/parts/add'
  import dayjs from 'dayjs'
  import {actionsList} from "../../../config/constant";

  const columns = [{
    label: '项目',
    key: 'projectName'
  }, {
    label: '问题',
    key: 'issue_id'
  }, {
    label: '小时',
    key: 'hours'
  }, {
    label: '注释',
    key: 'comments'
  }, {
    label: '活动',
    key: 'activityName'
  }]
  export default {
    name: "add",
    components: {
      recordAdd
    },
    data() {
      return {
        dialogVisible: false,
        actionsList: actionsList,
        columns: columns,
        dateList: [],
        configTableData: [],
        rules: {
          name: [{required: true, message: '请输入名称'}],
          dates: [{required: true, message: '请选择日期'}],
          time: [{required: true, message: '请选择时间'}]
        },
        form: this.getDefaultForm(),
        pickerOptions: {
          start: '09:00',
          step: '00:15',
          end: '23:45'
        }
      }
    },
    computed: {
      showRecordAddButton() {
        return this.form.actions.includes('addTimeEntry')
      },
    },
    watch: {
      $route: {
        immediate: true,
        deep: true,
        handler({params}) {
          if (params.scheduleOperate === 'add') {
            this.dialogVisible = true
          }
        }
      },
      dialogVisible: {
        immediate: true,
        handler(flag) {
          let ref = this.$refs.form
          if (ref) {
            ref.clearValidate()
          }
          if (flag) {
            let dateList = []
            let targetWeek = dayjs(),
              tempDate = dayjs()
            while (tempDate.isSame(targetWeek, 'week')) {
              let date = tempDate.format('YYYY-MM-DD')
              dateList.push({
                label: date,
                value: date,
                day: tempDate.format('dddd'),
                isWeekend: tempDate.get('day') === 0 || tempDate.get('day') === 6
              })
              tempDate = tempDate.add(1, 'day')
              if (!tempDate.isSame(targetWeek, 'week') && dateList.length < 4) {
                targetWeek = targetWeek.add(1, 'week')
              }
            }
            this.dateList = dateList
            this.form.dates = dateList.filter(item => !item.isWeekend).map(item => item.value)
          }
        }
      }
    },
    mounted() {
      this.$bus.$on('dialog_schedule-add', () => {
        this.dialogVisible = true
      })
    },
    methods: {
      getDefaultForm() {
        return {
          name: '',
          dates: [],
          time: '18:30',
          actions: actionsList.map(action => action.value)
        }
      },
      deleteDate(index) {
        this.form.dates.splice(index, 1)
      },
      updateTimeEntryConfig(config) {
        this.configTableData = [config]
      },
      openRecordAddDialog() {
        this.$bus.$emit('dialog_record-add')
      },
      // 校验form.actions
      validateActions(rule, actions, callback) {
        let configTableData = this.configTableData
        if (actions.includes('addTimeEntry') && configTableData.length === 0) {
          callback('请先配置自动登记的内容')
        }
        callback()
      },
      addSchedule() {
        this.$refs.form.validate(async valid => {
          console.log('valid', valid)
          if (!valid) return
          await this.$store.dispatch('saveScheduleItem', {
            ...this.form,
            config: this.configTableData[0]
          })
          this.beforeClose()
        })
      },
      beforeClose() {
        let {params} = this.$route
        this.form = this.getDefaultForm()
        this.dialogVisible = false
        console.log('beforeClose params', params)
        if (params.scheduleOperate === 'add') {
          this.$router.replace({
            path: '/schedule'
          })
        }
      }
    }
  }
</script>

<style lang='less'>
	#schedule-add {
		.el-select__tags {
			display: none;
		}

		.tag-container {
			margin-left: -10px;
			margin-right: -50px;

			.el-tag {
				margin-left: 10px;
			}
		}

		.el-table__empty-block {
			display: none;
		}
	}
</style>
