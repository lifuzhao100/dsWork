<template>
	<div id='page-login'>
		<el-form ref="form" :model="form" label-width="0">
			<el-form-item prop="username" :rules="[{required: true, message:'请输入username'}]">
				<el-autocomplete
					v-model="form.username"
					:fetch-suggestions="autoComplete"
					placeholder="username"
					:trigger-on-focus="false"
				></el-autocomplete>
			</el-form-item>
			<el-form-item prop="password" :rules="[{required: true, message:'请输入password'}]">
				<el-input v-model="form.password" type="password" placeholder="password"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="login">登录</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
  /**
   * @Author: lifuzhao
   * @Date: 2019-11-27 21:57
   * @Project: dsWork
   */
  import $ from 'jquery'
  import {mapState} from 'vuex'

  export default {
    name: "index",
    data() {
      return {
        form: {
          username: '',
          password: ''
        }
      }
    },
    computed: {
      ...mapState([
        'user'
      ])
    },
    watch: {
      user(user) {
        this.form = user
      }
    },
    mounted() {
      $('#app').addClass('is-login')
    },
    beforeDestroy() {
      $('#app').removeClass('is-login')
    },
    methods: {
      login() {
        this.$refs.form.validate(async valid => {
          if (!valid) return
          this.$store.commit('updateLoginLoading', true)
          let result = await this.$api.login(this.form)
          console.log(result)
          this.$store.commit('updateLoginLoading', false)
          if (result.success) {
            await this.$store.dispatch('saveUser', this.form)
            this.$router.replace({
              path: '/'
            })
          } else {
            this.$message({
              type: 'error',
              message: result.message
            })
          }
        })
      },
      autoComplete(str, callback) {
        str = str.trim()
        console.log('str', str)
        let list = []
        if (!str) callback(list)
        let prefixs = [
          '@datastory.com.cn',
          '@hudongpai.com'
        ]
        if (/^[^@]+@?[^@]*$/.test(str)) {
          let [emailSuffix, emailPrefix] = str.split('@')
          if (!emailPrefix) {
            list = prefixs
          } else {
            prefixs.forEach(prefix => {
              let prefixReg = new RegExp(prefix)
              if (prefixReg.test(prefix)) {
                list.push(prefix)
              }
            })
          }
          list = list.map(item => {
            let suggestion = emailSuffix + item
            return {
              label: suggestion,
              value: suggestion
            }
          })
        }
        console.log('list', list)
        callback(list)
      },
    }
  }
</script>

<style lang='less'>
	#page-login {
		width: 100%;
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 64px 0;

		.el-form {
			margin-top: -50px;
		}

		.el-form-item {
			margin-bottom: 32px;

			&:last-of-type {
				margin-bottom: 0;
				margin-top: 52px;
			}
		}

		.el-input, .el-button {
			width: 360px;
		}
	}
</style>
