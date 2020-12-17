<template>
  <div>
    <!-- 列表 -->
    <div class="list_container" style="padding-bottom: 24px;">
      <h3 style="display: flex;align-items: center;justify-content: space-between;">
        <span>API接口</span>
        <span style="font-weight: normal;font-size: 12px;color: #666;" @click="showDrawer">[说明文档]</span>
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
          <a-switch checked-children="开" un-checked-children="关" :default-checked="text ? true : false" @change="control" :disabled="!apiAuthority" />
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
          <a-button type="primary" html-type="submit" :disabled="!apiAuthority">
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

    <a-drawer width="640" placement="right" :closable="false" :visible="visible" @close="onClose">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="获取账户信息">
          <p>接口地址：http://api.91nlp.cn:5080/api/info</p>
          <p>返回格式：JSON</p>
          <p>请求方式：GET</p>
          <p>请求示例：http://api.91nlp.cn:5080/api/info?key=申请的key</p>
          <p>请求参数：</p>
          <a-table :columns="accountInfoColumns" :data-source="accountInfodata" bordered :pagination="false" size="middle">
            <template slot="description">
              <!-- <span @click="changeShowKey"><a-icon type="eye" />{{ this.showKey ? '显示' : '隐藏' }}</span> -->
              <span @click="changeShowKey"><a-icon :type="this.showKey ? 'eye' : 'eye-invisible'" /></span>
              {{ this.showKey ? this.key : '***' }}
            </template>
          </a-table>
          <p>返回参数说明：</p>
          <a-table :columns="accountInfoReturnColumns" :data-source="accountInfoReturndata" bordered :pagination="false" size="middle">
            <template slot="key" slot-scope="text">
              {{ text }}
            </template>
          </a-table>
          <p>JSON返回示例：</p>
          <pre style="background-color:#f8f8f8;border:1px solid #ededed;padding:10px 15px;line-height:24px;">
{
    "status": 0,
    "balance": 120,
    "model": [
        {
            "id": 1,
            "name": "public",
            "type": 1
        },
        {
            "id": 2,
            "name": "public",
            "type": 1
        },
        {
            "id": 3,
            "name": "public",
            "type": 1
        },
        {
            "id": 4,
            "name": "public",
            "type": 1
        },
        {
            "id": 5,
            "name": "public",
            "type": 1
        }
    ]
}
          </pre>
          <a-divider />
          <p>错误码参照：</p>
          <a-table :columns="errorCodeColumns" :data-source="errorCodeData" bordered :pagination="false" size="middle" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="生成文章">
          <p>接口地址：http://api.91nlp.cn:5080/api/genpost</p>
          <p>返回格式：JSON</p>
          <p>请求方式：POST</p>
          <p>请求示例：http://api.91nlp.cn:5080/api/genpost?key=申请的key</p>
          <p>请求参数：</p>
          <a-table :columns="accountInfoColumns" :data-source="accountInfodata" bordered :pagination="false" size="middle">
            <template slot="description">
              <span @click="changeShowKey"><a-icon :type="this.showKey ? 'eye' : 'eye-invisible'" /></span>
              {{ this.showKey ? this.key : '***' }}
            </template>
          </a-table>
          <a-divider />
          <a-table :columns="generateArticleColumns" :data-source="generateArticleData" bordered :pagination="false" size="middle">
            <template slot="description">
              <span @click="changeShowKey"><a-icon :type="this.showKey ? 'eye' : 'eye-invisible'" /></span>
              {{ this.showKey ? this.key : '***' }}
            </template>
          </a-table>
          <p>返回参数说明：</p>
          <a-table :columns="accountInfoReturnColumns" :data-source="generateArticleReturnData" bordered :pagination="false" size="middle">
            <template slot="key" slot-scope="text">
              {{ text }}
            </template>
          </a-table>
          <p>JSON返回示例：</p>
          <pre style="background-color:#f8f8f8;border:1px solid #ededed;padding:10px 15px;line-height:24px;">
{
    "status": 0
}
          </pre>
          <a-divider />
          <p>错误码参照：</p>
          <a-table :columns="errorCodeColumns" :data-source="generateReturnData" bordered :pagination="false" size="middle" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="获取任务状态">
          <p>接口地址：http://api.91nlp.cn:5080/api/tinfo</p>
          <p>返回格式：JSON</p>
          <p>请求方式：GET</p>
          <p>请求示例：http://api.91nlp.cn:5080/api/tinfo?key=申请的key&gn=要查询的任务名</p>
          <p>请求参数：</p>
          <a-table :columns="accountInfoColumns" :data-source="accountInfodata" bordered :pagination="false" size="middle">
            <template slot="description">
              <span @click="changeShowKey"><a-icon :type="this.showKey ? 'eye' : 'eye-invisible'" /></span>
              {{ this.showKey ? this.key : '***' }}
            </template>
          </a-table>
          <a-divider />
          <a-table :columns="generateArticleColumns" :data-source="taskStatusData" bordered :pagination="false" size="middle">
            <template slot="description">
              <span @click="changeShowKey"><a-icon :type="this.showKey ? 'eye' : 'eye-invisible'" /></span>
              {{ this.showKey ? this.key : '***' }}
            </template>
          </a-table>
          <p>返回参数说明：</p>
          <a-table :columns="accountInfoReturnColumns" :data-source="taskStatusReturnData" bordered :pagination="false" size="middle">
            <template slot="key" slot-scope="text">
              {{ text }}
            </template>
          </a-table>
          <p>JSON返回示例：</p>
          <pre style="background-color:#f8f8f8;border:1px solid #ededed;padding:10px 15px;line-height:24px;">
{
    "gn": "1",
    "tpn": 2,
    "dpn": 2
}
          </pre>
          <a-divider />
          <p>错误码参照：</p>
          <a-table :columns="errorCodeColumns" :data-source="taskReturnData" bordered :pagination="false" size="middle" />
        </a-tab-pane>
        <a-tab-pane key="4" tab="下载生成的文章">
          <p>接口地址：http://api.91nlp.cn:5080/api/dl</p>
          <p>返回格式：JSON</p>
          <p>请求方式：POST</p>
          <p>请求示例：http://api.91nlp.cn:5080/api/dl?key=申请的key</p>
          <p>请求参数：</p>
          <a-table :columns="accountInfoColumns" :data-source="accountInfodata" bordered :pagination="false" size="middle">
            <template slot="description">
              <span @click="changeShowKey"><a-icon :type="this.showKey ? 'eye' : 'eye-invisible'" /></span>
              {{ this.showKey ? this.key : '***' }}
            </template>
          </a-table>
          <a-divider />
          <a-table :columns="generateArticleColumns" :data-source="downloadArticleData" bordered :pagination="false" size="middle">
            <template slot="description">
              <span @click="changeShowKey"><a-icon :type="this.showKey ? 'eye' : 'eye-invisible'" /></span>
              {{ this.showKey ? this.key : '***' }}
            </template>
          </a-table>
          <p>返回参数说明：</p>
          <a-table :columns="accountInfoReturnColumns" :data-source="downloadArticleReturnData" bordered :pagination="false" size="middle">
            <template slot="key" slot-scope="text">
              {{ text }}
            </template>
          </a-table>
          <p>JSON返回示例：</p>
          <pre style="background-color:#f8f8f8;border:1px solid #ededed;padding:10px 15px;line-height:24px;">
{
    status: 0,
    dlink: "http://api.91nlp.cn:5080/dlzip?fn=30831834-72de-4dfe-8cfb-72c3a0c237c4160809025.zip"
}
          </pre>
          <a-divider />
          <p>错误码参照：</p>
          <a-table :columns="errorCodeColumns" :data-source="downloadReturnData" bordered :pagination="false" size="middle" />
        </a-tab-pane>
      </a-tabs>
    </a-drawer>

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
      form: this.$form.createForm(this),
      // 抽屉显示隐藏
      visible: false,
      // 获取账户信息-请求参数
      accountInfoColumns: [
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '类型',
          dataIndex: 'type'
        },
        {
          title: '必填',
          dataIndex: 'must'
        },
        {
          title: '说明（点击 展示 key）',
          dataIndex: 'description',
          scopedSlots: { customRender: 'description' }
        }
      ],
      accountInfodata: [
        {
          key: '1',
          name: 'key',
          type: 'string',
          must: '是',
          description: '申请接口时获取的key'
        }
      ],
      // 生成文章-请求参数
      generateArticleColumns: [
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '类型',
          dataIndex: 'type'
        },
        {
          title: '必填',
          dataIndex: 'must'
        },
        {
          title: '说明',
          dataIndex: 'description'
        }
      ],
      generateArticleData: [
        {
          key: '2',
          name: 'prefix',
          type: 'array',
          must: '是',
          description: '文章前缀数组'
        },
        {
          key: '3',
          name: 'model_id',
          type: 'number',
          must: '是',
          description: '模型ID'
        },
        {
          key: '4',
          name: 'wn',
          type: 'number',
          must: '是',
          description: '生成文章字数'
        },
        {
          key: '5',
          name: 'gn',
          type: 'string',
          must: '是',
          description: '自定义任务名,同一账户下任务名不能重复'
        },
        {
          key: '6',
          name: 'post_num',
          type: 'number',
          must: '是',
          description: '生成文章篇数'
        }
      ],
      // 获取任务状态-请求参数
      taskStatusData: [
        {
          key: '1',
          name: 'gn',
          type: 'string',
          must: '是',
          description: '要查询的任务名'
        }
      ],
      // 下载生成的文章-请求参数
      downloadArticleData: [
        {
          key: '1',
          name: 'gn',
          type: 'string',
          must: '是',
          description: '要下载的文章任务名'
        },
        {
          key: '2',
          name: 'tt_pm',
          type: 'number',
          must: '是',
          description: '文章标题处理方式 0:采用文章开头作为文章标题 1:[前缀+文章开头+后缀]作为标题 2:随机标题 3:文章第一句话作为标题'
        },
        {
          key: '3',
          name: 'tt_pf',
          type: 'array',
          must: '是',
          description: '文章前缀数组 仅当tt_pm为1时需要提交此参数'
        },
        {
          key: '4',
          name: 'tt_tl',
          type: 'array',
          must: '是',
          description: '文章后缀数组 仅当tt_pm为1时需要提交此参数'
        },
        {
          key: '5',
          name: 'tt_rd',
          type: 'array',
          must: '是',
          description: '随机标题数组 仅当tt_pm为2时需要提交此参数'
        },
        {
          key: '6',
          name: 'inner_link',
          type: 'number',
          must: '是',
          description: '是否加内链 1是 0否'
        },
        {
          key: '7',
          name: 'inner_link_gn',
          type: 'string',
          must: '是',
          description: '内链组名 仅当inner_link为1时需要提交此参数'
        },
        {
          key: '8',
          name: 'inner_link_bold',
          type: 'number',
          must: '是',
          description: '是否给内链加粗 1是 0否 仅当inner_link为1时需要提交此参数'
        },
        {
          key: '9',
          name: 'kw_bold',
          type: 'number',
          must: '是',
          description: '是否给文章开头加粗 1是 0否'
        }
      ],
      // 获取账户信息-返回参数
      accountInfoReturnColumns: [
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '类型',
          dataIndex: 'type'
        },
        {
          title: '说明',
          dataIndex: 'description'
        }
      ],
      accountInfoReturndata: [
        {
          key: '1',
          name: 'status',
          type: 'number',
          description: '状态码'
        },
        {
          key: '2',
          name: 'balance',
          type: 'number',
          description: '积分余额'
        },
        {
          key: '3',
          name: 'model',
          type: 'array',
          description: '可用模型'
        },
        {
          key: '4',
          name: 'id',
          type: 'number',
          description: '模型ID'
        },
        {
          key: '5',
          name: 'name',
          type: 'number',
          description: '模型名'
        },
        {
          key: '6',
          name: 'type',
          type: 'number',
          description: '1公用模型 2私有模型'
        }
      ],
      // 生成文章-返回参数
      generateArticleReturnData: [
        {
          key: '1',
          name: 'status',
          type: 'number',
          description: '状态码'
        }
      ],
      // 获取任务状态-返回参数
      taskStatusReturnData: [
        {
          key: '1',
          name: 'gn',
          type: 'string',
          description: '任务名'
        },
        {
          key: '2',
          name: 'tpn',
          type: 'number',
          description: '总文章数'
        },
        {
          key: '3',
          name: 'dpn',
          type: 'number',
          description: '生成成功文章数'
        }
      ],
      // 下载生成的文章-返回参数
      downloadArticleReturnData: [
        {
          key: '1',
          name: 'status',
          type: 'number',
          description: '状态码'
        },
        {
          key: '2',
          name: 'dlink',
          type: 'string',
          description: '文章下载链接,6分钟内有效'
        }
      ],
      // 获取账户信息-错误码
      errorCodeColumns: [
        {
          title: '错误代码',
          dataIndex: 'errorCode'
        },
        {
          title: '说明',
          dataIndex: 'description'
        }
      ],
      errorCodeData: [
        {
          key: '0',
          errorCode: '0',
          description: '接口请求成功'
        },
        {
          key: '1',
          errorCode: '1',
          description: '参数错误'
        },
        {
          key: '2',
          errorCode: '3',
          description: 'key有误'
        },
        {
          key: '3',
          errorCode: '11',
          description: '无本接口调用权限'
        }
      ],
      generateReturnData: [
        {
          key: '0',
          errorCode: '0',
          description: '接口请求成功'
        },
        {
          key: '1',
          errorCode: '1',
          description: '参数错误'
        },
        {
          key: '2',
          errorCode: '3',
          description: 'key有误'
        },
        {
          key: '3',
          errorCode: '7',
          description: '余额不足'
        },
        {
          key: '4',
          errorCode: '11',
          description: '无本接口调用权限'
        }
      ],
      taskReturnData: [
        {
          key: '0',
          errorCode: '0',
          description: '接口请求成功'
        },
        {
          key: '1',
          errorCode: '1',
          description: '参数错误'
        },
        {
          key: '2',
          errorCode: '3',
          description: 'key有误'
        },
        {
          key: '3',
          errorCode: '11',
          description: '无本接口调用权限'
        }
      ],
      downloadReturnData: [
        {
          key: '0',
          errorCode: '0',
          description: '接口请求成功'
        },
        {
          key: '1',
          errorCode: '1',
          description: '参数错误'
        },
        {
          key: '2',
          errorCode: '3',
          description: 'key有误'
        },
        {
          key: '3',
          errorCode: '11',
          description: '无本接口调用权限'
        }
      ],
      // 接口 key 值
      key: '',
      // 显示隐藏 key 值
      showKey: 0,
      // 是否有 API 权限
      apiAuthority: true
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
      if (res.status === 3) return this.$message.error(res.reason, function () { window.location.href = 'http://a.91nlp.cn/#/login' })
      if (res.status === 11) {
        this.apiAuthority = false
        return this.$message.error('无API权限,建议其充值会员')
      }
      if (res.status !== 0) return this.$message.error(res.reason)
      this.key = res.key
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
    },
    // 说明文档显示隐藏
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    // 点击显示隐藏 key 值
    changeShowKey () {
      this.showKey = !this.showKey
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
