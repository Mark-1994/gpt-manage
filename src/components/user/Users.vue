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
          <a-col>
            <a-button type="primary" shape="round" size="large" @click="recharge">
              充值积分
            </a-button>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="9">
        <a-row class="gpt-header-right" :gutter="[0, 15]">
          <a-col>
            <a-progress type="circle" :percent="getFlagNum" :width="184" :strokeWidth="10" strokeColor="#FFB41D">
              <template #format="percent">
                <div v-if="false">{{ percent }}</div>
                <span style="color: #FF4747;font-weight: bold;font-size: 24px;">{{ indexInfo.qd_coin }}</span>
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
              <a-button type="primary" shape="round" size="large" @click="articleProduce">
                文章生成
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
              <a-button type="primary" shape="round" size="large" @click="setApiParam">
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

      <div :style="{ marginBottom: '16px' }">
        <a-radio-group default-value="0" size="small" @change="consumeRadioEvent" v-model="integralOrMember">
          <a-radio-button value="0">
            充值积分
          </a-radio-button>
          <a-radio-button value="1" :disabled="Boolean(indexInfo.member)">
            开通会员
          </a-radio-button>
        </a-radio-group>
      </div>

      <!-- 充值积分 -->
      <a-table v-if="!Number(integralOrMember)" :row-selection="rechargeSelect" :columns="rechargeColumns" :data-source="rechargeData" size="small">
        <template slot="rmb_fen" slot-scope="text">
          {{ text / 100 }}
        </template>
      </a-table>

      <!-- 开通会员 -->
      <div v-else>
        <a-table :row-selection="memberSelect" :columns="memberColumns" :data-source="memberData" size="small" :scroll="{ x: 1500, y: 300 }" />
        <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" labelAlign="left">
          <a-form-item label="购买月数">
            <a-input-number v-model="memberMonthNum" :min="1" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

  </div>
</template>

<script>
export default {
  created () {
    this.getUserInfo()
    this.judgeDomain()
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
      indexInfo: {
        qd_sc: ''
      },
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
          dataIndex: 'rmb_fen',
          scopedSlots: { customRender: 'rmb_fen' }
        }
      ],
      // 充值套餐 data
      rechargeData: [],
      // 选中的充值套餐人民币
      rechargeSelectValue: '',
      // 选择的是充值积分 还是 开通会员
      integralOrMember: '0',
      // 开通会员表格标题
      memberColumns: [
        {
          title: '序号',
          dataIndex: 'id'
        },
        {
          title: '会员级别',
          dataIndex: 'member_level'
        },
        {
          title: '公共语料生成文章每篇消耗积分数',
          dataIndex: 'pub_model_genpost_cost'
        },
        {
          title: '生成文章最大字数限制',
          dataIndex: 'gen_post_word_limit'
        },
        {
          title: '私有模型训练花费积分数',
          dataIndex: 'private_model_xl_cost'
        },
        {
          title: '是否有关键词加粗功能',
          dataIndex: 'auto_kw_bold'
        },
        {
          title: '是否有自定义内链功能',
          dataIndex: 'auto_inner_link'
        },
        {
          title: '是否有API功能',
          dataIndex: 'enable_api'
        },
        {
          title: 'API生成文章每篇消耗金币数',
          dataIndex: 'api_gen_cost'
        },
        {
          title: '是否有API自动关键词加粗功能',
          dataIndex: 'auto_api_kw_blod'
        },
        {
          title: '是否有API自动内链功能',
          dataIndex: 'auto_api_inner_link'
        },
        {
          title: '文章结尾广告语',
          dataIndex: 'auto_post_tail_adv'
        },
        {
          title: '私有模型生成文章每篇消耗金币数',
          dataIndex: 'private_model_gen_cost'
        },
        {
          title: '生成文章优先级，数值越大优先级越大',
          dataIndex: 'gen_post_priority'
        },
        {
          title: '是否有自定义标题功能',
          dataIndex: 'auto_attach_title'
        },
        {
          title: '每天签到领取积分数',
          dataIndex: 'daily_qd_coin'
        },
        {
          title: '会员月费',
          dataIndex: 'monthly_cost'
        }
      ],
      // 开通会员 data
      memberData: [],
      // 开通会员购买月数
      memberMonthNum: '',
      // 开通会员级别
      memberLevel: ''
    }
  },
  computed: {
    // 充值套餐 单选
    rechargeSelect () {
      return {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
          this.rechargeSelectValue = selectedRows[0].id
        }
      }
    },
    // 开通会员 单选
    memberSelect () {
      return {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
          switch (selectedRows[0].member_level) {
            case '普通用户': this.memberLevel = 0
              break
            case '黄金会员': this.memberLevel = 1
              break
            case '铂金会员': this.memberLevel = 2
              break
            case '钻石会员': this.memberLevel = 3
              break
          }
        }
      }
    },
    // 签到天数
    getFlagNum () {
      const flagNum = this.indexInfo.qd_sc.split('/')[0]
      const flagSum = this.indexInfo.qd_sc.split('/')[1]
      return flagNum / flagSum * 100
    }
  },
  methods: {
    // 获取用户信息
    async getUserInfo () {
      const { data: res } = await this.$http.get('pg/index')
      window.localStorage.setItem('nick_name', '')
      if (res.status === 10) return this.$message.error(res.reason, function () { window.location.href = 'http://a.91nlp.cn/' })
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
      this.getMemberMealList()
      this.rechargeVisible = true
    },
    // 充值积分
    async getTopUpIntegral (rmbValue) {
      const { data: res } = await this.$http.post('rc', {
        id: rmbValue
      })
      if (res.status !== 0) return this.$message.error(res.reason)
      window.open(res.pay_link)
    },
    // 去付款页面
    handleOk () {
      if (!Number(this.integralOrMember)) {
        this.getTopUpIntegral(this.rechargeSelectValue)
      } else {
        this.getOpenMemberEvent()
      }
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
    },
    // 设置 API 参数页面
    setApiParam () {
      this.$router.push('/apimanage')
    },
    // 文章生成页面
    articleProduce () {
      this.$router.push('/add')
    },
    // 获取会员套餐列表
    async getMemberMealList () {
      const { data: res } = await this.$http.get('ml')
      if (res.status !== 0) return this.$message.error(res.reason)
      this.memberData = res.list.map(v => {
        switch (v.member_level) {
          case 0: v.member_level = '普通用户'
            break
          case 1: v.member_level = '黄金会员'
            break
          case 2: v.member_level = '铂金会员'
            break
          case 3: v.member_level = '钻石会员'
            break
        }
        v.auto_kw_bold = v.auto_kw_bold ? '是' : '否'
        v.auto_inner_link = v.auto_inner_link ? '是' : '否'
        v.enable_api = v.enable_api ? '是' : '否'
        v.auto_api_kw_blod = v.auto_api_kw_blod ? '是' : '否'
        v.auto_api_inner_link = v.auto_api_inner_link ? '是' : '否'
        v.auto_post_tail_adv = v.auto_post_tail_adv ? '是' : '否'
        v.auto_attach_title = v.auto_attach_title ? '是' : '否'
        return { ...v, key: v.id }
      })
    },
    // 充值/开通 单选事件
    consumeRadioEvent () {
      // console.log(this.integralOrMember)
    },
    // 开通会员事件
    async getOpenMemberEvent () {
      if (!this.memberLevel) return this.$message.error('参数有误!')
      const { data: res } = await this.$http.post('rcmb', {
        ml: this.memberLevel,
        mn: this.memberMonthNum
      })
      if (res.status !== 0) return this.$message.error(res.reason)
      this.$message.success('开通了')
      this.getUserInfo()
      this.rechargeVisible = false
    },
    // 判断当前页面是否是指定域名
    judgeDomain () {
      if (window.location.host !== 'a.91nlp.cn') {
        this.$message.error('Error', function () {
          window.location.href = 'http://a.91nlp.cn/'
        })
      }
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
