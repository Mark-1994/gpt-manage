<template>
  <div class="list_container">
    <h3>模型列表</h3>

    <div style="margin-bottom: 16px;text-align: left;padding: 0 40px;">
      <a-button type="primary" @click="showCreateModel">
        创建模型
      </a-button>
    </div>

    <a-table :columns="columns" :data-source="allTask" bordered :pagination="{ position: 'bottom' }">
      <template slot="upat" slot-scope="text">
        {{ text === 0 ? '未上传' : (text | dateFormat) }}
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

    <a-modal v-model="visible" title="创建私有模型">
      <a-form>
        <a-form-item label="模型名" :extra="`提示：创建模型需 ${rechargeExtra.cost} 积分，最大语料大小 ${rechargeExtra.max_size} M`">
          <a-input></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
export default {
  created () {
    this.getPrivateModelList(500, 1)
  },
  data () {
    return {
      columns: [
        {
          title: '序号',
          dataIndex: 'pmid'
        },
        {
          title: '模型名',
          dataIndex: 'mn',
          className: 'item-name'
        },
        {
          title: '最大语料大小',
          dataIndex: 'yl_limit'
        },
        {
          title: '状态',
          dataIndex: 'state'
        },
        {
          title: '语料上传成功时间',
          dataIndex: 'upat',
          scopedSlots: { customRender: 'upat' }
        },
        {
          title: '模型创建时间',
          dataIndex: 'create_at',
          scopedSlots: { customRender: 'create_at' }
        }
      ],
      // 所有任务进度
      allTask: [],
      // 关键词弹窗显示隐藏
      visible: false,
      // 点击关键词查看的项目名
      projectName: '',
      // 展示的关键词
      showKeyword: [],
      // 充值提示的信息
      rechargeExtra: {}
    }
  },
  methods: {
    handle (event) {
      const itemName = event.currentTarget.parentElement.parentElement.children[1].innerText
      window.sessionStorage.setItem('itemName', itemName)
      document.querySelector('.articleDeal').click()
    },
    // 私有模型列表
    async getPrivateModelList (rn, pn) {
      const { data: res } = await this.$http.get(`pg/lspm?rn=${rn}&pn=${pn}`)
      if (res.status !== 0) return this.$message.error(res.reason)
      this.allTask = res.list.map(v => {
        v.state = v.state === 1 ? '待上传' : v.state === 2 ? '训练中' : '训练完成'
        return { ...v, key: v.pmid }
      })
      this.rechargeExtra = res.cpm
    },
    // 展示隐藏创建私有模型对话框
    showCreateModel () {
      this.visible = true
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
