<template>
	<el-container id="app" v-loading="loginLoading">
		<el-header>
			<div class="header">
				<el-menu
					:default-active="activeTab"
					:router="true"
					background-color="#001529"
					active-text-color="rgb(255, 208, 75)"
					mode="horizontal"
				>
					<el-menu-item index="/record">工时列表</el-menu-item>
					<el-menu-item index="/schedule">定时配置</el-menu-item>
					<el-menu-item index="/email">邮件通知</el-menu-item>
				</el-menu>
				<div class="user">
					<span class="username" @click="$router.push({path:'/login'})">{{user.username | computedUser}}</span>
					<a class="github" href="https://github.com/lifuzhao100/dsWork" target="_blank">
						<svg class="octicon octicon-mark-github v-align-middle" height="32" viewBox="0 0 16 16" version="1.1"
						     width="32" aria-hidden="true">
							<path fill-rule="evenodd"
							      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
						</svg>
					</a>
				</div>
			</div>
		</el-header>
		<el-main>
			<el-page-header @back="goBack" :content="headerContent">
			</el-page-header>
			<div class="page-container">
				<router-view/>
			</div>
		</el-main>
		<el-footer>
			Powered By fuzhao
		</el-footer>
	</el-container>
</template>
<script>
  import {mapState} from 'vuex'

  export default {
    name: 'app',
    data() {
      return {
        activeTab: '/record',
        form: {
          username: '',
          password: ''
        }
      }
    },
    computed: {
      ...mapState([
        'loginLoading',
        'user'
      ]),
      headerContent() {
        let {meta} = this.$route
        return meta.title
      }
    },
    watch: {
      $route: {
        deep: true,
        immediate: true,
        handler({path}) {
          let match = path.match(/\/[a-z]+/i)
          if (match) {
            this.activeTab = match[0]
          }
        }
      }
    },
    methods: {
      goBack() {
        this.$router.back()
      }
    },
    filters: {
      computedUser(username) {
        if (!username) return ''
        let name = username.split('@')
        return '欢迎，' + name[0].trim()
      }
    }
  }
</script>
<style lang="less">
	html, body {
		width: 100%;
		height: 100%;
	}

	* {
		margin: 0;
		padding: 0;
	}

	#app {
		/*display: flex;*/
		width: 100%;
		min-height: 100%;
		background-color: #f0f2f5;

		.el-header {
			background-color: #001529;

			.header {
				max-width: 1200px;
				margin: 0 auto;
				display: flex;
				align-items: center;
			}

			.el-menu {
				background-color: transparent;
				flex-grow: 1;
				flex-shrink: 1;
			}

			.user {
				flex-grow: 0;
				flex-shrink: 0;
				display: inline-flex;
				align-items: center;
				color: #909399;

				.username {
					margin-right: 12px;
					cursor: pointer;

					&:hover {
						color: rgb(255, 208, 75);
					}
				}

				.github {
					display: inline-flex;
					background-color: #fff;
					border-radius: 32px;
					cursor: pointer;
				}
			}
		}

		.el-main {
			display: flex;
			flex-shrink: 0;
			flex-direction: column;
			padding: 0 20px;

			.el-page-header, .page-container {
				width: 100%;
				max-width: 1200px;
				margin: 0 auto;
			}

			.el-page-header {
				padding: 16px 0;
			}

			.page-container {
				flex-grow: 1;
				display: flex;
				flex-direction: column;
				padding: 20px;
				box-sizing: border-box;
				background-color: #fff;
			}
		}

		.el-footer {
			display: flex;
			justify-content: center;
			align-items: center;
		}

		&.is-login {
			.el-page-header__left {
				margin-left: -20px;

				.el-icon-back, .el-page-header__title {
					display: none;
				}

			}
		}

		.el-pagination {
			padding-top: 20px;
			text-align: right;
		}
	}

	.el-dialog {
		.el-form {
			width: 100%;
			max-width: 520px;
			margin: 0 auto;

			.el-form-item__content {
				& > .el-input, & > .el-select {
					width: 100%;
				}

			}
		}
	}
</style>
