<template>
  <div class="list_container">
    <h3>定时发布管理</h3>

    <div style="margin-bottom: 20px;text-align: left;padding: 0 40px;">
      <a-space :size="6" align="end" :style="{ flexWrap: 'wrap', lineHeight: '40px' }">
        <a-button type="primary" :style="{ borderRadius: '17px', backgroundColor: '#0039FD', borderColor: '#0039FD' }" @click="showAddPanel">
          新增定时发布
        </a-button>
        <!-- <a-button type="primary" :style="{ borderRadius: '17px', backgroundColor: '#FD3A00', borderColor: '#FD3A00' }">
          删除选中
        </a-button>
        <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
          下载
        </a-button> -->
      </a-space>
    </div>

    <a-table :columns="columns" :data-source="allTask" bordered size="middle" class="gpt-data-table" :row-selection="rowSelection" :scroll="{ x: 1500 }" rowKey="id">
      <template slot="state" slot-scope="text">
        <span :style="{ color: text ? 'green' : 'red' }">{{ text ? '发布中' : '停止' }}</span>
        <a-switch checked-children="启动" un-checked-children="停止" default-checked="true" />
      </template>
      <template slot="push_type" slot-scope="text">
        {{ text === '1' ? '立即发布' : '定时发布' }}
      </template>
      <template slot="deal">
        <a-button type="primary" disabled>编辑</a-button>
      </template>
    </a-table>

    <div class="gpt-list-footer">
      <!-- <p>说明：</p>
      <p>下载单个txt:单个文章每个文字开头会有关键词每篇文章以----隔开</p>
      <p>下载压缩包:每篇文章一个txt文件名为关键词，单个关键词多篇文章 关键词后面加数字</p> -->
    </div>

    <!-- 新增定时发布对话框 -->
    <a-modal v-model="addPanelVisible" title="新增定时发布" class="gpt-add-panel" :width="721" :footer="null" destroyOnClose>

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
        <a-form-item label="发布文章数">
          <a-input-number v-decorator="['post_num', { rules: [{ required: true, message: '不能为空!' }] }]" :min="0" :max="postNumMax" :style="{ width: '100%' }" :disabled="postNumDisable" />
        </a-form-item>
        <a-form-item label="条数说明">
          <p :style="{ color: '#000', opacity: '.5', lineHeight: 'normal', margin: '0' }">如果发布条数为0，则发布已选择文章库中所有文章。</p>
        </a-form-item>
        <a-form-item label="时间区间 单位时">
          <!-- <a-range-picker v-decorator="['alive_hour', { rules: [{ required: true, message: '不能为空!' }] }]" format="HH" /> -->
          <a-row>
            <a-col span="10">
              <a-form-item style="width: 100%;">
                <!-- <a-time-picker v-decorator="['alive_hour_start', { rules: [{ required: true, message: '不能为空!' }] }]" format="HH" style="width: 100%;" placeholder="开始" /> -->
                <a-time-picker
                  v-decorator="['alive_hour_start', { rules: [{ required: true, message: '不能为空!' }] }]"
                  format="HH"
                  placeholder="开始"
                  @openChange="handleStartOpenChange"
                  :disabled-date="disabledStartDate"
                  :style="{ width: '100%' }"
                />
              </a-form-item>
            </a-col>
            <a-col span="4">
              <a-form-item style="width: 100%;text-align: center;">
                -
              </a-form-item>
            </a-col>
            <a-col span="10">
              <a-form-item style="width: 100%;">
                <!-- <a-time-picker v-decorator="['alive_hour_end', { rules: [{ required: true, message: '不能为空!' }] }]" format="HH" style="width: 100%;" placeholder="结束" /> -->
                <a-time-picker
                  v-decorator="['alive_hour_end', { rules: [{ required: true, message: '不能为空!' }] }]"
                  format="HH"
                  placeholder="结束"
                  :open="endOpen"
                  @openChange="handleEndOpenChange"
                  :disabled-date="disabledEndDate"
                  :style="{ width: '100%' }"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="发布间隔 单位分">
          <a-row>
            <a-col span="10">
              <a-form-item style="width: 100%;">
                <!-- <a-time-picker v-decorator="['push_delay_min', { rules: [{ required: true, message: '不能为空!' }] }]" format="ss" style="width: 100%;" placeholder="开始" /> -->
                <a-input-number v-decorator="['push_delay_min', { rules: [{ required: true, message: '不能为空!' }] }]" :min="1" :max="1440" :style="{ width: '100%' }" />
              </a-form-item>
            </a-col>
            <a-col span="4">
              <a-form-item style="width: 100%;text-align: center;">
                -
              </a-form-item>
            </a-col>
            <a-col span="10">
              <a-form-item style="width: 100%;">
                <!-- <a-time-picker v-decorator="['push_delay_max', { rules: [{ required: true, message: '不能为空!' }] }]" format="ss" style="width: 100%;" placeholder="结束" /> -->
                <a-input-number v-decorator="['push_delay_max', { rules: [{ required: true, message: '不能为空!' }] }]" :min="Number(form.getFieldValue('push_delay_min')) || 1" :max="1440" :style="{ width: '100%' }" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="开始发布日期">
          <a-date-picker v-decorator="['start_date', { rules: [{ required: true, message: '不能为空!' }] }]" style="width: 100%;" placeholder="请选择日期" format="YYYY-MM-DD" :disabled-date="disabledDate" />
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
import moment from 'moment'
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
      // 新增定时发布对话框 显示/隐藏
      addPanelVisible: false,
      // 新增定时发布 表单数据
      addPanelData: {
        task_name: '',
        site_id: '',
        post_gn: '',
        post_module: '',
        passwd: '',
        root: '',
        user: '',
        author: '',
        post_orgin: '',
        bd_token: '',
        push_bd: ''
      },
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
      // 发布文章属 最大值
      postNumMax: 1,
      // 隐藏 结束时间 区间 小时
      endOpen: false,
      startValue: null,
      endValue: null
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
      const { data: res } = await this.$http.get('pg/tdl')
      if (res.status !== 0) return this.$message.error(res.reason)
      let i = 1
      this.allTask = res.list.map(v => {
        return { ...v, key: i++ }
      })
    },
    // 显示新增定时发布面板
    showAddPanel () {
      this.getSiteNameList()
      this.getArticleNameList(500, 1)
      this.postModuleDisable = true
      this.postNumDisable = true
      this.addPanelVisible = true
    },
    // 新增定时发布面板 表单提交
    addPanelSave (e) {
      e.preventDefault()
      this.form.validateFields(async (error, values) => {
        if (!error) {
          const val = {
            ...values,
            start_date: values.start_date.format('YYYYMMDD'),
            push_delay: { min: values.push_delay_min, max: values.push_delay_max },
            alive_hour: { start: Number(values.alive_hour_start.format('H')), end: Number(values.alive_hour_end.format('H')) },
            post_module: values.post_module.split(',')[0],
            post_module_id: values.post_module.split(',')[1]
          }
          const { data: res } = await this.$http.post('pg/ntpost', val)
          if (res.status !== 0) return this.$message.error(res.reason)
          this.getClockManage()
          this.addPanelVisible = false
        }
      })
    },
    // 新增定时发布面板 取消按钮
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
      this.postNumDisable = false
      this.articleNameList.map(x => {
        if (x.gn === value) {
          this.postNumMax = x.post_num
        }
      })
    },
    // 不能选择今天之前的日期
    disabledDate (current) {
      return current && current < moment().endOf('day')
    },
    handleStartOpenChange (open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange (open) {
      this.endOpen = open
    },
    disabledStartDate (startValue) {
      const endValue = this.endValue
      console.log(startValue.valueOf())
      if (!startValue || !endValue) {
        return true
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate (endValue) {
      const startValue = this.startValue
      console.log(endValue.valueOf())
      if (!endValue || !startValue) {
        return true
      }
      return startValue.valueOf() >= endValue.valueOf()
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
