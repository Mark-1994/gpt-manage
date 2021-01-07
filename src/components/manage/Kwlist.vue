<template>
  <div class="list_container">
    <h3>关键词列表</h3>

    <div style="margin-bottom: 20px;text-align: left;padding: 0 40px;">
      <a-space :size="6" align="end" :style="{ flexWrap: 'wrap', lineHeight: '40px' }">
        <!-- <a-button type="primary" :style="{ borderRadius: '17px', backgroundColor: '#0039FD', borderColor: '#0039FD' }">
          添加关键词
        </a-button> -->
        <!-- <a-button type="primary" :style="{ borderRadius: '17px', backgroundColor: '#FD3A00', borderColor: '#FD3A00' }">
          删除选中
        </a-button>
        <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
          下载
        </a-button> -->
      </a-space>
    </div>

    <a-table :columns="columns" :data-source="allTask" bordered size="middle" class="gpt-data-table" :row-selection="rowSelection" :scroll="{ x: 1000 }" rowKey="id">
      <template slot="is_push" slot-scope="text">
        <span :style="{ color: text ? 'green' : 'red' }">{{ text ? '是' : '否' }}</span>
      </template>
      <template slot="create_at" slot-scope="text">
        {{ text | dateFormat }}
      </template>
      <template slot="deal" slot-scope="record">
        <a-space :size="2">
          <a-button type="primary" size="small" :disabled="onceAgainPost" @click="editItem(record)">编辑</a-button>
          <!-- <a-button type="danger" icon="delete" size="small" :style="{ backgroundColor: '#FD3A00', borderColor: '#FD3A00' }"></a-button> -->
        </a-space>
      </template>
      <template slot="title">
        <div :style="{ textAlign: 'left' }">
          项目名：<span :style="{ fontWeight: 'bold' }">{{ this.$route.params.gn }}</span>
        </div>
      </template>
    </a-table>

    <div class="gpt-list-footer">
      <div :style="{ textAlign: 'left' }">
        <a-space>
          <a-button type="primary" @click="saveEditContent" :disabled="onceAgainPost">
            保存
          </a-button>
          <!-- <a-button>
            重置
          </a-button> -->
        </a-space>
      </div>
      <!-- <p>说明：</p>
      <p>下载单个txt:单个文章每个文字开头会有关键词每篇文章以----隔开</p>
      <p>下载压缩包:每篇文章一个txt文件名为关键词，单个关键词多篇文章 关键词后面加数字</p> -->
    </div>

    <!-- 编辑 对话框 -->
    <a-modal v-model="editVisible" title="编辑" width="80%" :footer="null">
      <a-input v-model="editPanelData.title" :style="{ marginBottom: '8px' }" placeholder="文章标题" />
      <quill-editor v-model="editPanelData.post"></quill-editor>
    </a-modal>

  </div>
</template>

<script>
export default {
  created () {
    if (!this.$route.params.gn) {
      return this.$router.push('/list')
    }
    this.getKwList(this.$route.params.gn ? this.$route.params.gn : '')
  },
  data () {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      columns: [
        {
          title: '序号',
          dataIndex: 'key',
          align: 'center',
          fixed: 'left',
          width: 100
        },
        {
          title: '关键词',
          dataIndex: 'prefix',
          align: 'center'
        },
        {
          title: '标题',
          dataIndex: 'title',
          align: 'center'
        },
        {
          title: '是否已成功发布',
          dataIndex: 'is_push',
          scopedSlots: { customRender: 'is_push' },
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'create_at',
          scopedSlots: { customRender: 'create_at' },
          align: 'center'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'deal' },
          align: 'center',
          fixed: 'right',
          width: 150
        }
      ],
      // 所有任务进度
      allTask: [],
      // 编辑 对话框 显示|隐藏
      editVisible: false,
      // 编辑 对话框 数据
      editPanelData: {},
      // 点击编辑 保存 id
      idList: {},
      // 是否禁止 二次 编辑提交
      onceAgainPost: this.$route.params.is_modified
    }
  },
  computed: {
    rowSelection () {
      return {
        type: 'checkbox'
      }
    }
  },
  methods: {
    // 定时发布管理 列表
    async getKwList (gn) {
      const { data: res } = await this.$http.get(`pg/plist?gn=${gn}`)
      if (res.status !== 0) return this.$message.error(res.reason)
      let i = 1
      this.allTask = res.list.map(v => {
        return { ...v, key: i++ }
      })
    },
    editItem (rowData) {
      this.idList[rowData.id] = rowData
      this.editPanelData = rowData
      this.editVisible = true
    },
    // 保存编辑的内容
    saveEditContent () {
      const _this = this
      this.$confirm({
        title: '您确定要保存吗？',
        content: <span style="color: red;">一个项目只能保存一次，请谨慎操作！</span>,
        onOk () {
          const updateDate = {
            gn: _this.$route.params.gn,
            list: []
          }
          for (const key in _this.idList) {
            _this.idList[key].tt = _this.idList[key].title
            _this.idList[key].txt = _this.idList[key].post
            updateDate.list.push(_this.idList[key])
          }
          _this.getUpDateArticle(updateDate)
        },
        onCancel () {
          // console.log('Cancel')
        }
      })
    },
    // 批量更新文章
    async getUpDateArticle (updateDate) {
      const { data: res } = await this.$http.post('pg/uppts', updateDate)
      if (res.status !== 0) return this.$message.error(res.reason)
      // this.$route.params.is_modified = !this.$route.params.is_modified
      this.onceAgainPost = true
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
    margin-bottom: 24px;
  }
  .gpt-data-table {
    padding: 0 40px;
  }
  .gpt-list-footer {
    color: #ACACAC;
    text-align: left;
    padding: 40px;
  }
}
</style>
