<template>
  <div class="login_container" id="components-layout-demo-basic">
    <a-layout>
      <a-layout-header>
        <a-row type="flex" justify="space-between" class="gpt-header">
          <a-col :span="4" class="header-left">
            <img src="../assets/gpt-white.png" alt="" />
          </a-col>
          <a-col :span="4" class="header-right">
            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                CYR0904 <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item key="0">
                  <a href="javascript:;">
                    <a-icon type="user" :style="{ color: '#0039FD' }" /> 个人资料
                  </a>
                </a-menu-item>
                <a-menu-item key="1">
                  <a href="javascript:;">
                    <a-icon type="logout" :style="{ color: '#0039FD' }" /> 退出
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content>
        <a-layout class="gpt-content">
          <a-row class="gpt-content-box" type="flex" justify="center" align="top" :gutter="15">
            <a-col :span="3" style="height: 100%;">
              <a-layout-sider class="gpt-content-left" width="100%" style="height: 100%;">
                <div class="gpt-menu-title">
                  菜单
                </div>
                <a-menu theme="light" :default-selected-keys="['1']" mode="inline" class="gpt-menu-list" @click="gptClickMenu">
                  <a-menu-item key="users">
                    <a-icon type="user" :style="{ fontSize: '16px', color: '#0039FD' }" /><span>个人中心</span>
                  </a-menu-item>
                  <a-sub-menu key="sub1">
                    <span slot="title">
                      <a-icon type="file-done" :style="{ fontSize: '16px', color: '#0039FD' }" /><span>文章管理</span>
                    </span>
                    <a-menu-item key="add">
                      文章生成
                    </a-menu-item>
                    <a-menu-item key="list">
                      文章队列
                    </a-menu-item>
                    <a-menu-item key="deal">
                      文章处理
                    </a-menu-item>
                  </a-sub-menu>
                  <a-sub-menu key="sub2">
                    <span slot="title">
                      <a-icon type="file-protect" :style="{ fontSize: '16px', color: '#0039FD' }" /><span>文章模型</span>
                    </span>
                    <a-menu-item key="5">
                      文章模型1
                    </a-menu-item>
                    <a-menu-item key="6">
                      文章模型2
                    </a-menu-item>
                    <a-menu-item key="7">
                      文章模型3
                    </a-menu-item>
                  </a-sub-menu>
                  <a-sub-menu key="sub3">
                    <span slot="title">
                      <a-icon type="api" :style="{ fontSize: '16px', color: '#0039FD' }" /><span>API接口</span>
                    </span>
                    <a-menu-item key="8">
                      API接口1
                    </a-menu-item>
                    <a-menu-item key="9">
                      API接口2
                    </a-menu-item>
                  </a-sub-menu>
                  <a-sub-menu key="sub4">
                    <span slot="title">
                      <a-icon type="appstore" :style="{ fontSize: '16px', color: '#0039FD' }" /><span>其他</span>
                    </span>
                    <a-menu-item key="10">
                      其他1
                    </a-menu-item>
                    <a-menu-item key="11">
                      其他2
                    </a-menu-item>
                  </a-sub-menu>
                </a-menu>
              </a-layout-sider>
            </a-col>
            <a-col :span="14">
              <a-layout-content class="gpt-branch">
                <router-view/>
              </a-layout-content>
            </a-col>
            <a-col :span="6">
              <a-layout-sider class="gpt-content-right" width="100%">
                <h3><a-icon type="question-circle" :style="{ fontSize: '28px', color: '#0039FD' }" /> 媒体学院</h3>
                <a-list item-layout="horizontal" :data-source="articleTitle" :split="false">
                  <a-list-item slot="renderItem" slot-scope="item">
                    <a-list-item-meta
                      description="2020-10-20 17:00"
                    >
                      <a slot="title" href="javascript:;">{{ item.title }}</a>
                    </a-list-item-meta>
                  </a-list-item>
                </a-list>
              </a-layout-sider>
            </a-col>
          </a-row>
        </a-layout>
      </a-layout-content>
      <!-- <a-layout-footer>
        Footer
      </a-layout-footer> -->
    </a-layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 右侧文章标题
      articleTitle: [
        {
          title: '产品矩阵，品牌必修课（三）'
        }, {
          title: '产品矩阵，品牌必修课（三）'
        }, {
          title: '产品矩阵，品牌必修课（三）'
        }, {
          title: '产品矩阵，品牌必修课（三）'
        }, {
          title: '产品矩阵，品牌必修课（三）'
        }, {
          title: '产品矩阵，品牌必修课（三）'
        }, {
          title: '产品矩阵，品牌必修课（三）'
        }, {
          title: '产品矩阵，品牌必修课（三）'
        }, {
          title: '产品矩阵，品牌必修课（三）'
        }, {
          title: '产品矩阵，品牌必修课（三）'
        }
      ]
    }
  },
  methods: {
    gptClickMenu (item) {
      if (this.$route.path !== `/${item.key}`) {
        this.$router.push(`/${item.key}`)
      }
    }
  }
}
</script>

<style lang="less" scoped>
#components-layout-demo-basic {
  text-align: center;
}
#components-layout-demo-basic .ant-layout-header,
#components-layout-demo-basic .ant-layout-footer {
  background: linear-gradient(135deg,#0168ff, #013ee6);
  box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
  color: #fff;
}
#components-layout-demo-basic .ant-layout-footer {
  line-height: 1.5;
}
#components-layout-demo-basic .ant-layout-sider {
  background: #fff;
  color: #fff;
  line-height: 120px;
}
#components-layout-demo-basic .ant-layout-content {
  color: #fff;
  min-height: 120px;
  line-height: 120px;
}
#components-layout-demo-basic > .ant-layout {
  margin-bottom: 48px;
}
#components-layout-demo-basic > .ant-layout:last-child {
  margin: 0;
}
.header-left img {
  width: 100%;
}
.header-right {
  text-align: right;
}
.header-right .ant-dropdown-link {
  color: #fff;
}
.gpt-content {
  max-width: 1600px;
  margin: 40px auto 0;
}
.gpt-header {
  max-width: 1600px;
  margin: 0 auto;
}
.gpt-branch {
  // margin: 0 17px;
  // border: 1px solid red;
}
.gpt-content-right {
  padding: 20px 40px;
  text-align: left;
  border-radius: 20px;
}
.gpt-content-right h3 {
  line-height: 50px;
}
.gpt-menu-list {
  text-align: left;
  border: 0;
}
.gpt-menu-title {
  background-color: #0039FD;
  line-height: 36px;
  border-radius: 20px 20px 0 0;
}
.gpt-content-left {
  border-radius: 20px;
  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    background-color: rgba(0 ,57 ,253 , .12);
    color: #fff;
  }
  .ant-menu-inline .ant-menu-item::after {
    border: 0;
  }
  .gpt-menu-list>li {
    margin: 0;
  }
}
.gpt-content-box {
  width: 100%;
}
</style>
