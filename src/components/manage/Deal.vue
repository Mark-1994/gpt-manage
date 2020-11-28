<template>
  <div>
    <a-row>
      <a-col>
        <div class="gpt-article-generate">
          <a-form
            :form="form"
            v-bind="formItemLayout"
            @submit="handleSubmit"
            :colon="false"
            labelAlign="left"
            :hideRequiredMark="true"
          >
            <a-form-item label="标题处理" class="gpt-article-generate-title"></a-form-item>

            <a-form-item label="选择任务">
              <a-select default-value="测试1" disabled>
                <a-select-option value="jack">
                  Jack
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="处理方式">
              <a-select>
                <a-select-option value="0">
                  不处理
                </a-select-option>
                <a-select-option value="1">
                  扩展头尾词
                </a-select-option>
                <a-select-option value="2">
                  随机百度新闻标题
                </a-select-option>
                <a-select-option value="3">
                  提取文章第一个句号
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="标题列表">
              <a-table :columns="columns" :data-source="data" bordered>
                <template slot="keywords">
                  <a href="javascript:;">查看</a>
                </template>
                <template slot="create_at" slot-scope="text">
                  {{ text | dateFormat }}
                </template>
                <template slot="type" slot-scope="text">
                  {{ text === 1 ? '前缀' : text === 2 ? '后缀' : '随机标题' }}
                </template>
                <template slot="del">
                  <a href="javascript:;">选择 删除</a>
                </template>
              </a-table>
            </a-form-item>

            <a-form-item label="类型">
              <a-select v-model="typeSelectValue">
                <a-select-option value="前缀">
                  前缀
                </a-select-option>
                <a-select-option value="后缀">
                  后缀
                </a-select-option>
                <a-select-option value="随机标题">
                  随机标题
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="关键词" extra="关键词格式用“，”隔开" style="text-align: left;">
              <a-textarea
                placeholder=""
                :auto-size="{ minRows: 2, maxRows: 6 }"
                v-model="formcreateHeaderGroups.value"
              />
            </a-form-item>

            <a-form-item label="标题命名" style="text-align: left;">
              <a-input placeholder="" style="width: 131px;margin-right: 16px;" v-model="formcreateHeaderGroups.gn" />
              <a-button type="primary" @click="createHeaderGroups">
                保存
              </a-button>
            </a-form-item>

          </a-form>
        </div>
      </a-col>
      <a-col style="margin-top: 25px;">
        <div class="gpt-order-info">
          <a-form :colon="false" :labelCol="{ span: 3, offset: 1 }" :wrapperCol="{ span: 19 }" labelAlign="left">
            <a-form-item label="内容处理" class="gpt-order-info-title"></a-form-item>

            <a-form-item label="内链列表">
              <a-table :columns="internalChainTitle" :data-source="internalChainData" bordered>
                <template slot="keywords">
                  <a href="javascript:;">查看</a>
                </template>
                <template slot="create_at" slot-scope="text">
                  {{ text | dateFormat }}
                </template>
                <template slot="del">
                  <a href="javascript:;">选择 删除</a>
                </template>
              </a-table>
            </a-form-item>

            <a-form-item label="自动内链" style="text-align: left;">
              <a-radio-group>
                <a-radio value="1">是</a-radio>
                <a-radio value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="关键词加粗" style="text-align: left;">
              <a-radio-group>
                <a-radio value="1">是</a-radio>
                <a-radio value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="下载方式" style="text-align: left;">
              <a-radio-group>
                <a-radio value="1">所有文章装进一个 txt 中</a-radio>
                <a-radio value="2">每个文章一个 txt，装进压缩包</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="关键词" extra="关键词格式用“，”隔开" style="text-align: left;">
              <a-textarea
                placeholder=""
                :auto-size="{ minRows: 2, maxRows: 6 }"
                v-model="formCreateInternalChainGroups.value"
              />
            </a-form-item>

            <a-form-item label="内链">
              <a-input placeholder="" v-model="formCreateInternalChainGroups.link" />
            </a-form-item>

            <a-form-item label="分组名" style="text-align: left;">
              <a-input placeholder="" style="width: 131px;margin-right: 16px;" v-model="formCreateInternalChainGroups.gn" />
              <a-button type="primary" @click="createInternalChainGroups">
                保存
              </a-button>
            </a-form-item>

            <a-form-item label=" " style="text-align: left;">
              <a-button @click="downloadArticle" style="background: linear-gradient(0deg, #fb8116 0%, #ffad56 99%);color: #fff;border: 0;">
                下载文章
              </a-button>
            </a-form-item>

          </a-form>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'validate_other' })
  },
  created () {
    this.getTitleList()
    this.getInternalChainList()
  },
  mounted () {
    document.querySelector('.gpt-article-generate-title .ant-form-item-label-left label').style.fontSize = '16px'
    document.querySelector('.gpt-order-info-title .ant-form-item-label-left label').style.fontSize = '16px'
  },
  data: () => ({
    formItemLayout: {
      labelCol: { span: 3, offset: 1 },
      wrapperCol: { span: 19 }
    },
    columns: [
      {
        title: 'id',
        dataIndex: 'key'
      },
      {
        title: '类型',
        dataIndex: 'type',
        scopedSlots: { customRender: 'type' }
      },
      {
        title: '分组名',
        dataIndex: 'gn'
      },
      {
        title: '关键词',
        scopedSlots: { customRender: 'keywords' }
      },
      {
        title: '创建时间',
        dataIndex: 'create_at',
        scopedSlots: { customRender: 'create_at' }
      },
      {
        title: '操作',
        scopedSlots: { customRender: 'del' }
      }
    ],
    data: [],
    // 创建标题分组参数
    formcreateHeaderGroups: {
      type: '',
      gn: '',
      value: ''
    },
    // 类型-下拉框的值
    typeSelectValue: '',
    // 创建内链分组参数
    formCreateInternalChainGroups: {
      link: '',
      gn: '',
      value: ''
    },
    // 内链表格参数
    internalChainTitle: [
      {
        title: 'id',
        dataIndex: 'key'
      },
      {
        title: '分组名',
        dataIndex: 'gn'
      },
      {
        title: '关键词',
        scopedSlots: { customRender: 'keywords' }
      },
      {
        title: '内链',
        dataIndex: 'link'
      },
      {
        title: '创建时间',
        dataIndex: 'create_at',
        scopedSlots: { customRender: 'create_at' }
      },
      {
        title: '操作',
        scopedSlots: { customRender: 'del' }
      }
    ],
    internalChainData: []
  }),
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
        }
      })
    },
    // 获取标题列表
    async getTitleList () {
      const { data: res } = await this.$http.get('ttls')
      if (res.status !== 0) return this.$message.error(res.reason)
      res.list = res.list.map(v => {
        return { ...v, key: v.id }
      })
      this.data = res.list
    },
    // 创建标题分组
    async createHeaderGroups () {
      if (this.typeSelectValue === '前缀') {
        this.formcreateHeaderGroups.type = 1
      } else if (this.typeSelectValue === '后缀') {
        this.formcreateHeaderGroups.type = 2
      } else if (this.typeSelectValue === '随机标题') {
        this.formcreateHeaderGroups.type = 3
      }
      const { data: res } = await this.$http.post('ctt', this.formcreateHeaderGroups)
      if (res.status !== 0) return this.$message.error(res.reason)
      this.getTitleList()
      this.$message.success('创建成功')
    },
    // 获取内链列表
    async getInternalChainList () {
      const { data: res } = await this.$http.get('ills')
      if (res.status !== 0) return this.$message.error(res.reason)
      res.list = res.list.map(v => {
        return { ...v, key: v.id }
      })
      this.internalChainData = res.list
    },
    // 创建内链分组
    async createInternalChainGroups () {
      const { data: res } = await this.$http.post('cil', this.formCreateInternalChainGroups)
      if (res.status !== 0) return this.$message.error(res.reason)
      this.getInternalChainList()
      this.$message.success('创建成功')
    },
    // 下载文章
    async downloadArticle () {
      const { data: res } = await this.$http.post('dlpost', {})
      if (res.status !== 0) return this.$message.error(res.reason)
    }
  }
}
</script>

<style lang="less" scoped>
.gpt-article-generate,
.gpt-order-info {
  background-color: #fff;
  border-radius: 20px;
  .gpt-article-generate-title,
  .gpt-order-info-title {
    background-color: #FAFAFA;
    border-radius: 20px 20px 0 0;
    font-weight: bold;
  }
}
</style>
