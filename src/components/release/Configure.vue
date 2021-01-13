<template>
  <div class="list_container">
    <h3>发布配置管理</h3>

    <div style="margin-bottom: 20px;text-align: left;padding: 0 40px;">
      <a-space :size="6" align="end" :style="{ flexWrap: 'wrap', lineHeight: '40px' }">
        <a-button type="primary" :style="{ borderRadius: '17px', backgroundColor: '#0039FD', borderColor: '#0039FD' }" @click="showAddPanel">
          新增配置
        </a-button>
        <!-- <a-button type="primary" :style="{ borderRadius: '17px', backgroundColor: '#FD3A00', borderColor: '#FD3A00' }">
          删除选中
        </a-button>
        <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
          织梦UTF-8
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
      <template slot="deal" slot-scope="record">
        <a-space :size="2">
          <a-button type="primary" :style="{ backgroundColor: '#0039FD', borderColor: '#0039FD' }" @click="siteCheck(record.id)" size="small">测试</a-button>
          <a-button type="primary" :style="{ backgroundColor: '#0039FD', borderColor: '#0039FD' }" @click="editSiteConfig(record)" size="small">编辑</a-button>
          <a-button type="danger" icon="delete" size="small" :style="{ backgroundColor: '#FD3A00', borderColor: '#FD3A00' }" @click="deleteSiteConfig(record.id)"></a-button>
        </a-space>
      </template>
    </a-table>

    <div class="gpt-list-footer">
      <!-- <p>说明：</p>
      <p>下载单个txt:单个文章每个文字开头会有关键词每篇文章以----隔开</p>
      <p>下载压缩包:每篇文章一个txt文件名为关键词，单个关键词多篇文章 关键词后面加数字</p> -->
    </div>

    <!-- 新增配置对话框 -->
    <a-modal v-model="addPanelVisible" title="新增配置" class="gpt-add-panel" :width="721" :footer="null" destroyOnClose>

      <a-form :form="form" layout="inline" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :colon="false" class="gpt-add-panel-form" @submit="addPanelSave" hideRequiredMark>
        <a-form-item label="网站名称">
          <a-input v-decorator="['site_name', { rules: [{ required: true, message: '不能为空!' }] }]"></a-input>
        </a-form-item>
        <a-form-item label="网站地址">
          <a-input v-decorator="['site_url', { rules: [{ required: true, message: '不能为空!' }] }]"></a-input>
        </a-form-item>
        <a-form-item label="CMS类型">
          <a-select v-decorator="['cms_type', { rules: [{ required: true, message: '不能为空!' }] }]">
            <a-select-option value="织梦(dedeCMS)">
              织梦(dedeCMS)
            </a-select-option>
            <a-select-option value="帝国(empCMS)">
              帝国(empCMS)
            </a-select-option>
            <a-select-option value="WordPress">
              WordPress
            </a-select-option>
            <a-select-option value="Z-BLOG">
              Z-BLOG
            </a-select-option>
            <a-select-option value="discuz">
              discuz
            </a-select-option>
            <a-select-option value="易优CMS(EYouCMS)">
              易优CMS(EYouCMS)
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="接口文件名">
          <a-input v-decorator="['path', { rules: [{ required: true, message: '不能为空!' }] }]"></a-input>
        </a-form-item>
        <a-form-item label="发布登陆密码">
          <a-input-password v-decorator="['passwd', { rules: [{ required: true, message: '不能为空!' }] }]"></a-input-password>
        </a-form-item>
        <a-form-item label="编码格式">
          <a-select v-decorator="['charset', { rules: [{ required: true, message: '不能为空!' }] }]">
            <a-select-option value="UTF-8">
              UTF-8
            </a-select-option>
            <a-select-option value="GBK">
              GBK
            </a-select-option>
            <a-select-option value="GB2312">
              GB2312
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="根目录">
          <a-input v-decorator="['root', { rules: [{ required: true, message: '不能为空!' }] }]"></a-input>
        </a-form-item>
        <a-form-item label="文章作者">
          <a-input v-decorator="['author', { rules: [{ required: true, message: '不能为空!' }] }]"></a-input>
        </a-form-item>
        <a-form-item label="文章来源">
          <a-input v-decorator="['post_orgin', { rules: [{ required: true, message: '不能为空!' }] }]"></a-input>
        </a-form-item>
        <a-form-item label="百度站长TOKEN" v-if="false">
          <a-input v-decorator="['bd_token', { rules: [{ validator: (rule, value, cb) => !bdTokenStatus || value !== '', message: '不能为空!' }], initialValue: '' }]"></a-input>
        </a-form-item>
        <a-form-item label="百度推送" v-if="false">
          <a-radio-group v-decorator="['push_bd', { rules: [{ required: true, message: '不能为空!' }] }]" @change="bdTokenEvent">
            <a-radio :value="true">
              是
            </a-radio>
            <a-radio :value="false">
              否
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="插件下载">
          <a-space :size="14" :style="{ flexWrap: 'wrap', lineHeight: '40px' }">
            <!-- <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
              <a href="http://a.91nlp.cn/plugin/dz.zip" style="color: #fff;" target="_blank">织梦UTF-8</a>
            </a-button>
            <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
              织梦GBK
            </a-button> -->
            <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
              <a href="http://a.91nlp.cn/plugin/dz.zip" style="color: #fff;" target="_blank">discuz</a>
            </a-button>
            <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
              <a href="http://a.91nlp.cn/plugin/emp.zip" style="color: #fff;" target="_blank">帝国CMS</a>
            </a-button>
            <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
              <a href="http://a.91nlp.cn/plugin/ey.zip" style="color: #fff;" target="_blank">易优CMS</a>
            </a-button>
            <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
              <a href="http://a.91nlp.cn/plugin/zblog.zip" style="color: #fff;" target="_blank">Z-BLOG</a>
            </a-button>
          </a-space>
        </a-form-item>
        <a-form-item label="发布用户">
          <a-input v-decorator="['user', { rules: [{ required: true, message: '不能为空!' }] }]"></a-input>
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

      <template slot="footer">
        <a-button class="gpt-add-panel-sure" @click="addPanelSave">保存</a-button>
        <a-button class="gpt-add-panel-cancel" @click="addPanelCancel">取消</a-button>
      </template>
    </a-modal>

    <!-- 编辑网站配置 对话框 -->
    <a-modal v-model="editPanelVisible" title="编辑配置" class="gpt-add-panel" :width="721" :footer="null" destroyOnClose>

      <a-form :form="formEdit" layout="inline" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :colon="false" class="gpt-add-panel-form" @submit="editPanelSave" hideRequiredMark>
        <a-form-item label="网站ID" v-show="false">
          <a-input v-decorator="['id', { rules: [{ required: true, message: '不能为空!' }], initialValue: editPanelData.id }]" disabled></a-input>
        </a-form-item>
        <a-form-item label="网站名称">
          <a-input v-decorator="['site_name', { rules: [{ required: true, message: '不能为空!' }], initialValue: editPanelData.site_name }]"></a-input>
        </a-form-item>
        <a-form-item label="网站地址">
          <a-input v-decorator="['site_url', { rules: [{ required: true, message: '不能为空!' }], initialValue: editPanelData.link }]"></a-input>
        </a-form-item>
        <a-form-item label="CMS类型">
          <a-select v-decorator="['cms_type', { rules: [{ required: true, message: '不能为空!' }], initialValue: editPanelData.cms_type }]">
            <a-select-option value="织梦(dedeCMS)">
              织梦(dedeCMS)
            </a-select-option>
            <a-select-option value="帝国(empCMS)">
              帝国(empCMS)
            </a-select-option>
            <a-select-option value="WordPress">
              WordPress
            </a-select-option>
            <a-select-option value="Z-BLOG">
              Z-BLOG
            </a-select-option>
            <a-select-option value="discuz">
              discuz
            </a-select-option>
            <a-select-option value="易优CMS(EYouCMS)">
              易优CMS(EYouCMS)
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="接口文件名">
          <a-input v-decorator="['path', { rules: [{ required: true, message: '不能为空!' }], initialValue: editPanelData.path }]"></a-input>
        </a-form-item>
        <a-form-item label="发布登陆密码">
          <a-input-password v-decorator="['passwd', { rules: [{ required: true, message: '不能为空!' }], initialValue: editPanelData.passwd }]"></a-input-password>
        </a-form-item>
        <a-form-item label="编码格式">
          <a-select v-decorator="['charset', { rules: [{ required: true, message: '不能为空!' }], initialValue: editPanelData.post_charset }]">
            <a-select-option value="UTF-8">
              UTF-8
            </a-select-option>
            <a-select-option value="GBK">
              GBK
            </a-select-option>
            <a-select-option value="GB2312">
              GB2312
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="根目录">
          <a-input v-decorator="['root', { rules: [{ required: true, message: '不能为空!' }], initialValue: editPanelData.root_dir }]"></a-input>
        </a-form-item>
        <a-form-item label="文章作者">
          <a-input v-decorator="['author', { rules: [{ required: true, message: '不能为空!' }], initialValue: editPanelData.post_author }]"></a-input>
        </a-form-item>
        <a-form-item label="文章来源">
          <a-input v-decorator="['post_orgin', { rules: [{ required: true, message: '不能为空!' }], initialValue: editPanelData.post_orgin }]"></a-input>
        </a-form-item>
        <a-form-item label="百度站长TOKEN" v-if="false">
          <a-input v-decorator="['bd_token', { rules: [{ validator: (rule, value, cb) => !formEdit.getFieldValue('push_bd') || value !== '', message: '不能为空!' }], initialValue: editPanelData.bd_token }]"></a-input>
        </a-form-item>
        <a-form-item label="百度推送" v-if="false">
          <a-radio-group v-decorator="['push_bd', { rules: [{ required: true, message: '不能为空!' }], initialValue: editPanelData.push_bd }]">
            <a-radio :value="true">
              是
            </a-radio>
            <a-radio :value="false">
              否
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="插件下载">
          <a-space :size="14" :style="{ flexWrap: 'wrap', lineHeight: '40px' }">
            <!-- <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
              织梦UTF-8
            </a-button>
            <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
              织梦GBK
            </a-button> -->
            <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
              <a href="http://a.91nlp.cn/plugin/dz.zip" style="color: #fff;" target="_blank">discuz</a>
            </a-button>
            <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
              <a href="http://a.91nlp.cn/plugin/emp.zip" style="color: #fff;" target="_blank">帝国CMS</a>
            </a-button>
            <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
              <a href="http://a.91nlp.cn/plugin/ey.zip" style="color: #fff;" target="_blank">易优CMS</a>
            </a-button>
            <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
              <a href="http://a.91nlp.cn/plugin/zblog.zip" style="color: #fff;" target="_blank">Z-BLOG</a>
            </a-button>
          </a-space>
        </a-form-item>
        <a-form-item label="发布用户">
          <a-input v-decorator="['user', { rules: [{ required: true, message: '不能为空!' }], initialValue: editPanelData.user }]"></a-input>
        </a-form-item>
        <a-form-item style="width: 100%;text-align: center;" :wrapper-col="{ span: 24 }">
          <a-space :size="8">
            <a-button class="gpt-add-panel-sure" html-type="submit">
              保存
            </a-button>
            <a-button class="gpt-add-panel-cancel" @click="editPanelCancel">
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
      formEdit: this.$form.createForm(this, { name: 'coordinatedEdit' }),
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
        // {
        //   title: '提交百度收录',
        //   dataIndex: 'push_bd',
        //   scopedSlots: { customRender: 'push_bd' },
        //   align: 'center'
        // },
        // {
        //   title: '百度站长平台token',
        //   dataIndex: 'bd_token',
        //   align: 'center'
        // },
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
      // 新增配置对话框 显示/隐藏
      addPanelVisible: false,
      // 新增配置 表单数据
      addPanelData: {
        site_name: '',
        site_url: '',
        cms_type: '',
        path: '',
        passwd: '',
        charset: '',
        root: '',
        user: '',
        author: '',
        post_orgin: '',
        bd_token: '',
        push_bd: ''
      },
      // 百度 token 输入框自定义校验
      bdTokenStatus: true,
      // 编辑配置对话框 显示/隐藏
      editPanelVisible: false,
      // 编辑配置对话框 数据
      editPanelData: {}
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
    // 发布配置管理 列表
    async getConfigManage () {
      const { data: res } = await this.$http.get('pg/slist')
      if (res.status !== 0) return this.$message.error(res.reason)
      let i = 1
      this.allTask = res.list.map(v => {
        return { ...v, key: i++ }
      })
    },
    // 显示新增配置面板
    showAddPanel () {
      this.addPanelVisible = true
    },
    // 新增配置面板 表单提交
    addPanelSave (e) {
      e.preventDefault()
      this.form.validateFields(async (error, values) => {
        if (!error) {
          values.push_bd = false
          values.bd_token = ''
          const { data: res } = await this.$http.post('pg/nsite', values)
          if (res.status !== 0) return this.$message.error(res.reason)
          this.getConfigManage()
          this.addPanelVisible = false
          this.form.resetFields()
        }
      })
    },
    // 新增配置面板 取消按钮
    addPanelCancel () {
      this.addPanelVisible = false
      this.form.resetFields()
    },
    bdTokenEvent (e) {
      this.bdTokenStatus = e.target.value
    },
    // 检查网站插件是否部署成功
    async siteCheck (sid) {
      const { data: res } = await this.$http.get(`pg/site_check?sid=${sid}`)
      if (res.status !== 0) return this.$message.error(res.reason)
      this.$message.success('测试成功')
    },
    // 编辑网站配置
    editSiteConfig (values) {
      this.editPanelData = values
      this.editPanelVisible = true
    },
    // 编辑对话框 取消按钮
    editPanelCancel () {
      this.editPanelVisible = false
    },
    // 提交编辑面板
    editPanelSave (e) {
      e.preventDefault()
      this.formEdit.validateFields(async (error, values) => {
        if (!error) {
          this.editSiteConfigEvent(values)
        }
      })
    },
    // 编辑网站配置
    async editSiteConfigEvent (values) {
      values.push_bd = false
      values.bd_token = ''
      const { data: res } = await this.$http.post('pg/mdfsite', values)
      if (res.status !== 0) return this.$message.error(res.reason)
      this.getConfigManage()
      this.editPanelVisible = false
    },
    // 删除网站配置
    deleteSiteConfig (sid) {
      const _this = this
      this.$confirm({
        title: '您确定要删除当前配置项吗？',
        content: '注意：删除配置将会连同相关联的定时任务一起删除，请谨慎操作！',
        onOk () {
          _this.deleteSiteConfigEvent(sid)
        },
        onCancel () {
          // console.log('Cancel')
        }
      })
    },
    // 删除网站配置 事件
    async deleteSiteConfigEvent (sid) {
      const { data: res } = await this.$http.get(`pg/site_del?sid=${sid}`)
      if (res.status !== 0) return this.$message.error(res.reason)
      this.getConfigManage()
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
