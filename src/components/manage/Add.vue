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
            <a-form-item label="文章生成" class="gpt-article-generate-title"></a-form-item>

            <a-form-item label="关键词" extra="※ 关键词会用作文章生成的依据，当用户输入关键词后我们的AI文章仿写系统会根据用户输入的关键词生成最接近的文章。关键词可以是核心词或者长尾词甚至一句话。同时91NLP文章仿写系统还支持批量关键词上传功能（1行1个）。" style="text-align: left;">

              <!-- <a-upload
                v-decorator="[
                  'upload',
                  {
                    valuePropName: 'fileList',
                    getValueFromEvent: normFile,
                  },
                ]"
                name="logo"
                action="/upload.do"
                list-type="picture"
              >
                <a-button> <a-icon type="upload" /> 上传文件 </a-button>
              </a-upload> -->

              <a-textarea
                placeholder=""
                allow-clear
                :auto-size="{ minRows: 1, maxRows: 6 }"
                v-model="kwValue"
                @change="manualModifyKeywords"
              />
              <a-upload
                list-type="text"
                action=""
                @change="uploadStatus"
                accept=".txt"
                :showUploadList="false"
              >
                <a-button> <a-icon type="upload" /> 上传文件 </a-button>
              </a-upload>

            </a-form-item>

            <a-form-item label="文章类型" style="text-align: left;" extra="※ 文章类型是我们通过海量文章语料给GPU学习后获得的文章模型，用户可以选择想生成的文章类型配合关键词进行文章生成。其中 公用模型 为系统模型，用户也可以选择自助上传语料通过我们机器学习获得更贴近您行业的文章模型。">
              <a-select
                v-decorator="[
                  'model_id',
                  { rules: [{ required: true, message: '请选择!' }] }
                ]"
                placeholder="请选择"
                @change="mid"
              >
                <a-select-option :value="`${item.type}-${item.id}`" v-for="item in articleType" :key="item.id">
                  {{item.type === 1 ? '公用模型' : '私有模型'}} - {{item.name}}
                </a-select-option>
                <!-- <a-select-option value="lanqiu">
                  系统语料-篮球
                </a-select-option> -->
              </a-select>
            </a-form-item>

            <a-form-item label="文章数量" :extra="`※ 文章数量不得低于 ${kwValue.split('\n').filter(item => item).length}，文章数量是根据用户提交的关键词产生一个基本数量，如您提交了10个关键词我们将依据您提交的关键词为您生成不小于10篇的文章，当然您也可以选择10个关键词输入11篇文章这时系统会对第一个关键词生成2篇文章以此类推。同时文章数量越多生成等待时间越长。目前1000字文章大概是5-9秒钟一篇。`" style="text-align: left;">
              <a-input-number v-model="articleNum" :min="kwValue.split('\n').filter(item => item).length" @change="articleNumber" />
            </a-form-item>

            <!-- <a-form-item label="文章字数" extra="VIP会员可选择1000字文章 升级会员" style="text-align: left;"> -->
            <a-form-item label="文章字数" style="text-align: left;" extra="※ 由于我们所有的文章生成都是机器通过GPU即时演算产生（并非换词模式）所以将会大大消耗GPU性能。目前我们开放了1000字的文章生成功能，后期会开放更多字数给大家。">
              <a-radio-group
                v-decorator="[
                  'wn',
                  { rules: [{ required: true, message: '请选择!' }] }
                ]"
              >
                <a-radio value="500" disabled>
                  500字
                </a-radio>
                <a-radio value="1000">
                  1000字
                </a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="文章名称" extra="※ 不能超过10个字用于标记任务名" style="text-align: left;">
              <a-input
                placeholder="请输入"
                :maxLength="10"
                v-decorator="[
                  'gn',
                  { rules: [{ required: true, message: '请输入!' }] }
                ]"
                @change="detectionArticleName()"
              />
            </a-form-item>

            <a-form-item :wrapper-col="{ span: 14, offset: 10 }" style="margin: 0;border-top: 6px solid #FF1C1C;padding: 20px 0 15px 0;">
              <div style="line-height: normal;display: inline-block;text-align: right;margin-right: 34px;vertical-align: middle;">
                <p style="margin: 0 0 10px;">
                  订单费用
                  <span style="color: #FFB05D;font-size: 24px;margin: 0 5px 0 10px;">{{articleOrderPrice}} 积分</span>
                  <a-tooltip placement="topLeft">
                    <template slot="title">
                      提示文字
                    </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                </p>
                <p style="margin: 0;">省 <span style="color: #0039FD;margin-left: 10px;">{{onSale}} 积分</span></p>
              </div>
              <a-button type="primary" shape="round" html-type="submit" style="margin-right: 14px;background-color: #0039FD;border: 1px solid #0039FD;">
                提交
              </a-button>
              <a-button type="primary" shape="round" ghost html-type="reset" :style="{ borderColor: '#0039FD', color: '#0039FD' }">
                重置
              </a-button>
            </a-form-item>

            <!-- 功能说明 -->
            <!-- <div :style="{ position: 'absolute', right: '45px', top: '90px', width: '400px', textAlign: 'left' }">
              <h3>功能说明：</h3>
              <dl>
                <dt>关键词：</dt>
                <dd>关键词会用作文章生成的依据，当用户输入关键词后我们的AI文章仿写系统会根据用户输入的关键词生成最接近的文章。关键词可以是核心词或者长尾词甚至一句话。同时91NLP文章仿写系统还支持批量关键词上传功能（1行1个）。</dd>
              </dl>
              <dl>
                <dt>文章类型：</dt>
                <dd>文章类型是我们通过海量文章语料给GPU学习后获得的文章模型，用户可以选择想生成的文章类型配合关键词进行文章生成。其中 公用模型 为系统模型，用户也可以选择自助上传语料通过我们机器学习获得更贴近您行业的文章模型。</dd>
              </dl>
              <dl>
                <dt>文章数量：</dt>
                <dd>文章数量是根据用户提交的关键词产生一个基本数量，如您提交了10个关键词我们将依据您提交的关键词为您生成不小于10篇的文章，当然您也可以选择10个关键词输入11篇文章这时系统会对第一个关键词生成2篇文章以此类推。同时文章数量越多生成等待时间越长。目前1000字文章大概是5-9秒钟一篇。</dd>
              </dl>
              <dl>
                <dt>文章字数：</dt>
                <dd>由于我们所有的文章生成都是机器通过GPU即时演算产生（并非换词模式）所以将会大大消耗GPU性能。目前我们开放了1000字的文章生成功能，后期会开放更多字数给大家。</dd>
              </dl>
              <dl>
                <dt>文章名称：</dt>
                <dd>不能超过10个字用于标记任务名。</dd>
              </dl>
            </div> -->

          </a-form>

          <!-- <div class="gpt-list-footer">
            <p>功能说明：</p>
            <p>关键词：关键词会用作文章生成的依据，当用户输入关键词后我们的AI文章仿写系统会根据用户输入的关键词生成最接近的文章。关键词可以是核心词或者长尾词甚至一句话。同时91NLP文章仿写系统还支持批量关键词上传功能（1行1个）。</p>
            <p>文章类型：文章类型是我们通过海量文章语料给GPU学习后获得的文章模型，用户可以选择想生成的文章类型配合关键词进行文章生成。其中 公用模型 为系统模型，用户也可以选择自助上传语料通过我们机器学习获得更贴近您行业的文章模型。</p>
            <p>文章数量：文章数量是根据用户提交的关键词产生一个基本数量，如您提交了10个关键词我们将依据您提交的关键词为您生成不小于10篇的文章，当然您也可以选择10个关键词输入11篇文章这时系统会对第一个关键词生成2篇文章以此类推。同时文章数量越多生成等待时间越长。目前1000字文章大概是5-9秒钟一篇。</p>
            <p>文章字数：由于我们所有的文章生成都是机器通过GPU即时演算产生（并非换词模式）所以将会大大消耗GPU性能。目前我们开放了1000字的文章生成功能，后期会开放更多字数给大家。</p>
            <p>文章名称：不能超过10个字用于标记任务名。</p>
          </div> -->

        </div>
      </a-col>
      <a-col style="margin-top: 25px;" v-if="false">
        <div class="gpt-order-info">
          <a-form :colon="false" :labelCol="{ span: 5, offset: 1 }" :wrapperCol="{ span: 7, offset: 11 }" labelAlign="left">
            <a-form-item label="订单详情" class="gpt-order-info-title"></a-form-item>

            <a-form-item label="关键词：">
              <span>关键词文件.txt</span>
            </a-form-item>

            <a-form-item label="文章类型：">
              <span>系统语料—足球</span>
            </a-form-item>

            <a-form-item label="文章数量：">
              <span>10篇</span>
            </a-form-item>

            <a-form-item label="文章字数：">
              <span>500字 <em style="font-style: normal;">升级会员</em></span>
            </a-form-item>

            <a-form-item label="项目名称：">
              <span>项目的名称</span>
            </a-form-item>

            <a-form-item label="已优惠：">
              <span>1500 积分</span>
            </a-form-item>

            <a-form-item label="价格：">
              <span>10000 已减 1500</span>
            </a-form-item>

            <a-form-item label="一级会员优惠：">
              <span>500/篇（原价：600/篇）</span>
            </a-form-item>

            <a-form-item style="border-top: 1px dashed #DBDBDB;padding: 10px 0 15px;" :labelCol="{ span: 14, offset: 1 }" :wrapperCol="{ span: 7, offset: 2 }">
              <div slot="label" style="line-height: normal;display: inline-block;text-align: right;vertical-align: middle;">
                <p style="margin: 0 0 10px;">
                  订单费用
                  <span style="color: #FFB05D;font-size: 24px;margin: 0 0 0 10px;">7500积分</span>
                </p>
                <p style="margin: 0;">省 <span style="color: #0039FD;margin-left: 10px;">XXX元</span></p>
              </div>
              <a-button type="primary" html-type="submit" style="margin-right: 14px;">
                支付
              </a-button>
              <a-button type="primary" ghost>
                取消
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-col>
    </a-row>

    <!-- 文章生成 对话框 -->
    <a-modal v-model="articleGenerateVisible" title="文章生成" @ok="articleGenerateHandleOk" :confirm-loading="confirmLoading" okText="确认" cancelText="取消">
      <p>文章数量：{{ articleNum }}</p>
      <p>文章字数：{{ articleWordCount }}</p>
      <p>文章类型：{{ articleTypeCurrent }}</p>
      <p>总扣费积分：{{ articleOrderPrice }}</p>
    </a-modal>

  </div>
</template>

<script>
export default {
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'validate_other' })
  },
  created () {
    this.getModel()
  },
  mounted () {
    document.querySelector('.gpt-article-generate-title .ant-form-item-label-left label').style.fontSize = '16px'
    // document.querySelector('.gpt-order-info-title .ant-form-item-label-left label').style.fontSize = '16px'
  },
  data: () => ({
    formItemLayout: {
      labelCol: { span: 3, offset: 1 },
      wrapperCol: { span: 19 }
    },
    // 文章数量
    articleNum: 1,
    // 文章字数
    articleWordCount: 0,
    // 关键词输入框内容
    kwValue: '',
    // 生成文章 文章类型下拉框
    articleType: [],
    // 单篇文章价格
    articleItemPrice: 0,
    // 生成文章-订单费用
    articleOrderPrice: 0,
    // 非会员单篇文章价格
    articleItemPrices: 0,
    // 差价
    onSale: 0,
    // 文章生成 对话框 显示/隐藏
    articleGenerateVisible: false,
    // 文章类型
    articleTypeCurrent: '',
    // 文章名称
    articleName: '',
    // 模型 id
    articleModelId: 0,
    // 提交 防抖
    timer: null,
    confirmLoading: false
  }),
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.articleGenerateVisible = true
          this.articleWordCount = values.wn
          this.articleType.map(v => {
            if (v.id === Number(values.model_id.split('-')[1])) {
              this.articleTypeCurrent = v.name
            }
          })
          this.articleName = values.gn
          this.articleModelId = Number(values.model_id.split('-')[1])
          values.prefix = this.kwValue.split('\n').filter(item => item)
          values.post_num = this.articleNum
          values.model_id = Number(values.model_id.split('-')[1])
          values.wn = Number(values.wn)
          // this.getArticleGenerate(values)
        }
      })
    },
    normFile (e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    // 上传文件改变时的状态
    uploadStatus (file) {
      if (file.event) {
        const folder = file.file.originFileObj
        const fileReader = new FileReader()
        fileReader.onload = (evt) => {
          const fileStr = fileReader.result.trim().replace(/\r/g, '').split('\n').filter(m => !!m.trim()).map(m => m.trim())
          this.kwValue = fileStr.join('\r\n')
        }
        fileReader.readAsText(folder)
      }
    },
    // 获取可用模型
    async getModel () {
      const { data: res } = await this.$http.get('uinfo')
      if (res.status === 3) return this.$message.error(res.reason, function () { window.location.href = 'http://a.91nlp.cn/#/login' })
      if (res.status !== 0) return this.$message.error(res.reason)
      // 文章类型下拉框
      this.articleType = res.model
    },
    // 生成文章
    async getArticleGenerate (values) {
      this.confirmLoading = true
      const { data: res } = await this.$http.post('gen_post', values)
      this.confirmLoading = false
      if (res.status !== 0) return this.$message.error(res.reason)
      this.articleGenerateVisible = false
      this.$router.push('/list')
      // this.$message.success('提交了')
    },
    // 单篇文章价格
    async getArticlePrice (values) {
      const { data: res } = await this.$http.post('pcost', values)
      if (res.status !== 0) return this.$message.error(res.reason)
      if (values.ml === -1) {
        this.articleItemPrice = res.cost
        this.orderCost()
      } else if (values.ml === 0) {
        this.articleItemPrices = res.cost
        this.orderCost()
      }
    },
    // 文章生成-文章数量失去焦点事件-订单费用
    articleNumber () {
      this.orderCost()
    },
    // 当前选中的文章模型
    mid (val) {
      this.getArticlePrice({ mt: Number(val.split('-')[0]), ml: -1 })
      this.getArticlePrice({ mt: Number(val.split('-')[0]), ml: 0 })
    },
    // 计算订单费用 && 差价
    orderCost () {
      this.articleOrderPrice = this.articleNum * this.articleItemPrice
      this.onSale = this.articleNum * this.articleItemPrices - this.articleOrderPrice
    },
    // 检测文章项目名是否重复
    detectionArticleName () {
      // console.log(this.form)
    },
    // 手动修改关键词事件
    manualModifyKeywords (e) {
      this.articleNum = this.kwValue.split('\n').filter(item => item).length
      this.orderCost()
      // console.log(e.target.value)
      // console.log(this.kwValue)
    },
    // 文章生成 对话框 确认按钮
    articleGenerateHandleOk () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getArticleGenerate({
          gn: this.articleName,
          model_id: this.articleModelId,
          post_num: this.articleNum,
          prefix: this.kwValue.split('\n').filter(item => item),
          wn: this.articleWordCount
        })
      }, 500)
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
.gpt-list-footer {
  line-height: normal;
  color: #ACACAC;
  text-align: left;
  padding: 40px;
}
</style>
