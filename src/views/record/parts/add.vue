<template>
	<el-dialog
		id="record-add"
		title="登记工时"
		:visible.sync="dialogVisible"
		width="65%"
		:beforeClose="beforeClose"
		:append-to-body="true"
	>
		<el-form ref="form" :model="form" label-width="60px">
			<el-form-item
				label="项目"
				prop="project_id"
				:rules="[{required: true,message:'请选择项目'}]"
			>
				<el-select
					v-model="form.project_id"
					:filterable="true"
					@change="selectProject"
					size="small"
					placeholder="请选择项目">
					<el-option
						v-for="item in projectList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="问题">
				<el-input
					v-model="form.issue_id"
					size="small"
					placeholder="请输入问题"></el-input>
			</el-form-item>
			<el-form-item
				v-if="!isNested"
				label="日期"
				prop="spent_on"
				:rules="[{required: true,message:'请选择日期'}]"
			>
				<el-date-picker
					v-model="form.spent_on"
					:clearable="false"
					format="yyyy-MM-dd"
					value-format="yyyy-MM-dd"
					size="small"
					type="date"
					placeholder="请选择日期"></el-date-picker>
			</el-form-item>
			<el-form-item
				label="小时"
				prop="hours"
				:rules="[{required: true,message:'请输入小时'}]"
			>
				<el-input-number
					v-model="form.hours"
					size="small"
					:min="0.1"
					:max="24"
					:step="0.5"
					placeholder="小时"
				></el-input-number>
			</el-form-item>
			<el-form-item label="注释">
				<el-input
					v-model="form.comments"
					size="small"
					placeholder="请输入注释"></el-input>
			</el-form-item>
			<el-form-item
				label="活动"
				prop="activity_id"
				:rules="[{required: true,message:'请选择活动'}]"
			>
				<el-select
					v-model="form.activity_id"
					@change="selectActivity"
					size="small"
					placeholder="请选择活动">
					<el-option
						v-for="item in activitiesList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
	    <el-button
		    size="small"
		    @click="dialogVisible = false"
	    >
		    关闭
	    </el-button>
			<el-button
				size="small"
				type="warning"
				@click="addTimeEntry(true)"
			>
		    再记一条
	    </el-button>
	    <el-button
		    size="small"
		    type="primary"
		    @click="addTimeEntry(false)"
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
  import dayjs from 'dayjs'
  import {Loading} from 'element-ui'

  export default {
    name: "add",
    props: {
      isNested: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogVisible: false,
        projectList: [],
        activitiesList: [],
        token: '',
        form: this.getDefaultForm(),
        id: ''
      }
    },
    computed: {
      params() {
        return {
          utf8: '✓',
          back_url: '',
          commit: '创建',
          time_entry: this.form
        }
      },
    },
    watch: {
      $route: {
        immediate: true,
        deep: true,
        handler(route) {
          if (route.params.recordOperate === 'add') {
            this.dialogVisible = true
          }
        }
      },
      dialogVisible: {
        immediate: true,
        async handler(flag) {
          if (!flag) return
          this.getTimeEntriesNew()
        }
      }
    },
    mounted() {
      let keys = ['project_id', 'activity_id']
      this.$storage.getItems(keys.map(key => ({key: key, defaultValue: ''})))
        .then(result => {
          keys.forEach(key => {
            this.form[key] = result[key]
          })
        })
      this.$bus.$on('dialog_record-add', (row) => {
        let form = this.getDefaultForm()
        if (row) {
          this.$nextTick(async () => {
            await this.getTimeEntriesNew()
            Object.keys(form).forEach(key => {
              form[key] = row[key]
            })
            let projectList = this.projectList,
              activitiesList = this.activitiesList
            projectList.find(project => {
              if (project.label === row.project) {
                form.project_id = project.value
                return true
              }
              return false
            })
            activitiesList.find(activity => {
              if (activity.label === row.activity) {
                form.activity_id = activity.value
                return true
              }
              return false
            })
            this.form = form
          })

          this.id = row.id
        } else {
          this.id = ''
          this.form = form
        }
        this.dialogVisible = true
      })
    },
    methods: {
      getDefaultForm() {
        return {
          project_id: '',
          issue_id: '',
          spent_on: dayjs().format('YYYY-MM-DD'),
          hours: 8,
          comments: '',
          activity_id: ''
        }
      },
      async getTimeEntriesNew() {
        this.toggleLoading(true, 'loading...')
        if (!this.getTimeEntriesNewPromise) {
          this.getTimeEntriesNewPromise = this.$api.getTimeEntriesNew()
        }
        let {success, token, projectList, activitiesList} = await this.getTimeEntriesNewPromise
        this.toggleLoading(false)
        this.getTimeEntriesNewPromise = null
        if (!success) return
        this.token = token
        this.projectList = projectList
        this.activitiesList = activitiesList
      },
      beforeClose() {
        let {params} = this.$route
        this.dialogVisible = false
        this.form = this.getDefaultForm()
        if (params.recordOperate === 'add') {
          this.$router.replace({
            path: '/record'
          })
        }
      },
      selectProject(id) {
        this.$storage.setItem('project_id', id)
      },
      selectActivity(id) {
        this.$storage.setItem('activity_id', id)
      },
      addTimeEntry(oneMore) {
        this.$refs.form.validate(async valid => {
          if (!valid) return
          if (this.isNested) {
            let form = this.form
            let projectName = this.projectList.find(project => project.value === form.project_id).label,
              activityName = this.activitiesList.find(activity => activity.value === form.activity_id).label
            this.$emit('submit', {
              projectName: projectName,
              project_id: form.project_id,
              issue_id: form.issue_id,
              hours: form.hours,
              comments: form.comments,
              activityName: activityName,
              activity_id: form.activity_id
            })
            this.beforeClose()
          } else {
            let params = {
              ...this.params,
              authenticity_token: this.token
            }
            this.toggleLoading(true, '提交中...')
            let {success, message} = await this.$api.addTimeEntry(params, this.id)
            this.toggleLoading(false)
            if (!success) {
              this.$message({
                type: 'error',
                message: '登记工时失败：' + message
              })
            } else {
              this.$message({
                type: 'success',
                message: '登记成功'
              })
              this.$bus.$emit('record-refresh', !this.id)
	            if (oneMore){
	              this.getTimeEntriesNew()
	            }else{
                this.beforeClose()
	            }
            }
          }
        })
      },
      toggleLoading(flag, text) {
        if (flag) {
          if (!this.loadingInstance) {
            this.loadingInstance = Loading.service({
              target: '#record-add .el-dialog',
              text: text
            })
          }
        } else {
          this.loadingInstance && this.loadingInstance.close()
          this.loadingInstance = null
        }
      }
    }
  }
</script>

<style lang='less'>
	#record-add {

	}
</style>
