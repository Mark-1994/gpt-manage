<template>
  <div class="list_container">
    <h3>任务发布管理</h3>

    <div style="margin-bottom: 20px;text-align: left;padding: 0 40px;">
      <a-space :size="6" align="end" :style="{ flexWrap: 'wrap' }">
        <a-input-search placeholder="搜索关键词" style="width: 181px;" class="searchInput" />
        <!-- <a-range-picker class="gpt-time-range" :placeholder="['开始日期', '结束日期']" /> -->
        <a-date-picker
          class="gpt-time-range"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="开始日期"
          :style="{ minWidth: '117px', width: '117px' }"
        >
          <a-icon slot="suffixIcon" type="smile" v-show="false" />
        </a-date-picker>
        <a-date-picker
          class="gpt-time-range"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="结束日期"
          :style="{ minWidth: '117px', width: '117px' }"
        >
          <a-icon slot="suffixIcon" type="smile" v-show="false" />
        </a-date-picker>
        <a-select default-value="0" style="width: 117px;" class="gpt-choose-condition">
          <a-select-option value="0">
            发布中
          </a-select-option>
          <a-select-option value="1">
            发布中2
          </a-select-option>
          <a-select-option value="2">
            发布中22
          </a-select-option>
        </a-select>
        <!-- <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item key="1"> <a-icon type="user" />待发布1 </a-menu-item>
            <a-menu-item key="2"> <a-icon type="user" />待发布2 </a-menu-item>
            <a-menu-item key="3"> <a-icon type="user" />待发布3 </a-menu-item>
          </a-menu>
          <a-button :style="{ borderRadius: '17px' }"> 发布中 <a-icon type="down" /> </a-button>
        </a-dropdown> -->
        <a-button type="primary" :style="{ borderRadius: '17px', backgroundColor: '#0039FD', borderColor: '#0039FD' }">
          新增发布任务
        </a-button>
        <a-button type="primary" :style="{ borderRadius: '17px', backgroundColor: '#FD3A00', borderColor: '#FD3A00' }">
          删除选中
        </a-button>
        <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
          下载
        </a-button>
      </a-space>
    </div>

    <a-table :columns="columns" :data-source="allTask" bordered size="middle" class="gpt-data-table" :row-selection="rowSelection" :scroll="{ x: 1300 }">
      <template slot="create_at" slot-scope="text">
        {{ text | dateFormat }}
      </template>
      <template slot="deal">
        <a href="javascript:;" @click="handle($event)">操作</a>
      </template>
    </a-table>

    <div class="gpt-list-footer">
      <!-- <p>说明：</p>
      <p>下载单个txt:单个文章每个文字开头会有关键词每篇文章以----隔开</p>
      <p>下载压缩包:每篇文章一个txt文件名为关键词，单个关键词多篇文章 关键词后面加数字</p> -->
    </div>
  </div>
</template>

<script>
export default {
  created () {
  },
  data () {
    return {
      columns: [
        {
          title: '序号',
          dataIndex: 'pmid',
          align: 'center',
          fixed: 'left',
          width: 100
        },
        {
          title: '任务名称',
          dataIndex: 'mn',
          className: 'item-name',
          align: 'center'
        },
        {
          title: '网站配置',
          dataIndex: 'yl_limit',
          align: 'center'
        },
        {
          title: '发布词库',
          dataIndex: 'state',
          align: 'center'
        },
        {
          title: '发布模块',
          dataIndex: 'upat',
          scopedSlots: { customRender: 'upat' },
          align: 'center'
        },
        {
          title: '任务状态',
          dataIndex: 'create_at',
          scopedSlots: { customRender: 'create_at' },
          align: 'center'
        },
        {
          title: '启动发布时间',
          align: 'center'
        },
        {
          title: '已发布',
          align: 'center'
        },
        {
          title: '未发布',
          align: 'center'
        },
        {
          title: '完成时间',
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          fixed: 'right',
          width: 150
        }
      ],
      // 所有任务进度
      allTask: [
        {
          key: 1
        }
      ],
      // 上传语料-私有模型 id
      mid: ''
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
    handle (event) {
      const itemName = event.currentTarget.parentElement.parentElement.children[1].innerText
      window.sessionStorage.setItem('itemName', itemName)
      document.querySelector('.articleDeal').click()
    },
    // 限制上传大小
    beforeUpload (file) {
      const isLt2M = file.size / 1024 / 1024 > 100 && file.size / 1024 / 1024 < 1024
      if (!isLt2M) {
        this.$message.error('文件大小不符合要求! 100MB-1024MB')
        return isLt2M
      }
    },
    clickUpLoad (e) {
      this.mid = e.currentTarget.parentElement.parentElement.children[0].innerText
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
  /deep/ .searchInput input {
    border-radius: 17px;
    background-color: #EDEDED;
  }
  /deep/ .searchInput i {
    color: #0039FD;
  }
  /deep/ .gpt-time-range>div>.ant-calendar-picker-input {
    border-radius: 17px;
    text-align: center;
    background-color: #EDEDED;
  }
  /deep/ .gpt-choose-condition .ant-select-selection {
    border-radius: 17px;
    color: #000;
    border: 2px solid #0039FD;
  }
  /deep/ .gpt-choose-condition .ant-select-selection:hover,
  /deep/ .gpt-choose-condition .ant-select-selection:active {
    border-right-width: 2px !important;
  }
  /deep/ .gpt-choose-condition .ant-select-selection i {
    color: #0039FD;
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
</style>
