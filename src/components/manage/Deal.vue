<template>
  <div>
    <a-row>
      <a-col>
        <div class="gpt-article-generate">
          <h3>文章处理</h3>
          <div style="text-align: left;padding: 15px 40px 40px;color: rgba(0, 0, 0, 0.85);">
            <a-steps :current="current">
              <a-step v-for="item in steps" :key="item.title" :title="item.title" />
            </a-steps>
            <div class="steps-content">
              <div class="content-box" v-if="current === 0">
                <a-row :gutter="[16, 16]">
                  <a-col :span="12">
                    <a-button type="primary" block style="border-radius: 4px 4px 0 0;">
                      地域词
                    </a-button>
                    <a-textarea placeholder="地区 关键词格式：每行一个" :rows="10" v-model="area" style="border-radius: 0 0 4px 4px;" />
                    <a-button type="dashed" block style="margin-top: 8px;">
                      小助手
                    </a-button>
                  </a-col>
                  <a-col :span="12">
                    <a-button type="primary" block style="border-radius: 4px 4px 0 0;">
                      词头
                    </a-button>
                    <a-textarea placeholder="词头 关键词格式：每行一个" :rows="10" v-model="prefix" style="border-radius: 0 0 4px 4px;" />
                    <a-button type="dashed" block style="margin-top: 8px;">
                      小助手
                    </a-button>
                  </a-col>
                  <a-col :span="12">
                    <a-button type="primary" block style="border-radius: 4px 4px 0 0;">
                      主词
                    </a-button>
                    <a-textarea placeholder="主词 关键词格式：每行一个" :rows="10" v-model="mk" disabled style="border-radius: 0 0 4px 4px;" />
                    <a-button type="dashed" block style="margin-top: 8px;">
                      小助手
                    </a-button>
                  </a-col>
                  <a-col :span="12">
                    <a-button type="primary" block style="border-radius: 4px 4px 0 0;">
                      词尾
                    </a-button>
                    <a-textarea placeholder="词尾 关键词格式：每行一个" :rows="10" v-model="tail" style="border-radius: 0 0 4px 4px;" />
                    <a-button type="dashed" block style="margin-top: 8px;">
                      小助手
                    </a-button>
                  </a-col>
                </a-row>
                <a-row style="text-align: left;">
                  <a-col>
                    <a-checkbox-group v-model="value" @change="compoundMode">
                      <a-row>
                        <a-col :span="8">
                          <a-checkbox :value="0">
                            【主词】
                          </a-checkbox>
                        </a-col>
                        <a-col :span="8">
                          <a-checkbox :value="1">
                            【地区】【主词】
                          </a-checkbox>
                        </a-col>
                        <a-col :span="8">
                          <a-checkbox :value="2">
                            【词头】【主词】
                          </a-checkbox>
                        </a-col>
                        <a-col :span="8">
                          <a-checkbox :value="3">
                            【主词】【词尾】
                          </a-checkbox>
                        </a-col>
                        <a-col :span="8">
                          <a-checkbox :value="4">
                            【地区】【词头】【主词】
                          </a-checkbox>
                        </a-col>
                        <a-col :span="8">
                          <a-checkbox :value="5">
                            【词头】【主词】【词尾】
                          </a-checkbox>
                        </a-col>
                        <a-col :span="8">
                          <a-checkbox :value="6">
                            【地区】【主词】【词尾】
                          </a-checkbox>
                        </a-col>
                        <a-col :span="8">
                          <a-checkbox :value="7">
                            【地区】【词头】【主词】【词尾】
                          </a-checkbox>
                        </a-col>
                      </a-row>
                    </a-checkbox-group>
                  </a-col>
                </a-row>
              </div>
              <div class="content-box" v-else-if="current === 1">
                <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                  <a-form-item label="项目名">
                    <a-input v-model="downloadArticle.gn" disabled />
                  </a-form-item>
                  <a-form-item label="插入段首">
                    <a-input v-model="downloadArticle.post_prefix" />
                  </a-form-item>
                  <a-form-item label="插入段尾">
                    <a-input v-model="downloadArticle.post_suffix" />
                  </a-form-item>
                  <a-form-item label="小标题" extra="将标题以H2形式插入到文章内容中。只插入一次。" style="text-align: left;">
                    <a-radio-group v-model="downloadArticle.enable_subtt">
                      <a-radio :value="1">
                        是
                      </a-radio>
                      <a-radio :value="0">
                        否
                      </a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="关键词加粗" extra="是否关键词(即文章前缀)加粗" style="text-align: left;">
                    <a-radio-group v-model="downloadArticle.kw_bold">
                      <a-radio :value="1">
                        是
                      </a-radio>
                      <a-radio :value="0">
                        否
                      </a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="内链加粗" style="text-align: left;">
                    <a-radio-group v-model="downloadArticle.il_bold">
                      <a-radio :value="1">
                        是
                      </a-radio>
                      <a-radio :value="0">
                        否
                      </a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="内链组" style="text-align: left;">
                    <a-button class="editable-add-btn" @click="showModal">
                      新增内链
                    </a-button>
                    <a-table :columns="columns" :data-source="data" bordered size="small" rowKey="id" :row-selection="rowSelection" :pagination="pagination">
                      <template slot="create_at" slot-scope="text">
                        {{ text | dateFormat }}
                      </template>

                      <template
                        v-for="col in ['gn', 'link', 'value']"
                        :slot="col"
                        slot-scope="text, record"
                      >
                        <div :key="col">
                          <a-input
                            v-if="record.editable"
                            style="margin: -5px 0"
                            :value="text"
                            @change="e => handleChange(e.target.value, record.id, col)"
                          />
                          <template v-else>
                            {{ text }}
                          </template>
                        </div>
                      </template>

                      <template slot="handle" slot-scope="record">

                        <span v-if="record.editable">
                          <a @click="() => save(record.id)">保存</a>&nbsp;
                          <a-popconfirm title="确定取消?" @confirm="() => cancel(record.id)">
                            <a>取消</a>
                          </a-popconfirm>
                        </span>
                        <span v-else>
                          <a :disabled="editingKey !== ''" @click="() => edit(record.id)">编辑</a>
                        </span>

                        <a-divider type="vertical" />
                        <a-popconfirm
                          v-if="data.length"
                          title="确定删除?"
                          @confirm="() => onDelete(record.id)"
                        >
                          <a href="javascript:;">删除</a>
                        </a-popconfirm>
                      </template>
                    </a-table>
                  </a-form-item>
                  <a-form-item label="文本格式" style="text-align: left;">
                    <a-radio-group v-model="downloadArticle.ptag">
                      <a-radio :value="0">
                        纯文本格式
                      </a-radio>
                      <a-radio :value="1">
                        富文本格式
                      </a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <!-- <a-form-item label="下载方式" style="text-align: left;">
                    <a-radio-group v-model="downloadArticle.dl_opt">
                      <a-radio :value="1">
                        所有文章装进一个 txt 中
                      </a-radio>
                      <a-radio :value="2">
                        每个文章一个 txt,装进压缩包
                      </a-radio>
                    </a-radio-group>
                  </a-form-item> -->
                </a-form>
              </div>
              <div class="content-box" v-else-if="current === 2">
                <a-table :columns="articleListColumns" :data-source="articleListData" bordered :row-selection="articleListRowSelection">
                  <template slot="txt" slot-scope="text, record">
                    <a href="javascript:;" :title="text" @click="contentEditShowModal(record)">
                      {{ text }}
                    </a>
                  </template>
                </a-table>
              </div>
            </div>
            <div class="steps-action">
              <a-button v-if="current < steps.length - 1" type="primary" @click="next">
                下一步
              </a-button>
              <a-button
                v-if="current == steps.length - 1"
                type="primary"
                @click="downloadArticleBtn"
              >
                下载
              </a-button>
              <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">
                上一步
              </a-button>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- 新增内链 对话框 -->
    <a-modal v-model="visible" title="新增内链" @ok="handleOk">
      <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-form-item label="分组名">
          <a-input v-model="newAddInternalChain.gn" />
        </a-form-item>
        <a-form-item label="内链">
          <a-input v-model="newAddInternalChain.link" />
        </a-form-item>
        <a-form-item label="关键词" extra="关键词以 “,” 分隔">
          <a-textarea placeholder="" :rows="2" v-model="newAddInternalChain.value" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 内容编辑器 对话框 -->
    <a-modal v-model="contentEditVisible" :title="contentEditCacheRecord.tt" :footer="null" width="80%">
      <quill-editor v-model="contentEditCacheRecord.txt"></quill-editor>
    </a-modal>

  </div>
</template>

<script>
import JSZip from 'jszip'
import FileSaver from 'file-saver'
const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    scopedSlots: { customRender: 'id' }
  },
  {
    title: '分组名',
    dataIndex: 'gn',
    scopedSlots: { customRender: 'gn' }
  },
  {
    title: '链接',
    dataIndex: 'link',
    scopedSlots: { customRender: 'link' }
  },
  {
    title: '关键词',
    dataIndex: 'value',
    scopedSlots: { customRender: 'value' },
    ellipsis: true
  },
  {
    title: '时间',
    dataIndex: 'create_at',
    scopedSlots: { customRender: 'create_at' }
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'handle' }
  }
]

const articleListColumns = [
  {
    title: '序号',
    dataIndex: 'key',
    scopedSlots: { customRender: 'key' }
  },
  {
    title: '标题',
    dataIndex: 'tt',
    scopedSlots: { customRender: 'tt' }
  },
  {
    title: '内容',
    dataIndex: 'txt',
    scopedSlots: { customRender: 'txt' },
    ellipsis: true
  }
]

export default {
  created () {
    this.getIlls()
    this.meansJudgement()
    this.getMkDefaultVal()
    this.getAllSubject(this.downloadArticle.gn)
  },
  data () {
    return {
      columns,
      data: [],
      articleListColumns,
      articleListData: [],
      current: 0,
      steps: [
        {
          title: '标题处理',
          content: 'First-content'
        },
        {
          title: '内容处理',
          content: 'Second-content'
        },
        {
          title: '完成',
          content: 'Last-content'
        }
      ],
      // 组合方式
      value: [0],
      // 新增内链对话框 显示/隐藏
      visible: false,
      // 新增内链 参数
      newAddInternalChain: {
        gn: '',
        link: '',
        value: ''
      },
      // 下载生成的文章 参数
      downloadArticle: {
        // 标题处理
        tt: [
          {
            type: 'mk',
            strs: []
          }
        ],
        // 内容处理
        post_prefix: '',
        post_suffix: '',
        enable_subtt: 0,
        kw_bold: 0,
        il_bold: 0,
        il_gn: '',
        ptag: 0,
        // -------------------------
        gn: window.sessionStorage.getItem('itemName'),
        dl_opt: 1
      },
      // 地区
      area: '',
      // 词头
      prefix: '',
      // 主词
      mk: '',
      // 词尾
      tail: '',
      // 内链组 分页器 配置
      pagination: {
        defaultPageSize: 5
      },
      editingKey: '',
      cacheData: [],
      // 选中项 文章
      selectedItem: [],
      // 内容编辑对话框 显示/隐藏
      contentEditVisible: false,
      // 内容编辑对话框 数据
      contentEditRecord: {},
      // 缓存 内容编辑对话框 数据
      contentEditCacheRecord: {}
    }
  },
  computed: {
    rowSelection () {
      return {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
          this.downloadArticle.il_gn = selectedRows[0].gn
        }
      }
    },
    articleListRowSelection () {
      return {
        // 选中项发生变化时的回调
        onChange: (selectedRowKeys, selectedRows) => {
          // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          this.selectedItem = selectedRows
        },
        // 用户手动选择/取消选择某列的回调
        onSelect: (record, selected, selectedRows) => {
          // console.log(record, selected, selectedRows)
        },
        // 用户手动选择/取消选择所有列的回调
        onSelectAll: (selected, selectedRows, changeRows) => {
          // console.log(selected, selectedRows, changeRows)
        }
      }
    }
  },
  methods: {
    next () {
      if (this.current === 1) {
        this.downloadArticleEvent()
      }
      this.current++
    },
    prev () {
      this.current--
    },
    // 下载
    downloadArticleBtn () {
      if (!this.selectedItem.length) return false
      this.getArticleTxt(this.selectedItem)
    },
    // 下载文章事件
    async downloadArticleEvent () {
      this.compoundMode()
      const { data: res } = await this.$http.post('dlpost', this.downloadArticle)
      if (res.status !== 0) return this.$message.error(res.reason)
      let i = 0
      this.articleListData = res.posts.map(v => {
        i++
        return { ...v, key: i }
      })
      // if (this.downloadArticle.dl_opt === 2) {
      //   return window.open(`http://api.91nlp.cn/dlzip?fn=${res.fn}`)
      // } else {
      //   const { data: response } = await this.$http.get(`http://api.91nlp.cn/dlzip?fn=${res.fn}`, {
      //     responseType: 'blob'
      //   })
      //   const blob = new Blob([response])
      //   const link = document.createElement('a')
      //   link.href = URL.createObjectURL(blob)
      //   link.download = this.downloadArticle.gn
      //   link.click()
      //   URL.revokeObjectURL(link.href)
      // }
    },
    // 获取内链列表
    async getIlls () {
      const { data: res } = await this.$http.get('ills')
      if (res.status !== 0) return this.$message.error(res.reason)
      this.data = res.list
      this.cacheData = res.list
    },
    // 新增内链 显示/隐藏
    showModal () {
      this.visible = true
    },
    // 新增内链 对话框 确定按钮
    handleOk () {
      this.getCil(this.newAddInternalChain)
    },
    // 新增内链 接口
    async getCil (obj) {
      const { data: res } = await this.$http.post('cil', obj)
      if (res.status !== 0) return this.$message.error(res.reason)
      this.getIlls()
      this.visible = false
    },
    // 删除内链
    async onDelete (val) {
      const { data: res } = await this.$http.get(`rmil?ilid=${val}`)
      if (res.status !== 0) return this.$message.error(res.reason)
      const dataSource = [...this.data]
      this.data = dataSource.filter(item => item.id !== val)
    },
    // 判断是否携带 项目名 参数
    meansJudgement () {
      if (!this.downloadArticle.gn) return this.$router.push('/list')
    },
    // 组合方式
    compoundMode () {
      // this.downloadArticle.tt = [[{ type: 'mk', strs: ['gpt', 'seo优化'] }]]
      this.downloadArticle.tt = []
      for (let i = 0; i < this.value.length; i++) {
        const cacheData = []
        switch (this.value[i]) {
          case 0:
            cacheData.push({
              type: 'mk',
              strs: this.mk.trim() ? this.mk.trim().split('\n') : []
            })
            // this.downloadArticle.tt = [
            //   {
            //     type: 'mk',
            //     strs: []
            //   }
            // ]
            break
          case 1:
            cacheData.push({
              type: 'area',
              strs: this.area.trim() ? this.area.trim().split('\n') : []
            })
            cacheData.push({
              type: 'mk',
              strs: this.mk.trim() ? this.mk.trim().split('\n') : []
            })
            // this.downloadArticle.tt = [
            //   {
            //     type: 'area',
            //     strs: []
            //   },
            //   {
            //     type: 'mk',
            //     strs: []
            //   }
            // ]
            break
          case 2:
            cacheData.push({
              type: 'prefix',
              strs: this.prefix.trim() ? this.prefix.trim().split('\n') : []
            })
            cacheData.push({
              type: 'mk',
              strs: this.mk.trim() ? this.mk.trim().split('\n') : []
            })
            // this.downloadArticle.tt = [
            //   {
            //     type: 'prefix',
            //     strs: []
            //   },
            //   {
            //     type: 'mk',
            //     strs: []
            //   }
            // ]
            break
          case 3:
            cacheData.push({
              type: 'mk',
              strs: this.mk.trim() ? this.mk.trim().split('\n') : []
            })
            cacheData.push({
              type: 'tail',
              strs: this.tail.trim() ? this.tail.trim().split('\n') : []
            })
            // this.downloadArticle.tt = [
            //   {
            //     type: 'mk',
            //     strs: []
            //   },
            //   {
            //     type: 'tail',
            //     strs: []
            //   }
            // ]
            break
          case 4:
            cacheData.push({
              type: 'area',
              strs: this.area.trim() ? this.area.trim().split('\n') : []
            })
            cacheData.push({
              type: 'prefix',
              strs: this.prefix.trim() ? this.prefix.trim().split('\n') : []
            })
            cacheData.push({
              type: 'mk',
              strs: this.mk.trim() ? this.mk.trim().split('\n') : []
            })
            // this.downloadArticle.tt = [
            //   {
            //     type: 'area',
            //     strs: []
            //   },
            //   {
            //     type: 'prefix',
            //     strs: []
            //   },
            //   {
            //     type: 'mk',
            //     strs: []
            //   }
            // ]
            break
          case 5:
            cacheData.push({
              type: 'prefix',
              strs: this.prefix.trim() ? this.prefix.trim().split('\n') : []
            })
            cacheData.push({
              type: 'mk',
              strs: this.mk.trim() ? this.mk.trim().split('\n') : []
            })
            cacheData.push({
              type: 'tail',
              strs: this.tail.trim() ? this.tail.trim().split('\n') : []
            })
            // this.downloadArticle.tt = [
            //   {
            //     type: 'prefix',
            //     strs: []
            //   },
            //   {
            //     type: 'mk',
            //     strs: []
            //   },
            //   {
            //     type: 'tail',
            //     strs: []
            //   }
            // ]
            break
          case 6:
            cacheData.push({
              type: 'area',
              strs: this.area.trim() ? this.area.trim().split('\n') : []
            })
            cacheData.push({
              type: 'mk',
              strs: this.mk.trim() ? this.mk.trim().split('\n') : []
            })
            cacheData.push({
              type: 'tail',
              strs: this.tail.trim() ? this.tail.trim().split('\n') : []
            })
            // this.downloadArticle.tt = [
            //   {
            //     type: 'area',
            //     strs: []
            //   },
            //   {
            //     type: 'mk',
            //     strs: []
            //   },
            //   {
            //     type: 'tail',
            //     strs: []
            //   }
            // ]
            break
          case 7:
            cacheData.push({
              type: 'area',
              strs: this.area.trim() ? this.area.trim().split('\n') : []
            })
            cacheData.push({
              type: 'prefix',
              strs: this.prefix.trim() ? this.prefix.trim().split('\n') : []
            })
            cacheData.push({
              type: 'mk',
              strs: this.mk.trim() ? this.mk.trim().split('\n') : []
            })
            cacheData.push({
              type: 'tail',
              strs: this.tail.trim() ? this.tail.trim().split('\n') : []
            })
            // this.downloadArticle.tt = [
            //   {
            //     type: 'area',
            //     strs: []
            //   },
            //   {
            //     type: 'prefix',
            //     strs: []
            //   },
            //   {
            //     type: 'mk',
            //     strs: []
            //   },
            //   {
            //     type: 'tail',
            //     strs: []
            //   }
            // ]
            break
        }
        // console.log(cacheData)
        this.downloadArticle.tt.push(cacheData)
      }
    },
    // 主词默认值
    getMkDefaultVal () {
      this.downloadArticle.tt[0].strs = this.mk.split('\n')
    },
    // 编辑按钮
    edit (key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.id)[0]
      this.editingKey = key
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    // 取消编辑按钮
    cancel (key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.id)[0]
      this.editingKey = ''
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.id)[0])
        delete target.editable
        this.data = newData
      }
    },
    // 值改变了
    handleChange (value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.id)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    // 保存按钮
    save (key) {
      const newData = [...this.data]
      const newCacheData = [...this.cacheData]
      const target = newData.filter(item => key === item.id)[0]
      const targetCache = newCacheData.filter(item => key === item.id)[0]
      if (target && targetCache) {
        delete target.editable
        this.data = newData
        Object.assign(targetCache, target)
        this.cacheData = newCacheData
      }
      this.editingKey = ''
      this.updataInternalChainGroup(target)
    },
    // 更新内链组
    async updataInternalChainGroup (val) {
      const { data: res } = await this.$http.post('upil', val)
      if (res.status !== 0) return this.$message.error(res.reason)
    },
    // 下载 文章 .txt
    getArticleTxt (val) {
      const zip = new JSZip()
      for (let i = 0; i < val.length; i++) {
        zip.file(val[i].tt + '-' + i + '.txt', val[i].txt)
      }
      zip.generateAsync({ type: 'blob' })
        .then(content => {
          FileSaver.saveAs(content, this.downloadArticle.gn + '.zip')
        })
    },
    // 内容编辑对话框 显示/隐藏 事件
    contentEditShowModal (val) {
      this.contentEditRecord = val
      this.contentEditCacheRecord = { ...this.contentEditRecord }
      this.contentEditVisible = true
    },
    // 获取任务所有主词
    async getAllSubject (val) {
      const { data: res } = await this.$http.get(`qpf?gn=${val}`)
      if (res.status !== 0) return this.$message.error(res.reason)
      this.mk = res.mks.join('\n')
    }
  }
}
</script>

<style lang="less" scoped>
.gpt-article-generate {
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
}
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  padding: 20px;
}

.steps-action {
  margin-top: 24px;
}
.editable-row-operations a {
  margin-right: 8px;
}
</style>
