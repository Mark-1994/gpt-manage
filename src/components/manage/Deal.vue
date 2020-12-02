<template>
  <div>
    <a-row>
      <a-col>
        <div class="gpt-article-generate">
          <a-form
            v-bind="formItemLayout"
            :colon="false"
            labelAlign="left"
            :hideRequiredMark="true"
            style="border: 1px solid transparent"
          >
            <a-form-item label="标题处理" class="gpt-article-generate-title"></a-form-item>

            <a-form-item label="选择任务">
              <a-select :default-value="itemName" disabled>
                <a-select-option value="jack">
                  Jack
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="处理方式">
              <a-select v-model="headingProcessingVal">
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

            <a-form-item label="标题列表" v-if="headingProcessingVal === '1' || headingProcessingVal === '2'">
              <a-table :row-selection="rowSelection" :columns="columns" :data-source="data" bordered :locale="{ filterConfirm: '确定', filterReset: '重置' }" :scroll="{ x: 200, y: 300 }">
                <!-- <template slot="keywords">
                  <a href="javascript:;" @click="titleKeywords">查看</a>
                </template> -->
                <template slot="create_at" slot-scope="text">
                  {{ text | dateFormat }}
                </template>
                <template slot="type" slot-scope="text">
                  {{ text === 1 ? '前缀' : text === 2 ? '后缀' : '随机标题' }}
                </template>
                <template slot="del">
                  <a href="javascript:;">删除</a>
                </template>
              </a-table>
            </a-form-item>

            <a-form-item label="类型" v-if="headingProcessingVal === '1' || headingProcessingVal === '2'">
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

            <a-form-item label="关键词" extra="关键词格式用“，”隔开" style="text-align: left;" v-if="headingProcessingVal === '1' || headingProcessingVal === '2'">
              <a-textarea
                placeholder=""
                :auto-size="{ minRows: 2, maxRows: 6 }"
                v-model="formcreateHeaderGroups.value"
              />
            </a-form-item>

            <a-form-item label="标题命名" style="text-align: left;" v-if="headingProcessingVal === '1' || headingProcessingVal === '2'">
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
          <a-form :colon="false" :labelCol="{ span: 3, offset: 1 }" :wrapperCol="{ span: 19 }" labelAlign="left" style="border: 1px solid transparent;">
            <a-form-item label="内容处理" class="gpt-order-info-title"></a-form-item>

            <a-form-item label="内链列表">
              <a-table :row-selection="internalChainSelect" :columns="internalChainTitle" :data-source="internalChainData" bordered :scroll="{ x: 200, y: 300 }">
                <!-- <template slot="keywords">
                  <a href="javascript:;">查看</a>
                </template> -->
                <template slot="create_at" slot-scope="text">
                  {{ text | dateFormat }}
                </template>
                <template slot="del">
                  <a href="javascript:;">删除</a>
                </template>
              </a-table>
            </a-form-item>

            <a-form-item label="下载方式" style="text-align: left;">
              <a-radio-group v-model="downloadType">
                <a-radio value="1">所有文章装进一个 txt 中</a-radio>
                <a-radio value="2">每个文章一个 txt，装进压缩包</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="关键词加粗" style="text-align: left;">
              <a-radio-group v-model="autoKeywordsBold">
                <a-radio value="1">是</a-radio>
                <a-radio value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="自动内链" style="text-align: left;">
              <a-radio-group v-model="autoInternalChain">
                <a-radio value="1">是</a-radio>
                <a-radio value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="关键词" extra="关键词格式用“，”隔开" style="text-align: left;" v-if="autoInternalChain === '1'">
              <a-textarea
                placeholder=""
                :auto-size="{ minRows: 2, maxRows: 6 }"
                v-model="formCreateInternalChainGroups.value"
              />
            </a-form-item>

            <a-form-item label="内链" v-if="autoInternalChain === '1'">
              <a-input placeholder="" v-model="formCreateInternalChainGroups.link" />
            </a-form-item>

            <a-form-item label="分组名" style="text-align: left;" v-if="autoInternalChain === '1'">
              <a-input placeholder="" style="width: 131px;margin-right: 16px;" v-model="formCreateInternalChainGroups.gn" />
              <a-button type="primary" @click="createInternalChainGroups">
                保存
              </a-button>
            </a-form-item>

            <a-form-item label=" " style="text-align: left;">
              <a-button style="background: linear-gradient(0deg, #fb8116 0%, #ffad56 99%);color: #fff;border: 0;" @click="downloadArticle">
                下载文章
              </a-button>
            </a-form-item>

          </a-form>
        </div>
      </a-col>
    </a-row>

    <!-- 标题列表-关键词 -->
    <a-modal v-model="titleVisible" title="Basic Modal" :footer="null">
      <div>
        <a-tag v-for="(item, index) in showKeyword" :key="index">{{item}}</a-tag>
      </div>
    </a-modal>

  </div>
</template>

<script>
export default {
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'validate_other' })
  },
  created () {
    this.meansJudgement()
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
        scopedSlots: { customRender: 'type' },
        filters: [
          {
            text: '前缀',
            value: '1'
          },
          {
            text: '后缀',
            value: '2'
          },
          {
            text: '随机',
            value: '3'
          }
        ],
        filterMultiple: false,
        onFilter: (value, record) => (record.type + '').indexOf(value) === 0
      },
      {
        title: '分组名',
        dataIndex: 'gn'
      },
      {
        title: '关键词',
        // scopedSlots: { customRender: 'keywords' },
        dataIndex: 'value',
        ellipsis: true
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
        // scopedSlots: { customRender: 'keywords' },
        dataIndex: 'value',
        ellipsis: true
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
    internalChainData: [],
    // 项目名
    itemName: window.sessionStorage.getItem('itemName'),
    // 标题处理方式
    headingProcessingVal: '',
    // 标题前缀标签
    titlePrefixName: '',
    // 标题后缀标签
    titleSuffixName: '',
    // 随机标题标签
    titleRandomName: '',
    // 是否自动内链
    autoInternalChain: '',
    // 选中的内链分组名
    internalChainName: '',
    // 是否关键词加粗
    autoKeywordsBold: '',
    // 下载方式
    downloadType: '',
    // 标题列表关键词显示隐藏
    titleVisible: false,
    // 标题列表关键词
    showKeyword: []
  }),
  computed: {
    // 标题列表 单选
    rowSelection () {
      return {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
          // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          console.log(selectedRows[0])
          if (selectedRows[0].type === 1) {
            // 当前选择了前缀
            this.titlePrefixName = selectedRows[0].gn
          } else if (selectedRows[0].type === 2) {
            // 当前选择了后缀
            this.titleSuffixName = selectedRows[0].gn
          } else if (selectedRows[0].type === 3) {
            // 当前选择了随机
            this.titleRandomName = selectedRows[0].gn
          }
        }
      }
    },
    // 内链列表 单选
    internalChainSelect () {
      return {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
          // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          this.internalChainName = selectedRows[0].gn
        }
      }
    }
  },
  methods: {
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
      const downloadArgument = {
        gn: this.itemName,
        tt_pm: this.headingProcessingVal,
        tt_pf_gn: this.titlePrefixName,
        tt_tl_gn: this.titleSuffixName,
        tt_rd_gn: this.titleRandomName,
        inner_link: Number(this.autoInternalChain),
        inner_link_gn: this.internalChainName,
        kw_bold: Number(this.autoKeywordsBold),
        dl_opt: Number(this.downloadType)
      }
      const { data: res } = await this.$http.post('dlpost', downloadArgument)
      if (Number(this.downloadType) === 1) {
        this.exportRaw(`${this.itemName}.txt`, res)
      } else if (Number(this.downloadType) === 2) {
        // 下载 zip 压缩包
        if (res.status !== 0) return this.$message.error(res.reason)
        window.open(`http://api.91nlp.cn/dlzip?fn=${res.fn}`)
      }
    },
    // 判断是否是直接进入页面
    meansJudgement () {
      if (!this.itemName) return this.$router.push('/list')
    },
    // 字符串转 txt
    fakeClick (obj) {
      var ev = document.createEvent('MouseEvents')
      ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      obj.dispatchEvent(ev)
    },
    exportRaw (name, data) {
      var urlObject = window.URL || window.webkitURL || window
      var exportBlob = new Blob([data])
      var saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
      saveLink.href = urlObject.createObjectURL(exportBlob)
      saveLink.download = name
      this.fakeClick(saveLink)
    },
    // 标题列表 查看关键词
    async titleKeywords () {
      const itemName = event.currentTarget.parentElement.parentElement.children[3].innerText
      const { data: res } = await this.$http.get(`pg/kw?gn=${itemName}`)
      if (res.status !== 0) return this.$message.error(res.reason)
      this.showKeyword = res.kw.split(',')
      this.titleVisible = true
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
