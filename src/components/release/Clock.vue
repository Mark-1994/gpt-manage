<template>
  <div class="list_container">
    <h3>定时发布管理</h3>

    <div style="margin-bottom: 20px;text-align: left;padding: 0 40px;">
      <a-space :size="6" align="end" :style="{ flexWrap: 'wrap', lineHeight: '40px' }">
        <a-button type="primary" :style="{ borderRadius: '17px', backgroundColor: '#0039FD', borderColor: '#0039FD' }" @click="showAddPanel">
          新增定时发布
        </a-button>
        <!-- <a-button type="primary" :style="{ borderRadius: '17px', backgroundColor: '#FD3A00', borderColor: '#FD3A00' }">
          删除选中
        </a-button>
        <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
          下载
        </a-button> -->
      </a-space>
    </div>

    <a-table :columns="columns" :data-source="allTask" bordered size="middle" class="gpt-data-table" :row-selection="rowSelection" :scroll="{ x: 1500 }" rowKey="id">
      <template slot="create_at" slot-scope="text">
        {{ text | dateFormat }}
      </template>
      <template slot="push_bd" slot-scope="text">
        {{ text ? '是' : '否' }}
      </template>
      <template slot="deal">
        <a-button type="primary" disabled>编辑</a-button>
      </template>
    </a-table>

    <div class="gpt-list-footer">
      <!-- <p>说明：</p>
      <p>下载单个txt:单个文章每个文字开头会有关键词每篇文章以----隔开</p>
      <p>下载压缩包:每篇文章一个txt文件名为关键词，单个关键词多篇文章 关键词后面加数字</p> -->
    </div>

    <!-- 新增定时发布对话框 -->
    <a-modal v-model="addPanelVisible" title="新增定时发布" class="gpt-add-panel" :width="721" :footer="null" destroyOnClose>

      <a-form :form="form" layout="inline" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :colon="false" class="gpt-add-panel-form" @submit="addPanelSave" hideRequiredMark>
        <a-form-item label="任务名称">
          <a-input v-decorator="['task_name', { rules: [{ required: true, message: '不能为空!' }] }]"></a-input>
        </a-form-item>
        <a-form-item label="网站名">
          <a-select v-decorator="['site_name', { rules: [{ required: true, message: '不能为空!' }] }]" @change="handleChange">
            <a-select-option :value="item.site_name" v-for="item in siteNameList" :key="item.id">
              {{ item.site_name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="发布文章库">
          <a-select v-decorator="['post_gn', { rules: [{ required: true, message: '不能为空!' }] }]">
            <a-select-option :value="item.gn" v-for="item in articleNameList" :key="item.create_at">
              {{ item.gn }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="发布模块">
          <a-select v-decorator="['post_module', { rules: [{ required: true, message: '不能为空!' }] }]">
            <a-select-option :value="item.gn" v-for="item in websiteColumnList" :key="item.create_at">
              {{ item.gn }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="条数说明">
          <p :style="{ color: '#000', opacity: '.5', lineHeight: 'normal', margin: '0' }">如果发布条数为0，则发布已选择文章库中所有文章。</p>
        </a-form-item>
        <a-form-item label="每日发布时间区间 单位时">
          <a-input v-decorator="['root', { rules: [{ required: true, message: '不能为空!' }] }]"></a-input>
        </a-form-item>
        <a-form-item label="发布间隔 单位秒">
          <a-input v-decorator="['author', { rules: [{ required: true, message: '不能为空!' }] }]"></a-input>
        </a-form-item>
        <a-form-item label="开始发布日期">
          <a-input v-decorator="['post_orgin', { rules: [{ required: true, message: '不能为空!' }] }]"></a-input>
        </a-form-item>
        <a-form-item style="width: 100%;text-align: center;" :wrapper-col="{ span: 24 }">
          <a-space :size="8">
            <a-button class="gpt-add-panel-sure" html-type="submit">
              保存
            </a-button>
            <a-button class="gpt-add-panel-cancel" @click="addPanelCancel">
              取消
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>

    </a-modal>
  </div>
</template>

<script>
export default {
  created () {
    this.getConfigManage()
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
          title: '网站名',
          dataIndex: 'site_name',
          className: 'item-name',
          align: 'center'
        },
        {
          title: '网址',
          dataIndex: 'link',
          align: 'center'
        },
        {
          title: 'cms类型',
          dataIndex: 'cms_type',
          align: 'center'
        },
        {
          title: '编码',
          dataIndex: 'post_charset',
          align: 'center'
        },
        {
          title: '根目录',
          dataIndex: 'root_dir',
          align: 'center'
        },
        {
          title: '接口地址',
          dataIndex: 'path',
          align: 'center'
        },
        {
          title: '发布用户名',
          dataIndex: 'user',
          align: 'center'
        },
        {
          title: '发布密码',
          dataIndex: 'passwd',
          align: 'center'
        },
        {
          title: '提交百度收录',
          dataIndex: 'push_bd',
          scopedSlots: { customRender: 'push_bd' },
          align: 'center'
        },
        {
          title: '百度站长平台token',
          dataIndex: 'bd_token',
          align: 'center'
        },
        {
          title: '文章来源',
          dataIndex: 'post_orgin',
          align: 'center'
        },
        {
          title: '文章作者',
          dataIndex: 'post_author',
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
      // 上传语料-私有模型 id
      mid: '',
      // 新增定时发布对话框 显示/隐藏
      addPanelVisible: false,
      // 新增定时发布 表单数据
      addPanelData: {
        task_name: '',
        site_name: '',
        post_gn: '',
        post_module: '',
        passwd: '',
        root: '',
        user: '',
        author: '',
        post_orgin: '',
        bd_token: '',
        push_bd: ''
      },
      // 新增定时任务 对话框 网站名 下拉框
      siteNameList: [],
      // 新增定时任务 对话框 发布文章库 下拉框
      articleNameList: [],
      // 新增定时任务 对话框 发布模块 下拉框
      websiteColumnList: []
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
    async getConfigManage () {
      const { data: res } = await this.$http.get('pg/slist')
      if (res.status !== 0) return this.$message.error(res.reason)
      let i = 1
      this.allTask = res.list.map(v => {
        return { ...v, key: i++ }
      })
    },
    // 显示新增定时发布面板
    showAddPanel () {
      this.getSiteNameList()
      this.getArticleNameList(500, 1)
      this.addPanelVisible = true
    },
    // 新增定时发布面板 表单提交
    addPanelSave (e) {
      e.preventDefault()
      this.form.validateFields(async (error, values) => {
        if (!error) {
          const { data: res } = await this.$http.post('pg/nsite', values)
          if (res.status !== 0) return this.$message.error(res.reason)
          this.getConfigManage()
          this.addPanelVisible = false
          this.form.resetFields()
        }
      })
    },
    // 新增定时发布面板 取消按钮
    addPanelCancel () {
      this.addPanelVisible = false
      this.form.resetFields()
    },
    // 获取网站栏目（发布模块）列表
    async getWebsiteColumnList (siteName) {
      const { data: res } = await this.$http.get('pg/ls_lm?site_name=' + siteName)
      if (res.status !== 0) return this.$message.error(res.reason)
      this.websiteColumnList = res.list
    },
    // 获取 网站名 列表
    async getSiteNameList () {
      const { data: res } = await this.$http.get('pg/slist')
      if (res.status !== 0) return this.$message.error(res.reason)
      this.siteNameList = res.list
    },
    // 获取 发布文章库 列表
    async getArticleNameList (rn, pn) {
      const { data: res } = await this.$http.get(`pg/task_ls?rn=${rn}&pn=${pn}`)
      if (res.status !== 0) return this.$message.error(res.reason)
      this.articleNameList = res.list
    },
    handleChange (value) {
      this.getWebsiteColumnList(value)
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
.gpt-add-panel /deep/ .ant-modal-footer {
  text-align: center;
}
.gpt-add-panel-form .ant-form-item {
  width: 50%;
  margin-right: 0;
}
.gpt-add-panel-sure,
.gpt-add-panel-cancel {
  border-radius: 17px;
}
.gpt-add-panel-sure {
  background-color: #0039fd;
  border-color: #0039fd;
  color: #fff;
}
.gpt-add-panel-cancel {
  color: #0039FD;
  border: 2px solid #0039FD;
}
</style>
