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

            <a-form-item label="关键词" extra="关键词格式：每行一个">
              <a-upload
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
                <a-button> <a-icon type="upload" /> Click to upload </a-button>
              </a-upload>
            </a-form-item>

            <a-form-item label="文章类型">
              <a-select
                v-decorator="[
                  'select',
                  { rules: [{ required: true, message: '请选择!' }] },
                ]"
                placeholder="请选择"
              >
                <a-select-option value="zuqiu">
                  系统语料-足球
                </a-select-option>
                <a-select-option value="lanqiu">
                  系统语料-篮球
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="文章数量" extra="文章数量不得低于※">
              <a-input-number v-model="articleNum" :min="1" :max="10" />
            </a-form-item>

            <a-form-item label="文章字数" extra="VIP会员可选择1000字文章 升级会员">
              <a-radio-group v-decorator="['radio-group']">
                <a-radio value="500">
                  500字
                </a-radio>
                <a-radio value="1000">
                  1000字
                </a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="文章名称" extra="标题不得超过10个字">
              <a-input placeholder="请输入" :maxLength="10" />
            </a-form-item>

            <a-form-item :wrapper-col="{ span: 12, offset: 12 }" style="margin: 0;border-top: 6px solid #FF1C1C;">
              <div style="line-height: normal;display: inline-block;">
                <p>
                  订单费用
                  <span>7500积分</span>
                  <a-tooltip placement="rightTop">
                    <template slot="title">
                      提示文字
                    </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                </p>
                <p>省 <span>XXX元</span></p>
              </div>
              <a-button type="primary" html-type="submit">
                提交
              </a-button>
              <a-button type="primary" ghost html-type="reset">
                重置
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-col>
      <a-col style="margin-top: 25px;">
        <div class="gpt-order-info">
          <a-form :colon="false" :labelCol="{ span: 5, offset: 1 }" :wrapperCol="{ span: 7, offset: 11 }" labelAlign="left">
            <a-form-item label="订单详情"></a-form-item>

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
              <span>500字 升级会员</span>
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

            <a-form-item label="订单费用 7500积分" style="border-top: 1px dashed #DBDBDB;">
              <a-button type="primary" html-type="submit">
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
  </div>
</template>

<script>
export default {
  data: () => ({
    formItemLayout: {
      labelCol: { span: 3, offset: 1 },
      wrapperCol: { span: 7 }
    },
    // 文章数量
    articleNum: ''
  }),
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'validate_other' })
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    normFile (e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    }
  }
}
</script>

<style lang="less" scoped>
.gpt-article-generate,
.gpt-order-info {
  background-color: #fff;
  border-radius: 20px;
  .gpt-article-generate-title {
    background-color: #FAFAFA;
    border-radius: 20px 20px 0 0;
    font-weight: bold;
  }
}
</style>
