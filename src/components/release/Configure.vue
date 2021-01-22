<template>
  <div class="list_container">
    <h3 :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
      <span>发布配置管理</span>
      <span :style="{ color: 'green' }" @click="showPluginInstallDocument">[插件安装]</span>
    </h3>

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
    <a-modal v-model="addPanelVisible" title="新增配置" class="gpt-add-panel" :width="721" :footer="null" destroyOnClose :afterClose="closeNewAddDialog" :maskClosable="false">

      <a-form :form="form" layout="inline" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :colon="false" class="gpt-add-panel-form" @submit="addPanelSave" hideRequiredMark>
        <a-form-item label="网站名称">
          <a-input v-decorator="['site_name', { rules: [{ required: true, message: '不能为空!' }] }]"></a-input>
        </a-form-item>
        <a-form-item label="网站地址">
          <a-input v-decorator="['site_url', { rules: [{ required: true, message: '不能为空!' }, { pattern: new RegExp(/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/), message: '请加上网址协议' }] }]"></a-input>
        </a-form-item>
        <a-form-item label="CMS类型">
          <a-select v-decorator="['cms_type', { rules: [{ required: true, message: '不能为空!' }] }]" @change="getCmsType">
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
          <a-input v-decorator="['path', { rules: [{ required: true, message: '不能为空!' }] }]" :disabled="InterfaceFileNameDisabled"></a-input>
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
          <a-input v-decorator="['root', { rules: [{ required: true, message: '不能为空!' }] }]" :disabled="rootDirectoryDisabled"></a-input>
        </a-form-item>
        <a-form-item label="文章作者" :extra="articleAuthorExtra">
          <a-input v-decorator="['author', { rules: [{ required: true, message: '不能为空!' }] }]"></a-input>
        </a-form-item>
        <a-form-item label="文章来源" extra="自定义">
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
              <a href="http://a.91nlp.cn/plugin/zblog/91nlp.zip" style="color: #fff;" target="_blank">Z-BLOG</a>
            </a-button>
            <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
              <a href="http://a.91nlp.cn/plugin/dede.zip" style="color: #fff;" target="_blank">dede</a>
            </a-button>
            <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
              <a href="http://a.91nlp.cn/plugin/wp/91nlp.zip" style="color: #fff;" target="_blank">WordPress</a>
            </a-button>
          </a-space>
        </a-form-item>
        <a-form-item label="发布用户" :extra="systemUserName">
          <a-input v-decorator="['user', { rules: [{ required: true, message: '不能为空!' }] }]"></a-input>
        </a-form-item>
        <a-form-item style="width: 100%;text-align: center;" :wrapper-col="{ span: 24 }">
          <a-space :size="8">
            <a-button class="gpt-add-panel-sure" html-type="submit" :loading="newAddConfigFormSave">
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
    <a-modal v-model="editPanelVisible" title="编辑配置" class="gpt-add-panel" :width="721" :footer="null" destroyOnClose :afterClose="closeEditDialog">

      <a-form :form="formEdit" layout="inline" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :colon="false" class="gpt-add-panel-form" @submit="editPanelSave" hideRequiredMark>
        <a-form-item label="网站ID" v-show="false">
          <a-input v-decorator="['id', { rules: [{ required: true, message: '不能为空!' }], initialValue: editPanelData.id }]" disabled></a-input>
        </a-form-item>
        <a-form-item label="网站名称">
          <a-input v-decorator="['site_name', { rules: [{ required: true, message: '不能为空!' }], initialValue: editPanelData.site_name }]"></a-input>
        </a-form-item>
        <a-form-item label="网站地址">
          <a-input v-decorator="['site_url', { rules: [{ required: true, message: '不能为空!' }, { pattern: new RegExp(/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/), message: '请加上网址协议' }], initialValue: editPanelData.link }]"></a-input>
        </a-form-item>
        <a-form-item label="CMS类型">
          <a-select v-decorator="['cms_type', { rules: [{ required: true, message: '不能为空!' }], initialValue: editPanelData.cms_type }]" @change="editFormCmsType">
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
          <a-input v-decorator="['path', { rules: [{ required: true, message: '不能为空!' }], initialValue: editPanelData.path }]" :disabled="InterfaceFileNameDisabled"></a-input>
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
          <a-input v-decorator="['root', { rules: [{ required: true, message: '不能为空!' }], initialValue: editPanelData.root_dir }]" :disabled="rootDirectoryDisabled"></a-input>
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
              <a href="http://a.91nlp.cn/plugin/zblog/91nlp.zip" style="color: #fff;" target="_blank">Z-BLOG</a>
            </a-button>
            <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
              <a href="http://a.91nlp.cn/plugin/dede.zip" style="color: #fff;" target="_blank">dede</a>
            </a-button>
            <a-button type="primary" size="small" icon="download" :style="{ borderRadius: '17px', backgroundColor: '#FA9836', borderColor: '#FA9836', fontSize: '12px' }">
              <a href="http://a.91nlp.cn/plugin/wp/91nlp.zip" style="color: #fff;" target="_blank">WordPress</a>
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

    <!-- 安装插件文档 -->
    <a-drawer width="640" placement="right" :closable="false" :visible="installPluginDocumentvisible" @close="onCloseInstallPluginDocument">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="dede">
          <a-descriptions title="91nlp - 文章发布插件" :column="{ xs: 2, sm: 2, md: 2 }" bordered size="small">
            <a-descriptions-item label="当前版本">
              V1.1
            </a-descriptions-item>
            <a-descriptions-item label="插件等级">
              部分非核心功能需要修改少量系统文件
            </a-descriptions-item>
            <a-descriptions-item label="适用系统">
              5.7
            </a-descriptions-item>
            <a-descriptions-item label="适用编码">
              gbk / utf-8
            </a-descriptions-item>
            <a-descriptions-item label="插件原价">

            </a-descriptions-item>
            <a-descriptions-item label="优惠价格">

            </a-descriptions-item>
            <a-descriptions-item label="插件作者">
              91nlp
            </a-descriptions-item>
            <a-descriptions-item label="联系方式">

            </a-descriptions-item>
            <a-descriptions-item label="售后说明">
              本插件版权归 91nlp 所有
              <br />
              在客户不侵犯 91nlp 权益的情况下
              <br />
              91nlp 将对此插件提供为期一年的售后服务
              <br>
              服务内容包括：免费升级、BUG修复、使用指导
              <br />
              客户可以将插件用在多个网站，但 91nlp 仅对一个网站提供售后服务
              <br />
              91nlp 插件常见问题
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="功能介绍">
            <a-descriptions-item>
              91NLP 文章智能仿写系统是国内首家真正实现 AI 仿写的系统，通过海量的文章数据模型及强大的服务器算力让 AI 实现高质量的原创文章生成。用户可以通过在线管理的方式对网站文章实现定时发布及时发布等功能。
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <!-- <a-descriptions title="一、TAG展示新增功能">
            <a-descriptions-item>
              TAG拼音功能，TAG的链接可以用拼音展示
            </a-descriptions-item>
          </a-descriptions>
          <a-divider /> -->
          <a-descriptions title="插件安装截图" :column="{ xs: 1, sm: 1, md: 1 }" size="small" :colon="false" layout="vertical">
            <a-descriptions-item label='（1）如果网站用的 php7 及以上版本，需要修改【/include/dedeatt.class.php】文件中 var $Items = ""; 替换为 var $Items = array();'>
              <img src="../../assets/gpt-dede-plugin-11.png" alt="" width="100%" @click="showpreviewPictureModal">
            </a-descriptions-item>
            <a-descriptions-item label="（2）进入织梦 模块管理">
              <img src="../../assets/gpt-dede-plugin-1.png" alt="" width="100%" @click="showpreviewPictureModal">
            </a-descriptions-item>
            <a-descriptions-item label="（3）上传新模块页面">
              <img src="../../assets/gpt-dede-plugin-2.png" alt="" width="100%" @click="showpreviewPictureModal">
            </a-descriptions-item>
            <a-descriptions-item label="（4）上传并安装插件">
              <img src="../../assets/gpt-dede-plugin-3.png" alt="" width="100%" @click="showpreviewPictureModal">
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="其它说明">
            <a-descriptions-item>
              目前我们通过几台超性能集群服务器进行训练已经完成了，体育模型（足球,NBA）、教育模型、金融、历史、军事、星座、散文、房产模型等热门行业的入库训练，为您快速生成大量优质语句通顺具有可读性的原创文章。
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
        <a-tab-pane key="2" tab="discuz">
          <a-descriptions title="91nlp - 文章发布插件" :column="{ xs: 2, sm: 2, md: 2 }" bordered size="small">
            <a-descriptions-item label="当前版本">
              V1.1
            </a-descriptions-item>
            <a-descriptions-item label="插件等级">
              部分非核心功能需要修改少量系统文件
            </a-descriptions-item>
            <a-descriptions-item label="适用系统">
              3.4
            </a-descriptions-item>
            <a-descriptions-item label="适用编码">
              gbk / utf-8
            </a-descriptions-item>
            <a-descriptions-item label="插件原价">

            </a-descriptions-item>
            <a-descriptions-item label="优惠价格">

            </a-descriptions-item>
            <a-descriptions-item label="插件作者">
              91nlp
            </a-descriptions-item>
            <a-descriptions-item label="联系方式">

            </a-descriptions-item>
            <a-descriptions-item label="售后说明">
              本插件版权归 91nlp 所有
              <br />
              在客户不侵犯 91nlp 权益的情况下
              <br />
              91nlp 将对此插件提供为期一年的售后服务
              <br>
              服务内容包括：免费升级、BUG修复、使用指导
              <br />
              客户可以将插件用在多个网站，但 91nlp 仅对一个网站提供售后服务
              <br />
              91nlp 插件常见问题
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="功能介绍">
            <a-descriptions-item>
              91NLP 文章智能仿写系统是国内首家真正实现 AI 仿写的系统，通过海量的文章数据模型及强大的服务器算力让 AI 实现高质量的原创文章生成。用户可以通过在线管理的方式对网站文章实现定时发布及时发布等功能。
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="插件安装截图" :column="{ xs: 1, sm: 1, md: 1 }" size="small" :colon="false" layout="vertical">
            <a-descriptions-item label="（1）修改第2行密码">
              <img src="../../assets/gpt-discuz-plugin-1.png" alt="" width="100%" @click="showpreviewPictureModal">
            </a-descriptions-item>
            <a-descriptions-item label="（2）将文件【91nlp_discuz.php】上传到自己网站的根目录">

            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="其它说明">
            <a-descriptions-item>
              目前我们通过几台超性能集群服务器进行训练已经完成了，体育模型（足球,NBA）、教育模型、金融、历史、军事、星座、散文、房产模型等热门行业的入库训练，为您快速生成大量优质语句通顺具有可读性的原创文章。
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
        <a-tab-pane key="3" tab="帝国CMS">
          <a-descriptions title="91nlp - 文章发布插件" :column="{ xs: 2, sm: 2, md: 2 }" bordered size="small">
            <a-descriptions-item label="当前版本">
              V1.1
            </a-descriptions-item>
            <a-descriptions-item label="插件等级">
              部分非核心功能需要修改少量系统文件
            </a-descriptions-item>
            <a-descriptions-item label="适用系统">
              7.5
            </a-descriptions-item>
            <a-descriptions-item label="适用编码">
              gbk / utf-8
            </a-descriptions-item>
            <a-descriptions-item label="插件原价">

            </a-descriptions-item>
            <a-descriptions-item label="优惠价格">

            </a-descriptions-item>
            <a-descriptions-item label="插件作者">
              91nlp
            </a-descriptions-item>
            <a-descriptions-item label="联系方式">

            </a-descriptions-item>
            <a-descriptions-item label="售后说明">
              本插件版权归 91nlp 所有
              <br />
              在客户不侵犯 91nlp 权益的情况下
              <br />
              91nlp 将对此插件提供为期一年的售后服务
              <br>
              服务内容包括：免费升级、BUG修复、使用指导
              <br />
              客户可以将插件用在多个网站，但 91nlp 仅对一个网站提供售后服务
              <br />
              91nlp 插件常见问题
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="功能介绍">
            <a-descriptions-item>
              91NLP 文章智能仿写系统是国内首家真正实现 AI 仿写的系统，通过海量的文章数据模型及强大的服务器算力让 AI 实现高质量的原创文章生成。用户可以通过在线管理的方式对网站文章实现定时发布及时发布等功能。
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="插件安装截图" :column="{ xs: 1, sm: 1, md: 1 }" size="small" :colon="false" layout="vertical">
            <a-descriptions-item label="（1）修改第6行密码">
              <img src="../../assets/gpt-emp-plugin-1.png" alt="" width="100%" @click="showpreviewPictureModal">
            </a-descriptions-item>
            <a-descriptions-item label="（2）将文件【91nlp_emp.php】上传到自己网站的【e/admin】目录">

            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="其它说明">
            <a-descriptions-item>
              目前我们通过几台超性能集群服务器进行训练已经完成了，体育模型（足球,NBA）、教育模型、金融、历史、军事、星座、散文、房产模型等热门行业的入库训练，为您快速生成大量优质语句通顺具有可读性的原创文章。
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
        <a-tab-pane key="4" tab="易优CMS">
          <a-descriptions title="91nlp - 文章发布插件" :column="{ xs: 2, sm: 2, md: 2 }" bordered size="small">
            <a-descriptions-item label="当前版本">
              V1.1
            </a-descriptions-item>
            <a-descriptions-item label="插件等级">
              部分非核心功能需要修改少量系统文件
            </a-descriptions-item>
            <a-descriptions-item label="适用系统">
              1.5.0
            </a-descriptions-item>
            <a-descriptions-item label="适用编码">
              gbk / utf-8
            </a-descriptions-item>
            <a-descriptions-item label="插件原价">

            </a-descriptions-item>
            <a-descriptions-item label="优惠价格">

            </a-descriptions-item>
            <a-descriptions-item label="插件作者">
              91nlp
            </a-descriptions-item>
            <a-descriptions-item label="联系方式">

            </a-descriptions-item>
            <a-descriptions-item label="售后说明">
              本插件版权归 91nlp 所有
              <br />
              在客户不侵犯 91nlp 权益的情况下
              <br />
              91nlp 将对此插件提供为期一年的售后服务
              <br>
              服务内容包括：免费升级、BUG修复、使用指导
              <br />
              客户可以将插件用在多个网站，但 91nlp 仅对一个网站提供售后服务
              <br />
              91nlp 插件常见问题
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="功能介绍">
            <a-descriptions-item>
              91NLP 文章智能仿写系统是国内首家真正实现 AI 仿写的系统，通过海量的文章数据模型及强大的服务器算力让 AI 实现高质量的原创文章生成。用户可以通过在线管理的方式对网站文章实现定时发布及时发布等功能。
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="插件安装截图" :column="{ xs: 1, sm: 1, md: 1 }" size="small" :colon="false" layout="vertical">
            <a-descriptions-item label="（1）将插件解压上传到网站【application/api/controller/】目录">

            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="其它说明">
            <a-descriptions-item>
              目前我们通过几台超性能集群服务器进行训练已经完成了，体育模型（足球,NBA）、教育模型、金融、历史、军事、星座、散文、房产模型等热门行业的入库训练，为您快速生成大量优质语句通顺具有可读性的原创文章。
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
        <a-tab-pane key="5" tab="WordPress">
          <a-descriptions title="91nlp - 文章发布插件" :column="{ xs: 2, sm: 2, md: 2 }" bordered size="small">
            <a-descriptions-item label="当前版本">
              V1.1
            </a-descriptions-item>
            <a-descriptions-item label="插件等级">
              部分非核心功能需要修改少量系统文件
            </a-descriptions-item>
            <a-descriptions-item label="适用系统">
              5.6
            </a-descriptions-item>
            <a-descriptions-item label="适用编码">
              gbk / utf-8
            </a-descriptions-item>
            <a-descriptions-item label="插件原价">

            </a-descriptions-item>
            <a-descriptions-item label="优惠价格">

            </a-descriptions-item>
            <a-descriptions-item label="插件作者">
              91nlp
            </a-descriptions-item>
            <a-descriptions-item label="联系方式">

            </a-descriptions-item>
            <a-descriptions-item label="售后说明">
              本插件版权归 91nlp 所有
              <br />
              在客户不侵犯 91nlp 权益的情况下
              <br />
              91nlp 将对此插件提供为期一年的售后服务
              <br>
              服务内容包括：免费升级、BUG修复、使用指导
              <br />
              客户可以将插件用在多个网站，但 91nlp 仅对一个网站提供售后服务
              <br />
              91nlp 插件常见问题
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="功能介绍">
            <a-descriptions-item>
              91NLP 文章智能仿写系统是国内首家真正实现 AI 仿写的系统，通过海量的文章数据模型及强大的服务器算力让 AI 实现高质量的原创文章生成。用户可以通过在线管理的方式对网站文章实现定时发布及时发布等功能。
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="插件安装截图" :column="{ xs: 1, sm: 1, md: 1 }" size="small" :colon="false" layout="vertical">
            <a-descriptions-item label="（1）将插件上传到网站【wp-content/plugins】目录, 并确保插件目录名为【91nlp】">

            </a-descriptions-item>
            <a-descriptions-item label="（2）进入 WordPree 后台插件菜单，启用 91NLP文章仿写生成工具">
              <img src="../../assets/gpt-wp-plugin-1.png" alt="" width="100%" @click="showpreviewPictureModal">
            </a-descriptions-item>
            <a-descriptions-item label="（3）进入管理面板【91NLP】栏目，设置发布密码">
              <img src="../../assets/gpt-wp-plugin-2.png" alt="" width="100%" @click="showpreviewPictureModal">
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="其它说明">
            <a-descriptions-item>
              目前我们通过几台超性能集群服务器进行训练已经完成了，体育模型（足球,NBA）、教育模型、金融、历史、军事、星座、散文、房产模型等热门行业的入库训练，为您快速生成大量优质语句通顺具有可读性的原创文章。
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
        <a-tab-pane key="6" tab="Z-BLOG">
          <a-descriptions title="91nlp - 文章发布插件" :column="{ xs: 2, sm: 2, md: 2 }" bordered size="small">
            <a-descriptions-item label="当前版本">
              V1.1
            </a-descriptions-item>
            <a-descriptions-item label="插件等级">
              部分非核心功能需要修改少量系统文件
            </a-descriptions-item>
            <a-descriptions-item label="适用系统">
              1.6
            </a-descriptions-item>
            <a-descriptions-item label="适用编码">
              gbk / utf-8
            </a-descriptions-item>
            <a-descriptions-item label="插件原价">

            </a-descriptions-item>
            <a-descriptions-item label="优惠价格">

            </a-descriptions-item>
            <a-descriptions-item label="插件作者">
              91nlp
            </a-descriptions-item>
            <a-descriptions-item label="联系方式">

            </a-descriptions-item>
            <a-descriptions-item label="售后说明">
              本插件版权归 91nlp 所有
              <br />
              在客户不侵犯 91nlp 权益的情况下
              <br />
              91nlp 将对此插件提供为期一年的售后服务
              <br>
              服务内容包括：免费升级、BUG修复、使用指导
              <br />
              客户可以将插件用在多个网站，但 91nlp 仅对一个网站提供售后服务
              <br />
              91nlp 插件常见问题
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="功能介绍">
            <a-descriptions-item>
              91NLP 文章智能仿写系统是国内首家真正实现 AI 仿写的系统，通过海量的文章数据模型及强大的服务器算力让 AI 实现高质量的原创文章生成。用户可以通过在线管理的方式对网站文章实现定时发布及时发布等功能。
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="插件安装截图" :column="{ xs: 1, sm: 1, md: 1 }" size="small" :colon="false" layout="vertical">
            <a-descriptions-item label="（1）将插件压缩包上传到网站【zb_users/plugin/】目录,解压插件后将文件夹命名为【91nlp】">

            </a-descriptions-item>
            <a-descriptions-item label="（2）进入 zblog 后台插件管理页面，启用 91NLP文章仿写生成工具">
              <img src="../../assets/gpt-zb-plugin-1.png" alt="" width="100%" @click="showpreviewPictureModal">
            </a-descriptions-item>
            <a-descriptions-item label="（3）进入 91NLP 文章仿写生成工具管理页面，设置发布密码">
              <img src="../../assets/gpt-zb-plugin-2.png" alt="" width="100%" @click="showpreviewPictureModal">
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="其它说明">
            <a-descriptions-item>
              目前我们通过几台超性能集群服务器进行训练已经完成了，体育模型（足球,NBA）、教育模型、金融、历史、军事、星座、散文、房产模型等热门行业的入库训练，为您快速生成大量优质语句通顺具有可读性的原创文章。
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
      </a-tabs>
    </a-drawer>

    <a-modal v-model="previewPictureVisible" title="图片预览" width="80%" :footer="null">
      <img :src="previewPictureDefaultValue" alt="" width="100%">
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
      editPanelData: {},
      // 发布用户 提示信息
      systemUserName: '',
      // 文章作者 提示信息
      articleAuthorExtra: '',
      // 接口文件名 禁用
      InterfaceFileNameDisabled: false,
      // 根目录 禁用
      rootDirectoryDisabled: false,
      // 插件安装文档 显示|隐藏
      installPluginDocumentvisible: false,
      // 图片预览 对话框 显示|隐藏
      previewPictureVisible: false,
      previewPictureDefaultValue: '',
      // 新增配置 表单 保存 按钮 loading 状态
      newAddConfigFormSave: false
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
          this.newAddConfigFormSave = true
          values.push_bd = false
          values.bd_token = ''
          const { data: res } = await this.$http.post('pg/nsite', values)
          if (res.status !== 0) return this.$message.error(res.reason)
          this.getConfigManage()
            .then(res => {
              if (!res) {
                this.siteCheck(this.allTask[this.allTask.length - 1].id)
                  .then(res => {
                    this.newAddConfigFormSave = false
                    this.addPanelVisible = false
                    this.form.resetFields()
                    if (res) {
                      this.editPanelData = this.allTask[this.allTask.length - 1]
                      this.editPanelVisible = true
                      // setTimeout(() => {
                      //   this.disabledFormInput(this.allTask[this.allTask.length - 1].cms_type)
                      // }, 500)
                      this.$nextTick(() => {
                        this.disabledFormInput(this.allTask[this.allTask.length - 1].cms_type)
                      })
                    }
                  })
              }
            })

          // this.addPanelVisible = false
          // this.form.resetFields()

          // setTimeout(() => {
          //   this.siteCheck(this.allTask[this.allTask.length - 1].id)
          //     .then(res => {
          //       this.newAddConfigFormSave = false
          //       this.addPanelVisible = false
          //       this.form.resetFields()
          //       if (res) {
          //         this.editPanelData = this.allTask[this.allTask.length - 1]
          //         this.disabledFormInput(this.allTask[this.allTask.length - 1].cms_type)
          //         this.editPanelVisible = true
          //       }
          //     })
          // }, 0)
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
      this.$nextTick(() => {
        // this.getEditFormConstraint(values.cms_type)
        this.disabledFormInput(values.cms_type)
      })
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
    },
    // 新增配置 CMS类型
    getCmsType (value) {
      switch (true) {
        case value === '织梦(dedeCMS)':
          this.systemUserName = '系统用户名'
          this.articleAuthorExtra = '自定义'
          this.InterfaceFileNameDisabled = true
          this.form.setFieldsValue({ path: 'index.php' })
          this.rootDirectoryDisabled = true
          this.form.setFieldsValue({ root: '91nlp' })
          this.form.setFieldsValue({ passwd: '91nlp' })
          break
        case value === '帝国(empCMS)':
          this.systemUserName = '系统用户名'
          this.articleAuthorExtra = '自定义'
          this.InterfaceFileNameDisabled = false
          this.form.setFieldsValue({ path: '91nlp_emp.php' })
          this.rootDirectoryDisabled = true
          this.form.setFieldsValue({ root: 'e/admin' })
          this.form.setFieldsValue({ passwd: '91nlp' })
          break
        case value === 'discuz':
          this.articleAuthorExtra = '系统用户名'
          this.systemUserName = '自定义'
          this.InterfaceFileNameDisabled = false
          this.form.setFieldsValue({ path: '91nlp_discuz.php' })
          this.rootDirectoryDisabled = true
          this.form.setFieldsValue({ root: '/' })
          this.form.setFieldsValue({ passwd: '91nlp' })
          break
        case value === 'Z-BLOG':
          this.articleAuthorExtra = '系统用户ID'
          this.systemUserName = '自定义'
          this.InterfaceFileNameDisabled = false
          this.form.setFieldsValue({ path: '91nlp_zblog.php' })
          this.rootDirectoryDisabled = true
          this.form.setFieldsValue({ root: 'zb_users/plugin/91nlp' })
          this.form.setFieldsValue({ passwd: '' })
          break
        case value === '易优CMS(EYouCMS)':
          this.systemUserName = '自定义'
          this.articleAuthorExtra = '自定义'
          this.InterfaceFileNameDisabled = true
          this.form.setFieldsValue({ path: 'J1nlp_ey.php' })
          this.rootDirectoryDisabled = true
          this.form.setFieldsValue({ root: '/api/J1nlp' })
          this.form.setFieldsValue({ passwd: '91nlp' })
          break
        case value === 'WordPress':
          this.systemUserName = '自定义'
          this.articleAuthorExtra = '自定义'
          this.InterfaceFileNameDisabled = true
          this.form.setFieldsValue({ path: 'admin-ajax.php' })
          this.rootDirectoryDisabled = true
          this.form.setFieldsValue({ root: 'wp-admin' })
          this.form.setFieldsValue({ passwd: '91nlp' })
          break
        default:
          this.newAddConfigFormReset()
      }
    },
    // 新增配置 表单重置
    newAddConfigFormReset () {
      this.systemUserName = ''
      this.articleAuthorExtra = ''
      this.InterfaceFileNameDisabled = false
      this.form.setFieldsValue({ path: '' })
      this.rootDirectoryDisabled = false
      this.form.setFieldsValue({ root: '' })
      this.form.setFieldsValue({ passwd: '' })
    },
    // 编辑表单 CMS 类型
    editFormCmsType (value) {
      this.getEditFormConstraint(value)
    },
    // 关闭新增对话框 回调
    closeNewAddDialog () {
      this.newAddConfigFormReset()
      this.newAddConfigFormSave = false
    },
    // 编辑配置 表单约束
    getEditFormConstraint (value) {
      switch (true) {
        case value === '织梦(dedeCMS)':
          this.InterfaceFileNameDisabled = true
          this.formEdit.setFieldsValue({ path: 'index.php' })
          this.rootDirectoryDisabled = true
          this.formEdit.setFieldsValue({ root: '91nlp' })
          break
        case value === '帝国(empCMS)':
          this.InterfaceFileNameDisabled = false
          this.formEdit.setFieldsValue({ path: '91nlp_emp.php' })
          this.rootDirectoryDisabled = true
          this.formEdit.setFieldsValue({ root: 'e/admin' })
          break
        case value === 'discuz':
          this.InterfaceFileNameDisabled = false
          this.formEdit.setFieldsValue({ path: '91nlp_discuz.php' })
          this.rootDirectoryDisabled = true
          this.formEdit.setFieldsValue({ root: '/' })
          break
        case value === 'Z-BLOG':
          this.InterfaceFileNameDisabled = false
          this.formEdit.setFieldsValue({ path: '91nlp_zblog.php' })
          this.rootDirectoryDisabled = true
          this.formEdit.setFieldsValue({ root: 'zb_users/plugin/91nlp' })
          break
        case value === '易优CMS(EYouCMS)':
          this.InterfaceFileNameDisabled = true
          this.formEdit.setFieldsValue({ path: 'J1nlp_ey.php' })
          this.rootDirectoryDisabled = true
          this.formEdit.setFieldsValue({ root: '/api/J1nlp' })
          break
        case value === 'WordPress':
          this.InterfaceFileNameDisabled = true
          this.formEdit.setFieldsValue({ path: 'admin-ajax.php' })
          this.rootDirectoryDisabled = true
          this.formEdit.setFieldsValue({ root: 'wp-admin' })
          break
        default:
      }
    },
    // 编辑按钮 禁用表单输入框
    disabledFormInput (value) {
      switch (true) {
        case value === '织梦(dedeCMS)':
          this.InterfaceFileNameDisabled = true
          this.rootDirectoryDisabled = true
          break
        case value === '帝国(empCMS)':
          this.InterfaceFileNameDisabled = false
          this.rootDirectoryDisabled = true
          break
        case value === 'discuz':
          this.InterfaceFileNameDisabled = false
          this.rootDirectoryDisabled = true
          break
        case value === 'Z-BLOG':
          this.InterfaceFileNameDisabled = false
          this.rootDirectoryDisabled = true
          break
        case value === '易优CMS(EYouCMS)':
          this.InterfaceFileNameDisabled = true
          this.rootDirectoryDisabled = true
          break
        case value === 'WordPress':
          this.InterfaceFileNameDisabled = true
          this.rootDirectoryDisabled = true
          break
        default:
      }
    },
    closeEditDialog () {
      this.InterfaceFileNameDisabled = false
      this.rootDirectoryDisabled = false
    },
    showPluginInstallDocument () {
      this.installPluginDocumentvisible = true
    },
    onCloseInstallPluginDocument () {
      this.installPluginDocumentvisible = false
    },
    showpreviewPictureModal (e) {
      this.previewPictureVisible = true
      this.previewPictureDefaultValue = e.target.currentSrc
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
