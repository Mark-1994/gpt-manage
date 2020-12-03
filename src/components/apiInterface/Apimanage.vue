<template>
  <div>
    <!-- 列表 -->
    <div class="list_container" style="padding-bottom: 24px;">
      <h3 style="display: flex;">
        <span>API接口</span>
        <span style="font-weight: normal;font-size: 12px;color: #666;">说明文档</span>
      </h3>

      <a-table :columns="columns" :data-source="allTask" bordered :pagination="false">
        <template slot="upat" slot-scope="text">
          <div v-if="text">{{ text | dateFormat }}</div>
          <div v-else @click="clickUpLoad($event)">
            <a-upload
              name="yl"
              list-type="text"
              :action="`http://api.91nlp.cn/upyl?mid=${mid}`"
              accept=".txt"
              :showUploadList="{ showRemoveIcon: false }"
              :withCredentials="true"
              :before-upload="beforeUpload"
              @change="handleChange"
            >
            <a-button> <a-icon type="upload" /> 点击上传 </a-button>
          </a-upload>
          </div>
        </template>
        <template slot="create_at" slot-scope="text">
          {{ text | dateFormat }}
        </template>
        <template slot="deal">
          <a href="javascript:;" @click="handle($event)">操作</a>
        </template>
        <template slot="enable_api" slot-scope="text">
          <!-- {{ text ? '是' : '否' }} -->
          <a-switch checked-children="开" un-checked-children="关" :default-checked="text ? true : false" @change="control" />
        </template>
      </a-table>

      <!-- <div class="gpt-list-footer">
        <p>说明：</p>
        <p>下载单个txt:单个文章每个文字开头会有关键词每篇文章以----隔开</p>
        <p>下载压缩包:每篇文章一个txt文件名为关键词，单个关键词多篇文章 关键词后面加数字</p>
      </div> -->
    </div>

    <!-- 更新 -->
    <div class="list_container" style="margin-top: 25px;border: 1px solid transparent;">
      <h3>API白名单</h3>

      <a-form :form="form" :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }" labelAlign="left" style="padding: 0 40px;" @submit="handleSubmit">
        <a-form-item label="IP白名单" extra="提示：IP白名单，最多3个，以逗号分隔。" style="text-align: left;">
          <a-textarea
            v-decorator="[
              'wl',
              { rules: [{ required: true, message: '请输入!' }] },
            ]"
            placeholder=""
            :auto-size="{ minRows: 2, maxRows: 6 }"
          />
        </a-form-item>
        <a-form-item :colon="false" label=" " :wrapper-col="{ span: 12 }" style="text-align: left;">
          <a-button type="primary" html-type="submit">
            更新
          </a-button>
        </a-form-item>
      </a-form>

      <!-- <div class="gpt-list-footer">
        <p>说明：</p>
        <p>下载单个txt:单个文章每个文字开头会有关键词每篇文章以----隔开</p>
        <p>下载压缩包:每篇文章一个txt文件名为关键词，单个关键词多篇文章 关键词后面加数字</p>
      </div> -->
    </div>

  </div>
</template>

<script>
export default {
  created () {
    this.getApiInfo()
  },
  data () {
    return {
      columns: [
        {
          title: '序号',
          dataIndex: 'key'
        },
        {
          title: 'IP白名单',
          dataIndex: 'wl'
        },
        {
          title: '是否启用',
          dataIndex: 'enable_api',
          scopedSlots: { customRender: 'enable_api' }
        }
      ],
      // 所有任务进度
      allTask: [],
      // 点击关键词查看的项目名
      projectName: '',
      // 展示的关键词
      showKeyword: [],
      // 充值提示的信息
      rechargeExtra: {},
      // 创建私有模型名称
      modelName: '',
      // 上传语料-私有模型 id
      mid: '',
      form: this.$form.createForm(this)
    }
  },
  methods: {
    handle (event) {
      const itemName = event.currentTarget.parentElement.parentElement.children[1].innerText
      window.sessionStorage.setItem('itemName', itemName)
      document.querySelector('.articleDeal').click()
    },
    // 提交模型
    submitModel () {
      this.getCreatePrivateModel(this.modelName)
    },
    // 限制上传大小
    beforeUpload (file) {
      const isLt2M = file.size / 1024 / 1024 > 100 && file.size / 1024 / 1024 < 1024
      if (!isLt2M) {
        this.$message.error('文件大小不符合要求! 100MB-1024MB')
        return isLt2M
      }
    },
    customRequest (data) {
      const formData = new FormData()
      formData.append('yl', data.file)
      this.saveFile(this.mid, formData)
    },
    clickUpLoad (e) {
      this.mid = e.currentTarget.parentElement.parentElement.children[0].innerText
    },
    // 获取 API 信息
    async getApiInfo () {
      const { data: res } = await this.$http.get('pg/apinfo')
      if (res.status !== 0) return this.$message.error(res.reason)
      this.allTask = [res].map(v => {
        return { ...v, key: 1 }
      })
    },
    // 是否启用api
    async control (checked) {
      const { data: res } = await this.$http.get(`swapi?op=${checked ? 1 : 0}`)
      if (res.status !== 0) return this.$message.error(res.reason)
    },
    // 提交表单
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.updateApiWhiteList(values.wl)
        }
      })
    },
    // 更新 api 白名单
    async updateApiWhiteList (wl) {
      const { data: res } = await this.$http.post('upwl', {
        wl: wl
      })
      if (res.status !== 0) return this.$message.error(res.reason)
      this.getApiInfo()
      this.$message.success('更新了')
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
