<template>
  <div class="list_container">
    <h3>任务发布管理</h3>

    <div style="margin-bottom: 20px;text-align: left;padding: 0 40px;">
      <a-space :size="6" align="end" :style="{ flexWrap: 'wrap', lineHeight: '40px' }">
        <a-button type="primary" :style="{ borderRadius: '17px', backgroundColor: '#0039FD', borderColor: '#0039FD' }" @click="showAddPanel">
          新增发布任务
        </a-button>
      </a-space>
    </div>

    <a-table :columns="columns" :data-source="allTask" bordered size="middle" class="gpt-data-table" :row-selection="rowSelection" :scroll="{ x: 1500 }" rowKey="id">
      <template slot="state" slot-scope="text, record">
        {{ record.dn + record.en >= record.push_num ? '完成' : text ? '发布中' : '停止' }}
      </template>
      <template slot="push_type" slot-scope="text">
        {{ text === '1' ? '立即发布' : '定时发布' }}
      </template>
      <template slot="create_at" slot-scope="text">
        {{ text | dateFormat }}
      </template>
      <template slot="cur_time" slot-scope="text">
        {{ text | dateFormat }}
      </template>
      <template slot="deal" slot-scope="record">
        <a-space :size="2">
          <a-button type="primary" :icon="!(record.dn + record.en >= record.push_num) && record.state ? 'pause' : 'caret-right'" size="small" :disabled="record.dn + record.en >= record.push_num" @click="onChangeState(!record.state, record.id)"></a-button>
          <a-button type="danger" icon="delete" size="small" :style="{ backgroundColor: '#FD3A00', borderColor: '#FD3A00' }" @click="deleteClockTask(record.id)"></a-button>
        </a-space>
      </template>
    </a-table>

    <div class="gpt-list-footer">
      <!-- <p>说明：</p>
      <p>下载单个txt:单个文章每个文字开头会有关键词每篇文章以----隔开</p>
      <p>下载压缩包:每篇文章一个txt文件名为关键词，单个关键词多篇文章 关键词后面加数字</p> -->
    </div>

    <!-- 新增发布任务对话框 -->
    <a-modal v-model="addPanelVisible" title="新增发布任务" class="gpt-add-panel" :width="721" :footer="null" destroyOnClose>

      <a-form :form="form" layout="inline" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :colon="false" class="gpt-add-panel-form" @submit="addPanelSave" hideRequiredMark>
        <a-form-item label="任务名称">
          <a-input v-decorator="['task_name', { rules: [{ required: true, message: '不能为空!' }] }]"></a-input>
        </a-form-item>
        <a-form-item label="网站名">
          <a-select v-decorator="['site_id', { rules: [{ required: true, message: '不能为空!' }] }]" @change="handleChange">
            <a-select-option :value="item.id" v-for="item in siteNameList" :key="item.id">
              {{ item.site_name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="发布文章库">
          <a-select v-decorator="['post_gn', { rules: [{ required: true, message: '不能为空!' }] }]" @change="selectArticleLibrary">
            <a-select-option :value="item.gn" v-for="item in articleNameList" :key="item.create_at">
              {{ item.gn }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="发布模块">
          <a-select v-decorator="['post_module', { rules: [{ required: true, message: '不能为空!' }] }]" :disabled="postModuleDisable">
            <a-select-option :value="item.cname + ',' + item.cid" v-for="item in websiteColumnList" :key="item.cid">
              {{ item.cname }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="发布文章数" :extra="'最大值：' + afterPostNumMax">
          <!-- <a-input-number v-decorator="['post_num', { rules: [{ required: true, message: '不能为空!' }] }]" :min="0" :max="postNumMax" :style="{ width: '100%' }" :disabled="postNumDisable" /> -->
          <a-input-number v-decorator="['post_num', { rules: [{ required: true, message: '不能为空!' }] }]" :min="0" :max="afterPostNumMax" :style="{ width: '100%' }" :disabled="postNumDisable" />
        </a-form-item>
        <a-form-item label="条数说明">
          <p :style="{ color: '#000', opacity: '.5', lineHeight: 'normal', margin: '0' }">如果发布条数为0，则发布已选择文章库中所有文章。</p>
        </a-form-item>
        <a-form-item label="发布说明">
          <p :style="{ color: '#000', opacity: '.5', margin: '0' }">文章发布时间间隔大约为一分钟。</p>
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
    this.getClockManage()
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
          title: '任务名',
          dataIndex: 'task_name',
          align: 'center'
        },
        {
          title: '网站名',
          dataIndex: 'site_name',
          className: 'item-name',
          align: 'center'
        },
        {
          title: '文章库',
          dataIndex: 'post_gn',
          align: 'center'
        },
        {
          title: '发布模块名',
          dataIndex: 'push_module',
          align: 'center'
        },
        {
          title: '发布数量',
          dataIndex: 'push_num',
          align: 'center'
        },
        {
          title: '成功发布数量',
          dataIndex: 'dn',
          align: 'center'
        },
        {
          title: '发布失败数量',
          dataIndex: 'en',
          align: 'center'
        },
        {
          title: '发布开始日期',
          dataIndex: 'start_date',
          align: 'center'
        },
        {
          title: '发布间隔（分钟）',
          dataIndex: 'push_delay',
          align: 'center'
        },
        {
          title: '每日起始时间（时）',
          dataIndex: 'daily_start_at',
          align: 'center'
        },
        {
          title: '每日终止时间（时）',
          dataIndex: 'daily_end_at',
          align: 'center'
        },
        {
          title: '发布模式',
          dataIndex: 'push_type',
          scopedSlots: { customRender: 'push_type' },
          align: 'center'
        },
        {
          title: '发布状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' },
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'create_at',
          scopedSlots: { customRender: 'create_at' },
          align: 'center'
        },
        {
          title: '最近一次发布时间',
          dataIndex: 'cur_time',
          scopedSlots: { customRender: 'cur_time' },
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
      // 新增发布任务对话框 显示/隐藏
      addPanelVisible: false,
      // 新增定时任务 对话框 网站名 下拉框
      siteNameList: [],
      // 新增定时任务 对话框 发布文章库 下拉框
      articleNameList: [],
      // 新增定时任务 对话框 发布模块 下拉框
      websiteColumnList: [],
      // 发布模块 开放|禁止
      postModuleDisable: true,
      // 发布文章数 开放|禁止
      postNumDisable: true,
      // 发布文章数 最大值
      postNumMax: 1,
      // 任务 暂停|启动 防抖
      timer: null,
      // 发布文章数 最大值
      afterPostNumMax: 0
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
    async getClockManage () {
      const { data: res } = await this.$http.get('pg/tdl?push_type=1')
      if (res.status !== 0) return this.$message.error(res.reason)
      let i = 1
      this.allTask = res.list.map(v => {
        return { ...v, key: i++ }
      })
    },
    // 显示新增发布任务面板
    showAddPanel () {
      this.getSiteNameList()
      this.getArticleNameList(500, 1)
      this.postModuleDisable = true
      this.postNumDisable = true
      this.addPanelVisible = true
    },
    // 新增发布任务面板 表单提交
    addPanelSave (e) {
      e.preventDefault()
      this.form.validateFields(async (error, values) => {
        if (!error) {
          const val = {
            ...values,
            post_module: values.post_module.split(',')[0],
            post_module_id: values.post_module.split(',')[1]
          }
          const { data: res } = await this.$http.post('pg/nolpost', val)
          if (res.status !== 0) return this.$message.error(res.reason)
          this.getClockManage()
          this.addPanelVisible = false
        }
      })
    },
    // 新增发布任务面板 取消按钮
    addPanelCancel () {
      this.addPanelVisible = false
      this.form.resetFields()
    },
    // 获取网站栏目（发布模块）列表
    async getWebsiteColumnList (siteId) {
      const { data: res } = await this.$http.get('pg/ls_lm?site_id=' + siteId)
      this.form.resetFields('post_module')
      this.postModuleDisable = true
      if (res.status !== 0) return this.$message.error(res.reason)
      this.websiteColumnList = res.list
      this.postModuleDisable = false
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
    },
    // 选择发布文章库
    selectArticleLibrary (value) {
      this.getEditStatus(value)
      this.articleNameList.map(x => {
        if (x.gn === value) {
          this.postNumMax = x.post_num
        }
      })
    },
    // 启动/停止 定时任务
    async onChangeState (checked, tid) {
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        const { data: res } = await this.$http.get(`pg/sw_td?tid=${tid}&type=${checked ? 1 : 0}`)
        if (res.status !== 0) return this.$message.error(res.reason)
        setTimeout(() => {
          this.getClockManage()
        }, 800)
      }, 500)
    },
    // 删除定时任务
    deleteClockTask (tid) {
      const _this = this
      this.$confirm({
        title: '您确定要删除当前定时任务吗？',
        content: '删除定时任务',
        onOk () {
          _this.deleteClockTaskEvent(tid)
        },
        onCancel () {
          // console.log('Cancel')
        }
      })
    },
    // 删除定时任务 事件
    async deleteClockTaskEvent (tid) {
      const { data: res } = await this.$http.get(`pg/td_del?tid=${tid}`)
      if (res.status !== 0) return this.$message.error(res.reason)
      this.getClockManage()
    },
    // 检查文章组否被编辑过
    async getEditStatus (gn) {
      this.postNumDisable = true
      const { data: res } = await this.$http.get(`pg/pstate?gn=${gn}`)
      if (res.status !== 0) return this.$message.error(res.reason)
      if (!res.is_modified) {
        this.form.resetFields('post_num')
        return this.$message.error(`"${gn}"尚未处理!`)
      }
      this.afterPostNumMax = res.remain_pn
      this.postNumDisable = false
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
