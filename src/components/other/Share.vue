<template>
  <div>
    <!-- 列表 -->
    <div class="giant_screen">
      <a-row type="flex" justify="space-between" align="middle">
        <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" :xxl="8" :offset="1">
          <a-row :gutter="[0, 36]">
            <a-col :span="24">
              <p>通过此链接注册可获得 <span :style="{ color: '#FFD139', fontSize: '48px' }">{{ shareData.nt }}</span> <span :style="{ opacity: '.4' }">元</span> 佣金</p>
              <p>用户注册后可获得首次充值金额的 {{ shareData.rt * 100 }}% 积分</p>
            </a-col>
            <a-col class="expandConvert" :span="24">
              <a-button type="primary" shape="round" :style="{ backgroundColor: '#94A5FF', border: '0' }" @click="copyText">
                复制推广链接
              </a-button>
              <a-button type="primary" shape="round" :style="{ backgroundColor: '#FFC917', border: '0' }" @click="confirm" :disabled="!shareData.ticket">
                提现换积分
              </a-button>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="6" :offset="1">
          <a-row :gutter="[0, 55]">
            <a-col><span :style="{ color: '#FFD139', fontSize: '48px' }">{{ shareData.sn }}</span> <span :style="{ opacity: '.4' }">人</span> </a-col>
            <a-col :style="{ fontSize: '24px' }">已邀请人数</a-col>
          </a-row>
        </a-col>
        <a-col :span="6">
          <a-row :gutter="[0, 55]">
            <a-col><span :style="{ color: '#FFD139', fontSize: '48px' }">{{ shareData.ticket }}</span> <span :style="{ opacity: '.4' }">元</span> </a-col>
            <a-col :style="{ fontSize: '24px' }">我的佣金</a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>

    <!-- 更新 -->
    <div class="list_container" style="margin-top: 25px;border: 1px solid transparent;">
      <h3>邀请记录</h3>
      <a-table :columns="inviteColumns" :data-source="inviteData" bordered size="middle" :style="{ margin: '46px 82px' }">
        <template slot="create_at" slot-scope="text">
          {{ text | dateFormat }}
        </template>
        <template slot="rt" slot-scope="text, record">
          {{ record.rt ? record.rt : '未充值' }}
        </template>
        <template slot="add_up" slot-scope="text, record">
          {{ record.nt + record.rt }}
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
const inviteColumns = [
  {
    title: '序号',
    dataIndex: 'key'
  },
  {
    title: '使用人',
    dataIndex: 'nick_name'
  },
  {
    title: '时间',
    dataIndex: 'create_at',
    scopedSlots: { customRender: 'create_at' }
  },
  {
    title: '注册佣金',
    dataIndex: 'nt'
  },
  {
    title: '充值佣金',
    dataIndex: 'rt',
    scopedSlots: { customRender: 'rt' }
  },
  {
    title: '累计金额 ',
    dataIndex: 'add_up',
    scopedSlots: { customRender: 'add_up' }
  }
]

export default {
  created () {
    this.getShareData()
  },
  data () {
    return {
      inviteColumns,
      inviteData: [],
      shareData: {
        nt: 0,
        rt: 0,
        sn: 0,
        ticket: 0,
        share_id: ''
      }
    }
  },
  methods: {
    async getShareData () {
      const { data: res } = await this.$http.get('pg/share')
      if (res.status === 3) return this.$message.error(res.reason, function () { window.location.href = 'http://a.91nlp.cn/#/login' })
      if (res.status !== 0) return this.$message.error(res.reason)
      this.shareData = res
      let i = 1
      this.inviteData = res.list.map(v => {
        return { ...v, key: i++ }
      })
    },
    // 点击复制
    copyText () {
      const input = document.createElement('input')
      input.value = `http://a.91nlp.cn/#/login?fid=${this.shareData.share_id}`
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      this.$message.info('复制了')
    },
    // 将所有佣金兑换为积分
    confirm () {
      const that = this
      this.$confirm({
        title: '积分兑换',
        content: '您确定将所有佣金兑换为积分吗？',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          that.convert()
        }
      })
    },
    // 将所有佣金兑换为积分
    async convert () {
      const { data: res } = await this.$http.get('extk')
      if (res.status !== 0) return this.$message.error(res.reason)
      setTimeout(() => {
        this.getShareData()
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
.list_container,
.giant_screen {
  line-height: normal;
  background-color: #fff;
  border-radius: 20px;
  h3 {
    background-color: #FAFAFA;
    text-align: left;
    border-radius: 20px 20px 0 0;
    padding: 12px 40px;
    font-weight: bold;
    font-size: 16px;
  }
  /deep/ table {
    th,
    td {
      text-align: center;
    }
  }
}
.giant_screen {
  position: relative;
  padding: 42px 0;
  background: linear-gradient(196deg, #0168ff 0%, #013ee6 100%);
  .expandConvert {
    *zoom: 1;
  }
  .expandConvert button:nth-child(1) {
    float: left;
  }
  .expandConvert button:nth-child(2) {
    float: right;
  }
  .expandConvert:after {
    content: '.';
    display: block;
    visibility: hidden;
    height: 0;
    clear: both;
  }
}
.giant_screen::before {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: #FFFFFF;
  opacity: .3;
  width: 207px;
  height: 127px;
  border-radius: 100% 0 0 0;
}
.giant_screen::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: #FFFFFF;
  width: 257px;
  height: 287px;
  opacity: .2;
  border-radius: 100% 0 0 0;
}
</style>
