<template>
  <div class="list_container">
    <h3>文章队列</h3>

    <a-table :columns="columns" :data-source="allTask" bordered>
      <template slot="keywords">
        <a href="javascript:;">查看</a>
      </template>
      <template slot="create_at" slot-scope="text">
        {{ text | dateFormat }}
      </template>
      <template slot="deal">
        <!-- <router-link to="/deal">
          操作
        </router-link> -->
        <a href="javascript:;" @click="handle()">操作</a>
      </template>
    </a-table>

    <div class="gpt-list-footer">
      <p>说明：</p>
      <p>下载单个txt:单个文章每个文字开头会有关键词每篇文章以----隔开</p>
      <p>下载压缩包:每篇文章一个txt文件名为关键词，单个关键词多篇文章 关键词后面加数字</p>
    </div>
  </div>
</template>

<script>
export default {
  created () {
    this.getAllTask(10, 1)
  },
  data () {
    return {
      columns: [
        {
          title: 'id',
          dataIndex: 'key'
        },
        {
          title: '名称',
          dataIndex: 'gn'
        },
        {
          title: '字数',
          dataIndex: 'wn'
        },
        {
          title: '数量',
          dataIndex: 'post_num'
        },
        {
          title: '关键词',
          scopedSlots: { customRender: 'keywords' }
        },
        {
          title: '开头',
          dataIndex: 'prefix'
        },
        {
          title: '模型名',
          dataIndex: 'model_name'
        },
        {
          title: '创建时间',
          dataIndex: 'create_at',
          scopedSlots: { customRender: 'create_at' }
        },
        {
          title: '状态',
          dataIndex: 'state'
        },
        {
          title: '处理',
          scopedSlots: { customRender: 'deal' }
        }
      ],
      // 所有任务进度
      allTask: []
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
        v.state = v.state === 1 ? '生产中' : '完成'
        return { ...v, key: i++ }
      })
      this.allTask = res.list
    },
    handle () {
      document.querySelector('.articleDeal').click()
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
