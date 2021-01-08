<template>
  <div class="list_container">
    <h3>文章队列</h3>

    <a-table :columns="columns" :data-source="allTask" bordered :pagination="{ position: 'bottom' }" @change="pageTurning" size="middle" :scroll="{ x: 900 }">
      <template slot="keywords">
        <a href="javascript:;" @click="showKeywords">查看</a>
      </template>
      <template slot="customTitle">
        失败
        <a-tooltip placement="topLeft">
          <template slot="title">
            自动退还生成失败的积分
          </template>
          <a-icon type="question-circle" />
        </a-tooltip>
      </template>
      <template slot="create_at" slot-scope="text">
        {{ text | dateFormat }}
      </template>
      <template slot="taskdetail" slot-scope="text, record">
        <!-- {{ `执行中:${record.queue} 成功:${record.dn} 失败:${record.en}` }} -->
        <p :style="{ margin: '0' }">{{ `执行中：${record.queue}` }}</p>
        <p :style="{ margin: '0' }">{{ `成功：${record.dn}` }}</p>
        <p :style="{ margin: '0' }">{{ `失败：${record.en}` }}</p>
      </template>
      <template slot="deal" slot-scope="record">
        <a href="javascript:;" @click="downloadItem(record.gn)" :disabled="!record.is_modified">下载</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="handle($event, record)" :disabled="record.is_modified">处理</a>
        <a-divider type="vertical" />
        <router-link :to="{ name: 'Kwlist', params: { gn: record.gn, is_modified: record.is_modified } }">关键词列表</router-link>
        <a-divider type="vertical" />
        <a-popconfirm
          v-if="allTask.length"
          title="确定删除?"
          @confirm="() => onDelete(record.gn)"
        >
          <a href="javascript:;" :disabled="record.state === '生产中'">删除</a>
        </a-popconfirm>
      </template>
      <template slot="state" slot-scope="text">
        <span :style="text === '完成' ? 'color: green;' : ''">{{ text }}</span>
      </template>
    </a-table>

    <div class="gpt-list-footer">
      <p>说明：</p>
      <p>1.文章生成后可多次处理，但不会保存处理配置。</p>
      <p>2.删除后文章无法找回，生成中的文章无法处理和删除。</p>
      <p>3.由于文章是机器自动生成如果文章量大可能需要很长时间处理。</p>
    </div>

    <a-modal v-model="visible" :title="projectName" :footer="null">
      <div>
        <a-tag v-for="(item, index) in showKeyword" :key="index">{{item}}</a-tag>
      </div>
    </a-modal>
  </div>
</template>

<script>
import JSZip from 'jszip'
import FileSaver from 'file-saver'
export default {
  created () {
    this.getAllTask(500, 1)
  },
  data () {
    return {
      columns: [
        {
          title: '序号',
          dataIndex: 'key',
          width: 60,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '项目名',
          dataIndex: 'gn',
          className: 'item-name',
          width: 100,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '字数',
          dataIndex: 'wn',
          // sorter: (a, b) => a.wn - b.wn,
          width: 80,
          align: 'center'
        },
        {
          title: '文章数量',
          dataIndex: 'post_num',
          // sorter: (a, b) => a.post_num - b.post_num,
          align: 'center'
        },
        // {
        //   title: '关键词',
        //   scopedSlots: { customRender: 'keywords' },
        //   align: 'center'
        // },
        {
          title: '模型简称',
          dataIndex: 'model_name',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'create_at',
          scopedSlots: { customRender: 'create_at' },
          // defaultSortOrder: 'descend',
          // sorter: (a, b) => {
          //   return a.create_at - b.create_at
          // },
          align: 'center'
        },
        // {
        //   title: '任务详情',
        //   dataIndex: 'taskdetail',
        //   scopedSlots: { customRender: 'taskdetail' },
        //   align: 'center'
        // },
        {
          title: '执行中',
          dataIndex: 'queue',
          align: 'center'
        },
        {
          title: '成功',
          dataIndex: 'dn',
          align: 'center'
        },
        {
          dataIndex: 'en',
          slots: { title: 'customTitle' },
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'state',
          // filters: [
          //   {
          //     text: '生产中',
          //     value: '生产中'
          //   },
          //   {
          //     text: '完成',
          //     value: '完成'
          //   }
          // ],
          filterMultiple: false,
          onFilter: (value, record) => record.state.indexOf(value) === 0,
          scopedSlots: { customRender: 'state' },
          width: 80,
          fixed: 'right',
          align: 'center'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'deal' },
          width: 228,
          fixed: 'right',
          align: 'center'
        }
      ],
      // 所有任务进度
      allTask: [],
      // 关键词弹窗显示隐藏
      visible: false,
      // 点击关键词查看的项目名
      projectName: '',
      // 展示的关键词
      showKeyword: []
    }
  },
  methods: {
    // 获取所有任务进度
    async getAllTask (rn, pn) {
      const { data: res } = await this.$http.get(`pg/task_ls?rn=${rn}&pn=${pn}`)
      if (res.status === 3) return this.$message.error(res.reason, function () { window.location.href = 'http://a.91nlp.cn/#/login' })
      if (res.status !== 0) return this.$message.error(res.reason)

      res.list.sort(function (a, b) {
        if (a.create_at === b.create_at) {
          return b.id - a.id
        } else {
          return b.create_at - a.create_at
        }
      })

      let i = 1
      res.list = res.list.map(v => {
        v.state = v.state === 1 ? '完成' : '生产中'
        return { ...v, key: i++ }
      })
      this.allTask = res.list
    },
    handle (event, record) {
      // const itemName = event.currentTarget.parentElement.parentElement.children[1].innerText
      // const itemName = event.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.previousSibling.querySelector('.ant-table-tbody').querySelector('.item-name').innerText
      window.sessionStorage.setItem('itemName', record.gn)
      if (document.querySelector('.articleDeal')) {
        document.querySelector('.articleDeal').click()
      } else {
        document.querySelector('.article-manage>div').click()
        setTimeout(function () { document.querySelector('.articleDeal').click() }, 0)
      }
    },
    // 展示关键词
    async showKeywords () {
      const itemName = event.currentTarget.parentElement.parentElement.children[1].innerText
      this.projectName = itemName
      const { data: res } = await this.$http.get(`pg/kw?gn=${this.projectName}`)
      if (res.status !== 0) return this.$message.error(res.reason)
      this.showKeyword = res.kw.split(',')
      this.visible = true
    },
    // 表格翻页事件
    pageTurning () {
      // console.log('翻页')
    },
    // 删除文章事件
    async onDelete (gn) {
      const { data: res } = await this.$http.post('rmpg', {
        gn: gn
      })
      if (res.status !== 0) return this.$message.error(res.reason)
      const dataSource = [...this.allTask]
      this.allTask = dataSource.filter(item => item.gn !== gn)
    },
    // 下载文章库
    downloadItem (gn) {
      this.getItemArticle(gn)
    },
    // 下载生成的文章
    async getItemArticle (gn) {
      const val = {
        pr: false,
        gn: gn
      }
      const { data: res } = await this.$http.post('dlpost', val)
      if (res.status !== 0) return this.$message.error(res.reason)
      const zip = new JSZip()
      for (let i = 0; i < res.posts.length; i++) {
        zip.file(res.posts[i].tt.replace('/', '') + '-' + i + '.txt', res.posts[i].txt)
      }
      zip.generateAsync({ type: 'blob' })
        .then(content => {
          FileSaver.saveAs(content, gn + '.zip')
        })
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
