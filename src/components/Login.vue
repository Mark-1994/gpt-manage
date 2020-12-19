<template>
  <div class="login_container">
    <div class="content_input">
      <div class="title">
        <p>{{showLogin ? showLogin === 2 ? '重置密码' : '注册' : '会员登录'}}</p>
      </div>
      <!-- <a-input placeholder="用户名" style="margin-bottom: 25px;" />
      <a-input-password placeholder="input password" style="margin-bottom: 25px;" /> -->

      <!-- 登录 -->
      <a-form
        v-if="!showLogin"
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
        @submit="handleSubmit"
      >
        <a-form-item style="margin-bottom: 10px;">
          <a-input
            v-decorator="[
              'userName',
              { rules: [{ required: true, message: 'Please input your username!' }] },
            ]"
            placeholder="手机号"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item style="margin-bottom: 10px;">
          <a-input
            v-decorator="[
              'password',
              { rules: [{ required: true, message: 'Please input your Password!' }] },
            ]"
            type="password"
            placeholder="密码"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item style="margin-bottom: 0;">
          <a-checkbox
            v-decorator="[
              'remember',
              {
                valuePropName: 'checked',
                initialValue: true,
              },
            ]"
          >
            记住密码
          </a-checkbox>
          <a class="login-form-forgot" href="javascript:;" @click="showRegister(2)">
            忘记密码
          </a>
          <a-button type="primary" html-type="submit" class="login-form-button">
            登录
          </a-button>
          Or
          <a href="javascript:;" @click="showRegister(1)">
            注册!
          </a>
          <span>开启Cookie之后才能登录,如何开启?</span>
          <p :style="{ margin: '0' }">注册送 1000 积分，受邀注册多送 <span :style="{ color: 'red' }">500</span> 积分！</p>
        </a-form-item>
      </a-form>

      <!-- 注册 -->
      <a-form
        v-else-if="showLogin === 1"
        :form="form"
        class="register-form"
        @submit="registerSubmit"
      >
        <a-form-item style="margin-bottom: 10px;">
          <a-input
            v-decorator="[
              'registerUserName',
              { rules: [{ required: true, message: 'Please input your username!' }] },
            ]"
            placeholder="手机号"
            ref="mb"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item style="margin-bottom: 10px;">
          <a-input
            v-decorator="[
              'registerPassword',
              { rules: [{ required: true, message: 'Please input your Password!' }, { min: 6, max: 18, message: '密码长度 6 - 18 位' }] },
            ]"
            type="password"
            placeholder="密码"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item style="margin-bottom: 10px;" v-if="false">
          <a-input
            v-decorator="[
              'phone',
              {
                rules: [{ required: true, message: 'Please input your phone number!' }],
              },
            ]"
            style="width: 100%"
            placeholder="手机号"
            ref="mb"
          >
            <a-select
              slot="addonBefore"
              v-decorator="['prefix', { initialValue: '86' }]"
              style="width: 70px"
            >
              <a-select-option value="86">
                +86
              </a-select-option>
              <a-select-option value="87">
                +87
              </a-select-option>
            </a-select>
          </a-input>
        </a-form-item>
        <a-form-item style="margin-bottom: 10px;">
          <a-row :gutter="8">
            <a-col :span="15">
              <a-input
                v-decorator="[
                  'captcha',
                  { rules: [{ required: true, message: 'Please input the captcha you got!' }] },
                ]"
                placeholder="验证码"
              >
              </a-input>
            </a-col>
            <a-col :span="9">
              <a-button v-if="showCountDown" @click="getCaptcha">获取验证码</a-button>
              <a-button v-else disabled>{{countNum}} s</a-button>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item style="margin-bottom: 0;">
          <a-button type="primary" html-type="submit" class="login-form-button" block>
            注册
          </a-button>
          Or
          <a href="javascript:;" @click="showRegister(0)">
            登录!
          </a>
        </a-form-item>
      </a-form>

      <!-- 重置密码 -->
      <a-form
        :form="form"
        v-else-if="showLogin === 2"
        @submit="resetSubmit">
        <a-form-item style="margin-bottom: 10px;">
          <a-input
            v-decorator="[
              'resetUserName',
              { rules: [{ required: true, message: 'Please input your username!' }] },
            ]"
            placeholder="手机号"
            ref="resetmb"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item style="margin-bottom: 10px;">
          <a-input
            v-decorator="[
              'resetPassword',
              { rules: [{ required: true, message: 'Please input your Password!' }, { min: 6, max: 18, message: '密码长度 6 - 18 位' }] },
            ]"
            type="password"
            placeholder="密码"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item style="margin-bottom: 10px;">
          <a-row :gutter="8">
            <a-col :span="15">
              <a-input
                v-decorator="[
                  'resetCaptcha',
                  { rules: [{ required: true, message: 'Please input the captcha you got!' }] },
                ]"
                placeholder="验证码"
              >
              </a-input>
            </a-col>
            <a-col :span="9">
              <a-button v-if="resetPasswordShowCountDown" @click="getResetPasswordsCaptcha">获取验证码</a-button>
              <a-button v-else disabled>{{resetPasswordCountNum}} s</a-button>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item style="margin-bottom: 0;">
          <a-button type="primary" html-type="submit" class="login-form-button" block>
            重置
          </a-button>
          Or
          <a href="javascript:;" @click="showRegister(0)">
            登录!
          </a>
        </a-form-item>
      </a-form>

    </div>
  </div>
</template>

<script>
require('ribbon.js')
export default {
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'normal_login' })
  },
  created () {
    this.getUrlParam('fid')
  },
  mounted () {
    document.querySelector('body').style.backgroundColor = 'rgba(223, 223, 223, .3)'
  },
  data () {
    return {
      // 登录、注册切换
      showLogin: 0,
      // 显示隐藏 60s 倒计时
      showCountDown: true,
      // 60s
      countNum: '',
      // 定时器
      timer: null,
      // 重置密码 显示隐藏 60s 倒计时
      resetPasswordShowCountDown: true,
      // 重置密码 60s
      resetPasswordCountNum: '',
      // 重置密码 定时器
      resetPasswordTimer: null,
      // 从 URL 获取的参数值
      urlParams: ''
    }
  },
  methods: {
    // 点击登录按钮
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          const { data: res } = await this.$http.post('login', {
            mb: values.userName,
            passwd: values.password
          })
          if (res.status !== 0) return this.$message.error(res.reason)
          this.$message.success('登录了')
          this.$router.push('/home')
        }
      })
    },
    // 点击切换 登录、注册 窗口
    showRegister (flag) {
      if (flag === 0) {
        this.showLogin = 0
      } else if (flag === 1) {
        this.showLogin = 1
      } else if (flag === 2) {
        this.showLogin = 2
      }
    },
    // 注册按钮
    registerSubmit (e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          if (window.location.host === 'sem.hbzhaosheng.cn') {
            const { data: res } = await this.$http.post('register', {
              mb: values.registerUserName,
              passwd: values.registerPassword,
              auth_code: values.captcha,
              ticket: localStorage.getItem('ticket'),
              fid: 'pee2ho9ongie'
            })
            if (res.status !== 0) return this.$message.error(res.reason)
          } else {
            const { data: res } = await this.$http.post('register', {
              mb: values.registerUserName,
              passwd: values.registerPassword,
              auth_code: values.captcha,
              ticket: localStorage.getItem('ticket'),
              fid: this.urlParams
            })
            if (res.status !== 0) return this.$message.error(res.reason)
          }
          this.$message.success('注册了')
          this.showLogin = 0
        }
      })
    },
    // 重置密码 按钮
    resetSubmit (e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          const { data: res } = await this.$http.post('change_passwd', {
            mb: values.resetUserName,
            passwd: values.resetPassword,
            auth_code: values.resetCaptcha,
            ticket: localStorage.getItem('ticket')
          })
          if (res.status !== 0) return this.$message.error(res.reason)
          this.$message.success('重置了')
          this.showLogin = 0
        }
      })
    },
    // 发送验证码
    async getCaptcha () {
      const { data: res } = await this.$http.post('get_authcode', {
        mb: this.$refs.mb.value
      })
      if (res.status !== 0) return this.$message.error(res.reason)
      localStorage.setItem('ticket', res.ticket)
      this.$message.success('发送了')

      // 倒计时
      const timeCount = 60
      if (!this.timer) {
        this.countNum = timeCount
        this.showCountDown = false
        this.timer = setInterval(() => {
          if (this.countNum > 0 && this.countNum <= timeCount) {
            this.countNum--
          } else {
            this.showCountDown = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },
    // 重置密码 获取验证码
    async getResetPasswordsCaptcha () {
      const { data: res } = await this.$http.post('get_authcode', {
        mb: this.$refs.resetmb.value
      })
      if (res.status !== 0) return this.$message.error(res.reason)
      localStorage.setItem('ticket', res.ticket)
      this.$message.success('发送了')

      // 倒计时
      const resetPasswordsTimeCount = 60
      if (!this.resetPasswordTimer) {
        this.resetPasswordCountNum = resetPasswordsTimeCount
        this.resetPasswordShowCountDown = false
        this.resetPasswordTimer = setInterval(() => {
          if (this.resetPasswordCountNum > 0 && this.resetPasswordCountNum <= resetPasswordsTimeCount) {
            this.resetPasswordCountNum--
          } else {
            this.resetPasswordShowCountDown = true
            clearInterval(this.resetPasswordTimer)
            this.resetPasswordTimer = null
          }
        }, 1000)
      }
    },
    // 获取当前页面 URL 中参数
    getUrlParam (name) {
      const url = window.location.href
      const params = url.substr(url.lastIndexOf('?') + 1).split('&')
      params.map(v => {
        const param = v
        const key = param.split('=')[0]
        const value = param.split('=')[1]
        if (key === name) this.urlParams = value
      })
    }
  }
}
</script>

<style lang="less" scoped>
body {
  background-color: rgba(223, 223, 223,  .3);
}
.login_container {
  width: 500px;
  height: 350px;
  padding: 0 50px;
  border-radius: 5px;
  box-shadow: 0px 2px 12px 0px rgba(105, 105, 105,  .07);
  background: rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: mymove 1s ease-in-out alternate;
  overflow: hidden;
  transition: 1.5s;
}
@keyframes mymove {
  0% {
    width: 0px;
    height: 5px;
  }

  10% {
    width: 50px;
    height: 5px;
  }

  15% {
    width: 100px;
    height: 5px;
  }

  20% {
    width: 150px;
    height: 5px;
  }

  25% {
    width: 200px;
    height: 5px;
  }

  30% {
    width: 250px;
    height: 5px;
  }

  35% {
    width: 300px;
    height: 5px;
  }

  40% {
    width: 350px;
    height: 5px;
  }

  45% {
    width: 450px;
    height: 5px;
  }

  50% {
    width: 500px;
    height: 5px;
  }

  55% {
    height: 35px;
  }

  60% {
    height: 70px;
  }

  65% {
    height: 105px;
  }

  70% {
    height: 140px;
  }

  75% {
    height: 175px;
  }

  80% {
    height: 210px;
  }

  85% {
    height: 245px;
  }

  90% {
    height: 280px;
  }

  95% {
    height: 315px;
  }

  100% {
    height: 350px;
  }
}
.title {
  text-align: center;
  font-size: 24px;
  // margin-bottom: 30px;
  font-weight: bold;
  color: #606266;
  p {
    margin-bottom: 15px;
  }
}
.content_input {
  width: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>
