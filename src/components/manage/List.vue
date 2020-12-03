<template>
  <div class="list_container">
    <h3>文章队列</h3>

    <a-table :columns="columns" :data-source="allTask" bordered :pagination="{ position: 'bottom' }" @change="pageTurning">
      <template slot="keywords">
        <a href="javascript:;" @click="showKeywords">查看</a>
      </template>
      <template slot="create_at" slot-scope="text">
        {{ text | dateFormat }}
      </template>
      <template slot="deal">
        <!-- <router-link to="/deal">
          操作
        </router-link> -->
        <a href="javascript:;" @click="handle($event)">操作</a>
      </template>
    </a-table>

    <div class="gpt-list-footer">
      <p>说明：</p>
      <p>下载单个txt:单个文章每个文字开头会有关键词每篇文章以----隔开</p>
      <p>下载压缩包:每篇文章一个txt文件名为关键词，单个关键词多篇文章 关键词后面加数字</p>
    </div>

    <a-modal v-model="visible" :title="projectName" :footer="null">
      <div>
        <a-tag v-for="(item, index) in showKeyword" :key="index">{{item}}</a-tag>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  created () {
    this.getAllTask(500, 1)
  },
  data () {
    return {
      columns: [
        {
          title: '序号',
          dataIndex: 'key'
        },
        {
          title: '项目名',
          dataIndex: 'gn',
          className: 'item-name'
        },
        {
          title: '字数',
          dataIndex: 'wn',
          sorter: (a, b) => a.wn - b.wn
        },
        {
          title: '文章数量',
          dataIndex: 'post_num',
          sorter: (a, b) => a.post_num - b.post_num
        },
        {
          title: '关键词',
          scopedSlots: { customRender: 'keywords' }
        },
        {
          title: '模型简称',
          dataIndex: 'model_name'
        },
        {
          title: '创建时间',
          dataIndex: 'create_at',
          scopedSlots: { customRender: 'create_at' },
          sorter: (a, b) => a.create_at - b.create_at
        },
        {
          title: '状态',
          dataIndex: 'state',
          filters: [
            {
              text: '生产中',
              value: '生产中'
            },
            {
              text: '完成',
              value: '完成'
            }
          ],
          filterMultiple: false,
          onFilter: (value, record) => record.state.indexOf(value) === 0
        },
        {
          title: '处理',
          scopedSlots: { customRender: 'deal' }
        }
      ],
      // 所有任务进度
      allTask: [],
      // 关键词弹窗显示隐藏
      visible: false,
      // 点击关键词查看的项目名
      projectName: '',
      // 展示的关键词
      showKeyword: []
    }
  },
  methods: {
    // 获取所有任务进度
    async getAllTask (rn, pn) {
      const { data: res } = await this.$http.get(`pg/task_ls?rn=${rn}&pn=${pn}`)
      if (res.status !== 0) return this.$message.error(res.reason)
      // res.list = [
      //   {
      //     gn: 'string',
      //     wn: 'number',
      //     post_num: 'number',
      //     prefix: 'string',
      //     model_name: 'string',
      //     create_at: 'number',
      //     state: 1
      //   }, {
      //     gn: 'string',
      //     wn: 'number',
      //     post_num: 'number',
      //     prefix: 'string',
      //     model_name: 'string',
      //     create_at: 'number',
      //     state: 2
      //   }
      // ]
      let i = 1
      res.list = res.list.map(v => {
        v.state = v.state === 1 ? '完成' : '生产中'
        return { ...v, key: i++ }
      })
      this.allTask = res.list
    },
    handle (event) {
      const itemName = event.currentTarget.parentElement.parentElement.children[1].innerText
      window.sessionStorage.setItem('itemName', itemName)
      if (document.querySelector('.articleDeal')) {
        document.querySelector('.articleDeal').click()
      } else {
        document.querySelector('.article-manage>div').click()
        setTimeout(function () { document.querySelector('.articleDeal').click() }, 0)
      }
    },
    // 展示关键词
    async showKeywords () {
      const itemName = event.currentTarget.parentElement.parentElement.children[1].innerText
      this.projectName = itemName
      const { data: res } = await this.$http.get(`pg/kw?gn=${this.projectName}`)
      if (res.status !== 0) return this.$message.error(res.reason)
      this.showKeyword = res.kw.split(',')
      this.visible = true
    },
    // 表格翻页事件
    pageTurning () {
      // console.log('翻页')
    }
  }
}
</script>

<style lang="less" scoped>
.list_container {
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
  .ant-table-wrapper {
    padding: 0 40px;
  }
  .gpt-list-footer {
    color: #ACACAC;
    text-align: left;
    padding: 40px;
  }
}
</style>
