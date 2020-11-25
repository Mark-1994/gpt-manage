<template>
  <div class="users_container">
    <a-row type="flex" justify="space-between" align="top" class="gpt-header">
      <a-col :span="6">
        <a-row class="gpt-header-left" :gutter="[0, 15]">
          <a-col>
            <img src="../../assets/gpt-member.png" alt="" />
          </a-col>
          <a-col>
            <a-avatar :size="128" :src="require('../../assets/gpt-head.png')" />
          </a-col>
          <a-col class="gpt-name">我的昵称</a-col>
          <a-col>
            <a-button type="primary" shape="round" size="large">
              充值会员
            </a-button>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="9">
        <a-row class="gpt-header-right" :gutter="[0, 15]">
          <a-col>
            <a-progress type="circle" :percent="75" :width="184" :strokeWidth="10" strokeColor="#FFB41D">
              <template #format="percent">
                <span style="color: #FF4747;font-weight: bold;font-size: 24px;">{{ percent }}</span>
                <p style="margin-top: 25px;font-size: 16px;">当前积分</p>
              </template>
            </a-progress>
          </a-col>
          <a-col>
            <a-button type="primary" shape="round" size="large" ghost>
              今日积分
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
            <a-col class="gpt-content-num">13800</a-col>
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
            <a-col class="gpt-content-num">20</a-col>
            <a-col>
              <a-button type="primary" shape="round" size="large">
                创建文章模型
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
            <a-col class="gpt-content-num">100</a-col>
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
            <a-col class="gpt-content-num">0</a-col>
            <a-col>
              <a-button type="primary" shape="round" size="large">
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
        <a-table :columns="columns" :data-source="data" bordered :pagination="false">
          <template slot="name" slot-scope="text">
            <a>{{ text }}</a>
          </template>
        </a-table>
      </a-col>
    </a-row>
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
          title: 'Name',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: 'Cash Assets',
          className: 'column-money',
          dataIndex: 'money'
        },
        {
          title: 'Address',
          dataIndex: 'address'
        }
      ],
      data: [
        {
          key: '1',
          name: 'John Brown',
          money: '￥300,000.00',
          address: 'New York No. 1 Lake Park'
        },
        {
          key: '2',
          name: 'Jim Green',
          money: '￥1,256,000.00',
          address: 'London No. 1 Lake Park'
        },
        {
          key: '3',
          name: 'Joe Black',
          money: '￥120,000.00',
          address: 'Sidney No. 1 Lake Park'
        }
      ]
    }
  },
  methods: {
    // 获取用户信息
    async getUserInfo () {
      const { data: res } = await this.$http.get('pg/index')
      if (res.status !== 0) return this.$message.error(res.reason)
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
