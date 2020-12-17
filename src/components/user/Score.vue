<template>
  <div class="list_container">
    <h3>会员充值</h3>

    <a-tabs type="card" activeKey="2" :tabBarGutter="0" class="scorePanel">
      <a-tab-pane key="1" disabled>
        <span slot="tab">
          <img src="../../assets/gpt-diamonds.png" alt="" style="margin-right: 10px;width: 25px;">
          升级会员
        </span>
        Content of Tab Pane 1
      </a-tab-pane>
      <a-tab-pane key="2" style="border: 1px solid #e8e8e8;border-top: 0;border-radius: 0 0 16px 16px;">
        <span slot="tab" style="color: #000000;">
          <img src="../../assets/gpt-money.png" alt="" style="margin-right: 10px;width: 25px;">
          积分充值
        </span>
        <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-item label="当前账号" :style="{ textAlign: 'left',paddingTop: '24px' }">
            {{ currentAccount }}
          </a-form-item>
          <a-form-item label="积分金额" :style="{ textAlign: 'left' }" class="integralAmountVal">
            <a-radio-group v-model="integralAmount" @change="choiceCombo">
              <a-row :gutter="[0, 20]">
                <a-col :span="12" v-for="item in rechargeComboData" :key="item.id">
                  <a-radio :value="item.id" style="width: 95%;">
                    <div style="display: inline-block;vertical-align: middle;border: 1px solid #e8e8e8;border-radius: 8px;width: 100%;" class="integralAmountValItem">
                      <a-row type="flex" align="middle" justify="center">
                        <a-col :span="6">
                          <a-row :style="{ textAlign: 'center',backgroundColor: '#E8E8E8',borderRadius: '8px 0 0 8px',padding: '8px 0',fontWeight: 'bold' }">
                            <a-col>{{ item.coin }}</a-col>
                            <a-col>积分</a-col>
                          </a-row>
                        </a-col>
                        <a-col :span="18">
                          <!-- <span style="color: #FF3A3A;margin-left: 14px;">￥<i style="font-style: normal;font-size: 24px;">{{ item.rmb_fen / 100 }}</i></span> -->
                          <!-- <span style="color: #0039FD;margin: 0 14px;">
                            <i>赠送 {{ item.gift_coin }} 积分</i>
                          </span> -->
                          <!-- <a-row>
                            <a-col>赠送 {{ item.gift_coin }} 积分</a-col>
                            <a-col>赠送 {{ item.gift_coin }} 积分</a-col>
                          </a-row> -->
                          <a-row style="text-align: center;">
                            <a-col :span="10">
                              ￥<i style="font-style: normal;font-size: 24px;">{{ item.rmb_fen / 100 }}</i>
                            </a-col>
                            <a-col :span="14">
                              <a-row>
                                <a-col>赠送 {{ item.gift_coin }} 积分</a-col>
                                <!-- <a-col>*** 积分/篇</a-col> -->
                                <a-col>&nbsp;</a-col>
                              </a-row>
                            </a-col>
                          </a-row>
                        </a-col>
                      </a-row>
                    </div>
                  </a-radio>
                </a-col>
              </a-row>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="支付方式" :style="{ textAlign: 'left' }">
            <a-radio-group v-model="payType">
              <a-radio :value="1">
                <img src="../../assets/gpt-alipay01.svg" alt="" height="25">
                支付宝
              </a-radio>
              <a-radio :value="2" disabled>
                <img src="../../assets/gpt-wechat.svg" alt="" height="25">
                微信支付
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 14, offset: 10 }">
            <a-row type="flex" justify="center" align="middle">
              <a-col :span="14">
                <a-row>
                  <a-col>
                    <span style="margin-right: 19px;">实付： <i style="font-style: normal;color: #FFB05D;font-size: 24px;">{{ actuallyPaid }}</i> 元</span>
                  </a-col>
                  <a-col>
                    共到账 <i style="font-style: normal;color: #FFB05D;font-size: 24px;">{{ getPoint + presentExp }}</i> 积分
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="10">
                <a-button type="primary" shape="round" @click="confirmPayment">
                  确认支付
                </a-button>
              </a-col>
            </a-row>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>

    <!-- <div class="gpt-list-footer">
      <p>说明：</p>
      <p>下载单个txt:单个文章每个文字开头会有关键词每篇文章以----隔开</p>
      <p>下载压缩包:每篇文章一个txt文件名为关键词，单个关键词多篇文章 关键词后面加数字</p>
    </div> -->
  </div>
</template>

<script>
export default {
  created () {
    this.getRechargeCombo()
  },
  data () {
    return {
      // 充值套餐
      rechargeComboData: [],
      // 当前帐号
      currentAccount: window.localStorage.getItem('nick_name'),
      // 积分金额
      integralAmount: 1,
      // 支付宝 Or 微信
      payType: 1,
      // 实付
      actuallyPaid: 0,
      // 赠送积分
      presentExp: 0,
      // 获得积分
      getPoint: 0
    }
  },
  methods: {
    // 获取充值套餐
    async getRechargeCombo () {
      const { data: res } = await this.$http.get('rcl')
      if (res.status !== 0) return this.$message.error(res.reason)
      this.rechargeComboData = res.list
      res.list.map(v => {
        if (v.id === this.integralAmount) {
          this.actuallyPaid = v.rmb_fen / 100
          this.presentExp = v.gift_coin
          this.getPoint = v.coin
        }
      })
    },
    // 支付跳转
    async confirmPayment () {
      const { data: res } = await this.$http.post('rc', {
        id: this.integralAmount
      })
      if (res.status !== 0) return this.$message.error(res.reason)
      window.open(res.pay_link)
    },
    // 实付
    choiceCombo () {
      this.rechargeComboData.map(v => {
        if (v.id === this.integralAmount) {
          this.actuallyPaid = v.rmb_fen / 100
          this.presentExp = v.gift_coin
          this.getPoint = v.coin
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.list_container {
  line-height: normal;
  background-color: #fff;
  border-radius: 20px;
  border: 1px solid transparent;
  h3 {
    background-color: #FAFAFA;
    text-align: left;
    border-radius: 20px 20px 0 0;
    padding: 12px 40px;
    font-weight: bold;
    font-size: 16px;
  }
  .scorePanel {
    margin: 20px 40px;
    .integralAmountVal .ant-radio-wrapper-checked .integralAmountValItem {
      border: 1px solid #0039FD !important;
      position: relative;
    }
    .integralAmountVal .ant-radio-wrapper-checked .integralAmountValItem::after {
      content: '\2713';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 15px;
      height: 15px;
      border: 15px solid transparent;
      border-bottom-color: #0039FD;
      border-right-color: #0039FD;
      border-radius: 0 0 8px 0;
      color: #fff;
      line-height: 15px;
    }
    /deep/ .integralAmountVal .ant-radio {
      display: none;
    }
    /deep/ .ant-tabs-bar {
      margin: 0;
    }
    /deep/ .ant-tabs-nav {
      width: 100%;
      div[role="tab"] {
        width: 50%;
      }
      div[role="tab"]:nth-child(1) {
        border-radius: 16px 0 0 0;
      }
      div[role="tab"]:nth-child(2) {
        border-radius: 0 16px 0 0;
      }
    }
  }
  .gpt-list-footer {
    color: #ACACAC;
    text-align: left;
    padding: 40px;
  }
}
</style>
