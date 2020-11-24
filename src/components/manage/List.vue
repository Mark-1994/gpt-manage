<template>
  <div class="list_container">
    <h3>文章队列</h3>

    <a-table :columns="columns" :data-source="data" bordered>
      <template slot="name" slot-scope="text">
        <a>{{ text }}</a>
      </template>
    </a-table>

    <div class="gpt-list-footer">
      <p>说明：</p>
      <p>下载单个txt:单个文章每个文字开头会有关键词每篇文章以----隔开</p>
      <p>下载压缩包:每篇文章一个txt文件名为关键词，单个关键词多篇文章 关键词后面加数字</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {
          title: '序号',
          dataIndex: 'key'
        },
        {
          title: '项目名称',
          dataIndex: 'name'
        },
        {
          title: '字数',
          dataIndex: 'words'
        },
        {
          title: '文章数量',
          dataIndex: 'articles'
        },
        {
          title: '关键词',
          dataIndex: 'keywords'
        },
        {
          title: '文章类型',
          dataIndex: 'type'
        },
        {
          title: '创建时间',
          dataIndex: 'time'
        },
        {
          title: '状态',
          dataIndex: 'status'
        },
        {
          title: '文章处理',
          dataIndex: 'deal'
        }
      ],
      data: [
        {
          key: '1',
          name: '测试1',
          words: '500',
          articles: '232',
          keywords: '查看',
          type: '足球',
          time: '2011/01/01 14:00',
          status: '生成中',
          deal: '操作'
        },
        {
          key: '2',
          name: '测试2',
          words: '1000',
          articles: '1001',
          keywords: '查看',
          type: '小说',
          time: '2011/01/01 14:00',
          status: '生成中',
          deal: '操作'
        },
        {
          key: '3',
          name: '测试3',
          words: '1000',
          articles: '1002',
          keywords: '查看',
          type: '小说',
          time: '2011/01/01 14:00',
          status: '生成中',
          deal: '操作'
        }
      ]
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
