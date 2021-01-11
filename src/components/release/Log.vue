<template>
  <div class="list_container">
    <h3>发布记录</h3>

    <a-table :columns="columns" :data-source="allTask" bordered :pagination="{ position: 'bottom' }" size="middle" :scroll="{ x: 900 }">
      <template slot="ptype" slot-scope="text">
        {{ text === '1' ? '在线发布' : '定时发布' }}
      </template>
      <template slot="pstate" slot-scope="text">
        {{ text === 1 ? '成功' : '失败' }}
      </template>
      <template slot="time" slot-scope="text">
        {{ text | dateFormat }}
      </template>
    </a-table>

    <div class="gpt-list-footer">
      <!-- <p>说明：</p>
      <p>1.文章生成后可多次处理，但不会保存处理配置。</p>
      <p>2.删除后文章无法找回，生成中的文章无法处理和删除。</p>
      <p>3.由于文章是机器自动生成如果文章量大可能需要很长时间处理。</p> -->
    </div>
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
          dataIndex: 'key',
          width: 80,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '任务名',
          dataIndex: 'tn',
          width: 110,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '标题',
          dataIndex: 'tt',
          align: 'center'
        },
        {
          title: '发布类型',
          dataIndex: 'ptype',
          scopedSlots: { customRender: 'ptype' },
          align: 'center'
        },
        {
          title: '发布状态',
          dataIndex: 'pstate',
          scopedSlots: { customRender: 'pstate' },
          align: 'center'
        },
        {
          title: '发布失败错误描述',
          dataIndex: 'em',
          align: 'center'
        },
        {
          title: '发布时间',
          dataIndex: 'time',
          scopedSlots: { customRender: 'time' },
          align: 'center'
        }
      ],
      // 所有任务进度
      allTask: []
    }
  },
  methods: {
    // 获取所有任务进度
    async getAllTask (rn, pn) {
      const { data: res } = await this.$http.get(`pg/push_list?rn=${rn}&pn=${pn}`)
      if (res.status === 3) return this.$message.error(res.reason, function () { window.location.href = 'http://a.91nlp.cn/#/login' })
      if (res.status !== 0) return this.$message.error(res.reason)

      let i = 1
      res.list = res.list.map(v => {
        return { ...v, key: i++ }
      })
      this.allTask = res.list
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
