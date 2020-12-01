<template>
  <div class="users_container">
    <a-row type="flex" justify="space-between" align="top" class="gpt-header">
      <a-col :span="6">
        <a-row class="gpt-header-left" :gutter="[0, 15]">
          <a-col>

            <div class="add-glow-effect">
              <img v-if="!indexInfo.member" src="../../assets/gpt-member00.png" alt="" />
              <img v-else-if="indexInfo.member === 1" src="../../assets/gpt-member01.png" alt="" />
              <img v-else-if="indexInfo.member === 2" src="../../assets/gpt-member02.png" alt="" />
              <img v-else-if="indexInfo.member === 3" src="../../assets/gpt-member03.png" alt="" />
            </div>

          </a-col>
          <a-col>
            <a-avatar :size="128" :src="require('../../assets/gpt-head.png')" />
          </a-col>
          <a-col class="gpt-name">{{indexInfo.nick_name}}</a-col>
          <a-col v-if="!indexInfo.member">
            <a-button type="primary" shape="round" size="large" @click="recharge">
              充值积分
            </a-button>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="9">
        <a-row class="gpt-header-right" :gutter="[0, 15]">
          <a-col>
            <a-progress type="circle" :percent="indexInfo.qd_coin" :width="184" :strokeWidth="10" strokeColor="#FFB41D">
              <template #format="percent">
                <span style="color: #FF4747;font-weight: bold;font-size: 24px;">{{ percent }}</span>
                <p style="margin-top: 25px;font-size: 16px;">今日签到可领积分</p>
              </template>
            </a-progress>
          </a-col>
          <a-col>
            <a-button v-if="!indexInfo.is_qd" type="primary" shape="round" size="large" ghost @click="autoGraph">
              签到
            </a-button>
            <a-button v-else type="primary" shape="round" size="large" ghost>
              已签到
            </a-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row class="gpt-content" :gutter="18">
      <a-col :span="6">
        <div class="gpt-content-item">
          <a-row :gutter="[0, 11]" style="padding: 20px 0;">
            <a-col><a-icon type="database" :style="{ fontSize: '20px', color: '#025AFA' }" /></a-col>
            <a-col class="gpt-content-points">我的积分</a-col>
            <a-col class="gpt-content-num">{{indexInfo.balance}}</a-col>
            <a-col>
              <a-button type="primary" shape="round" size="large">
                开始生成文章
              </a-button>
            </a-col>
          </a-row>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="gpt-content-item">
          <a-row :gutter="[0, 11]" style="padding: 20px 0;">
            <a-col><a-icon type="database" :style="{ fontSize: '20px', color: '#025AFA' }" /></a-col>
            <a-col class="gpt-content-points">我的模型</a-col>
            <a-col class="gpt-content-num">{{indexInfo.pri_model_num}}</a-col>
            <a-col>
              <a-button type="primary" shape="round" size="large" @click="createArticleModel">
                文章模型
              </a-button>
            </a-col>
          </a-row>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="gpt-content-item">
          <a-row :gutter="[0, 11]" style="padding: 20px 0;">
            <a-col><a-icon type="database" :style="{ fontSize: '20px', color: '#025AFA' }" /></a-col>
            <a-col class="gpt-content-points">API次数</a-col>
            <a-col class="gpt-content-num">{{indexInfo.api_use_times}}</a-col>
            <a-col>
              <a-button type="primary" shape="round" size="large">
                设置API参数
              </a-button>
            </a-col>
          </a-row>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="gpt-content-item">
          <a-row :gutter="[0, 11]" style="padding: 20px 0;">
            <a-col><a-icon type="database" :style="{ fontSize: '20px', color: '#025AFA' }" /></a-col>
            <a-col class="gpt-content-points">生成数量</a-col>
            <a-col class="gpt-content-num">{{indexInfo.post_num}}</a-col>
            <a-col>
              <a-button type="primary" shape="round" size="large" @click="rabbitmqctlListQueues">
                查看队列
              </a-button>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
    <a-row class="gpt-footer">
      <a-col :span="24">
        <h3>最近文章列表</h3>
      </a-col>
      <a-col :span="24">
        <a-table :columns="columns" :data-source="indexInfo.last_post" bordered :pagination="false">
          <template slot="done_at" slot-scope="text">
            {{ text | dateFormat }}
          </template>
        </a-table>
      </a-col>
    </a-row>

    <!-- 充值会员对话框 -->
    <a-modal v-model="rechargeVisible" title="充值积分/开通会员" @ok="handleOk">
      <a-table :row-selection="rechargeSelect" :columns="rechargeColumns" :data-source="rechargeData" size="small" />
    </a-modal>

  </div>
</template>

<script>
export default {
  created () {
    this.getUserInfo()
  },
  data () {
    return {
      columns: [
        {
          title: '模型名',
          dataIndex: 'model_name'
        },
        {
          title: '文章内容',
          dataIndex: 'txt',
          ellipsis: true
        },
        {
          title: '生成成功时间',
          dataIndex: 'done_at',
          scopedSlots: { customRender: 'done_at' }
        }
      ],
      // 首页信息
      indexInfo: {},
      // 充值会员对话框
      rechargeVisible: false,
      // 充值会员表格标题
      rechargeColumns: [
        {
          title: '序号',
          dataIndex: 'id'
        },
        {
          title: '充值积分数',
          dataIndex: 'coin'
        },
        {
          title: '赠送积分数',
          dataIndex: 'gift_coin'
        },
        {
          title: '人民币元',
          dataIndex: 'rmb_yuan'
        }
      ],
      // 充值套餐 data
      rechargeData: [],
      // 选中的充值套餐人民币
      rechargeSelectValue: ''
    }
  },
  computed: {
    // 充值套餐 单选
    rechargeSelect () {
      return {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
          this.rechargeSelectValue = selectedRows[0].rmb_yuan
        }
      }
    }
  },
  methods: {
    // 获取用户信息
    async getUserInfo () {
      const { data: res } = await this.$http.get('pg/index')
      window.localStorage.setItem('nick_name', '')
      if (res.status !== 0) return this.$message.error(res.reason)
      this.indexInfo = res
      window.localStorage.setItem('nick_name', res.nick_name)
      // 把获取到的 昵称 信息传给父组件展示
      this.$emit('getNickName', res.nick_name)
      // this.indexInfo.last_post = [
      //   {
      //     done_at: 'number',
      //     txt: 'string',
      //     model_name: 'string'
      //   }, {
      //     done_at: 'number',
      //     txt: 'string',
      //     model_name: 'string'
      //   }, {
      //     done_at: 'number',
      //     txt: 'string',
      //     model_name: 'string'
      //   }
      // ]
      let i = 0
      this.indexInfo.last_post = this.indexInfo.last_post.map(v => {
        return { ...v, key: i++ }
      })
    },
    // 充值会员按钮
    recharge () {
      this.getRecharge()
    },
    // 获取充值套餐
    async getRecharge () {
      const { data: res } = await this.$http.get('rcl')
      if (res.status !== 0) return this.$message.error(res.reason)
      this.rechargeData = res.list.map(v => {
        return { ...v, key: v.id }
      })
      this.rechargeVisible = true
    },
    // 充值积分
    async getTopUpIntegral (rmbValue) {
      const { data: res } = await this.$http.post('rc', {
        rmb_y: rmbValue
      })
      if (res.status !== 0) return this.$message.error(res.reason)
      window.open(res.pay_link)
    },
    // 去付款页面
    handleOk () {
      this.getTopUpIntegral(this.rechargeSelectValue)
    },
    // 签到
    autoGraph () {
      this.punchClock()
    },
    // 打卡
    async punchClock () {
      const { data: res } = await this.$http.post('qd')
      if (res.status !== 0) return this.$message.error(res.reason)
      this.getUserInfo()
      this.$message.success('签到了')
    },
    // 查看队列
    rabbitmqctlListQueues () {
      this.$router.push('/list')
    },
    // 文章模型页面
    createArticleModel () {
      this.$router.push('/modelslist')
    }
  }
}
</script>

<style lang="less" scoped>
.gpt-header,
.gpt-footer {
  background-color: #fff;
  border-radius: 20px;
}
.gpt-content {
  margin: 15px 0;
  .gpt-content-item {
    background-color: #fff;
    border-radius: 20px;
    line-height: normal;
    .gpt-content-points {
      color: #040404;
      font-size: 16px;
    }
    .gpt-content-num {
      color: #FF4747;
      margin: 17px 0 29px 0;
      font-weight: bold;
      font-size: 24px;
    }
  }
}
.gpt-header-left {
  line-height: normal;
  padding: 18px 0 38px 0;
  .add-glow-effect {
    display: inline-block;
    position: relative;
    overflow: hidden;
  }
  .add-glow-effect::before {
    content: '';
    position: absolute;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, transparent, white, transparent);
    transition: .5s;
  }
  .add-glow-effect:hover::before {
    left: 100%;
  }
}
.gpt-header-right {
  line-height: normal;
  padding: 30px 0 20px 0;
}
.gpt-name {
  color: #040404;
}
.gpt-footer {
  line-height: normal;
  padding: 30px 40px;
  h3 {
    font-weight: bold;
    font-size: 20px;
    text-align: left;
  }
}
</style>
