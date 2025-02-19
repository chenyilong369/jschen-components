import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { RedoOutlined, UndoOutlined } from '@ant-design/icons-vue'
import { GlobalDataProps } from '../../store/index'
import '@/styles/components/HistoryArea.scss'
export default defineComponent({
  components: {
    RedoOutlined,
    UndoOutlined
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const histories = computed(() => store.state.editor.histories)
    const historyIndex = computed(() => store.state.editor.historyIndex)
    const undoIsDisabled = computed<boolean>(() => store.getters.checkUndoDisable)
    const redoIsDisabled = computed<boolean>(() => store.getters.checkRedoDisable)

    const undoHistory = () => {
      store.commit('undo')
    }
    const redoHistory = () => {
      store.commit('redo')
    }
    return {
      histories,
      undoHistory,
      redoHistory,
      historyIndex,
      undoIsDisabled,
      redoIsDisabled
    }
  },
  render() {
    return (
      <>
        <div class="history-area">
          <div class="operation-list">
            <a-tooltip>
              {{
                title: () => <>撤销</>,
                default: () => (
                  <a-button shape="circle" onClick={() => this.undoHistory()} disabled={this.undoIsDisabled}>
                    {{
                      icon: () => <UndoOutlined />,
                      default: () => ''
                    }}
                  </a-button>
                )
              }}
            </a-tooltip>
            <a-tooltip>
              {{
                title: () => <>重做</>,
                default: () => (
                  <a-button shape="circle" onClick={() => this.redoHistory()} disabled={this.redoIsDisabled}>
                    {{
                      icon: () => <RedoOutlined />,
                      default: () => ''
                    }}
                  </a-button>
                )
              }}
            </a-tooltip>
          </div >
          {
            this.histories.map((item, index) => {
              return (
                <li key={item.id}>
                  <span class={{ bold: index === this.historyIndex }}>{item.type} - {item.data.key}</span>
                </li >
              )
            })
          }
        </div >
      </>
    )
  }
})