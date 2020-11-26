<template>
  <div class="login_container">
    <div class="content_input">
      <div class="title">
        <p>{{showLogin ? '注册' : '管理员登录'}}</p>
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
            placeholder="Username"
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
            placeholder="Password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item style="margin-bottom: 10px;">
          <a-checkbox
            v-decorator="[
              'remember',
              {
                valuePropName: 'checked',
                initialValue: true,
              },
            ]"
          >
            Remember me
          </a-checkbox>
          <a class="login-form-forgot" href="javascript:;">
            Forgot password
          </a>
          <a-button type="primary" html-type="submit" class="login-form-button">
            登录
          </a-button>
          Or
          <a href="javascript:;" @click="showRegister">
            register now!
          </a>
        </a-form-item>
      </a-form>

      <!-- 注册 -->
      <a-form
        v-else
        id="components-form-demo-normal-login"
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
            placeholder="Username"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item style="margin-bottom: 10px;">
          <a-input
            v-decorator="[
              'registerPassword',
              { rules: [{ required: true, message: 'Please input your Password!' }] },
            ]"
            type="password"
            placeholder="Password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item style="margin-bottom: 10px;">
          <a-input
            v-decorator="[
              'phone',
              {
                rules: [{ required: true, message: 'Please input your phone number!' }],
              },
            ]"
            style="width: 100%"
            placeholder="Phone Number"
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
                placeholder="captcha"
              >
              </a-input>
            </a-col>
            <a-col :span="9">
              <a-button @click="getCaptcha">Get captcha</a-button>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item style="margin-bottom: 10px;">
          <a-button type="primary" html-type="submit" class="login-form-button">
            注册
          </a-button>
          Or
          <a href="javascript:;" @click="showRegister">
            login now!
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
  mounted () {
    document.querySelector('body').style.backgroundColor = 'rgba(223, 223, 223, .3)'
  },
  data () {
    return {
      // 登录、注册切换
      showLogin: 0
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
    showRegister () {
      this.showLogin = !this.showLogin
    },
    // 注册按钮
    registerSubmit (e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          const { data: res } = await this.$http.post('register', {
            mb: values.registerUserName,
            passwd: values.registerPassword,
            auth_code: values.captcha,
            ticket: localStorage.getItem('ticket')
          })
          if (res.status !== 0) return this.$message.error(res.reason)
          this.$message.success(res.reason)
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
  height: 300px;
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
    height: 30px;
  }

  60% {
    height: 60px;
  }

  65% {
    height: 90px;
  }

  70% {
    height: 120px;
  }

  75% {
    height: 150px;
  }

  80% {
    height: 180px;
  }

  85% {
    height: 210px;
  }

  90% {
    height: 240px;
  }

  95% {
    height: 240px;
  }

  100% {
    height: 300px;
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
