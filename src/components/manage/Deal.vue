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

          </a-form>
        </div>
      </a-col>
      <a-col style="margin-top: 25px;">
        <div class="gpt-order-info">
          <a-form :colon="false" :labelCol="{ span: 5, offset: 1 }" :wrapperCol="{ span: 7, offset: 11 }" labelAlign="left">
            <a-form-item label="内容处理" class="gpt-order-info-title"></a-form-item>

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
  },
  mounted () {
    document.querySelector('.gpt-article-generate-title .ant-form-item-label-left label').style.fontSize = '16px'
    document.querySelector('.gpt-order-info-title .ant-form-item-label-left label').style.fontSize = '16px'
  },
  data: () => ({
    formItemLayout: {
      labelCol: { span: 3, offset: 1 },
      wrapperCol: { span: 9 }
    }
  }),
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
        }
      })
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
