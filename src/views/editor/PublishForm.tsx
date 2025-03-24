import { defineComponent, reactive, computed, onMounted, watch, ref } from 'vue'
import { Form } from 'ant-design-vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { last } from 'lodash-es'
import ClipboardJS from 'clipboard'
import { message } from 'ant-design-vue'
import { GlobalDataProps } from '@/store/index'
import { baseH5URL } from '@/main'
import { generateQRCode } from '@/utils/helper'
import '@/styles/editor/PublishForm.scss'
const useForm = Form.useForm;
export default defineComponent({

  emits: ['panel-close', 'publish-success'],
  setup() {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const currentWorkId = route.params.id as string
    const page = computed(() => store.state.editor.page)
    const channels = computed(() => store.state.editor.channels)
    const form = reactive({
      channelName: ''
    })
    const rules = reactive({
      channelName: [
        { required: true, message: '标题不能为空', trigger: 'blur' }
      ]
    })
    const { validate } = useForm(form, rules)
    const generateChannelURL = (id: number | string) =>
      `${baseH5URL}/p/${page.value.id}-${page.value.uuid}?channel=${id}`
    const createChannel = async () => {
      const payload = {
        name: form.channelName,
        workId: parseInt(currentWorkId)
      }
      try {
        await validate()
        await store.dispatch('createChannel', { data: payload })
        form.channelName = ''
      } catch (e) {
        console.error(e)
      }
    }
    const deleteDisabled = computed(() => channels.value.length === 1)
    const deleteChannel = (id: number | string) => {
      store.dispatch('deleteChannel', { urlParams: { id } })
    }
    onMounted(() => {
      const clipboard = new ClipboardJS('.copy-button')
      clipboard.on('success', (e: { clearSelection: () => void }) => {
        message.success('复制成功', 1)
        e.clearSelection()
      })
      channels.value.forEach(async channel => {
        try {
          await generateQRCode(`channel-barcode-${channel.id}`, generateChannelURL(channel.id))
        } catch (e) {
          console.error(e)
        }
      })
    })
    watch(channels, async (newChannels, oldChannels) => {
      if (newChannels.length > oldChannels.length) {
        // grab the last item for new channels
        const createdChannel = last(newChannels)
        if (createdChannel) {
          await generateQRCode(`channel-barcode-${createdChannel.id}`, generateChannelURL(createdChannel.id))
        }
      }
    }, {
      flush: 'post'
    })
    return {
      page,
      channels,
      createChannel,
      form,
      rules,
      deleteDisabled,
      deleteChannel,
      generateChannelURL
    }
  },
  render() {
    return (
      <div class="publish-channel-container">
        <a-row style={{ marginBottom: '20px' }}>
          <a-col span={8} class="left-col">
            封面图
            <img src={this.page.coverImg} alt={this.page.title} />
          </a-col>
          <a-col span={16} class="right-col">
            <a-row>
              <a-col span={6}>
                <img src={this.page.setting?.shareImg ? this.page.setting.shareImg : ''} alt={this.page.title} />
              </a-col>
              <a-col span={18} class="left-gap">
                <h4>{this.page.title}</h4>
                <p>{this.page.desc}</p>
              </a-col>
            </a-row>
            <a-tabs type="card" style={{ marginTop: '20px' }}>
              <a-tab-pane key="channels" tab="发布为作品">
                {
                  this.channels.map((channel) => (
                    <a-row key={channel.id} class="channel-item">
                      <a-col span={6}>
                        <canvas class="barcode-container" id={`channel-barcode-${channel.id}`} />
                      </a-col>
                      <a-col span={18} class="left-gap">
                        <h4>{channel.name}</h4>
                        <a-row>
                          <a-col span={18}>
                            <a-input value={this.generateChannelURL(channel.id)} readonly={true} id={`channel-url-${channel.id}`} />
                          </a-col>
                          <a-col span={6}>
                            <a-button class="copy-button" data-clipboard-target={`#channel-url-${channel.id}`}>复制</a-button>
                          </a-col>
                        </a-row>
                      </a-col>
                      <div class="delete-area">
                        <a-button danger onClick={() => this.deleteChannel(channel.id)} disabled={this.deleteDisabled}>删除渠道</a-button>
                      </div>
                    </a-row>
                  ))
                }

                <a-form layout="inline" style={{ marginTop: '20px' }} model={this.form} rules={this.rules}>
                  <a-form-item name="channelName">
                    <a-input placeholder="渠道名称" value={this.form.channelName} onChange={(e: { target: { value: string } }) => this.form.channelName = e.target.value}></a-input>
                  </a-form-item>
                  <a-form-item>
                    <a-button
                      type="primary"
                      onClick={this.createChannel}
                    >
                      创建新渠道
                    </a-button>
                  </a-form-item>
                </a-form>

              </a-tab-pane>
              <a-tab-pane key="template" tab="发布为模版">

              </a-tab-pane>
            </a-tabs>
          </a-col>
        </a-row>
      </div >
    )
  }
})