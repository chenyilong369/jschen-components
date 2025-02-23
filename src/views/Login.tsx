import { defineComponent, reactive, ref, Ref, computed, watch } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Form } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { Rule } from 'ant-design-vue/es/form/interface'
import { GlobalDataProps } from '../store/index'
import '@/styles/Login.scss'
const useForm = Form.useForm;

interface RuleFormInstance {
  validate: () => Promise<any>;
}
export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const isLoginLoading = computed(() => store.getters.isOpLoading('login'))
    const router = useRouter()
    const loginForm = ref() as Ref<RuleFormInstance>
    const form = reactive({
      cellphone: '',
      password: ''
    })
    const cellnumberValidator = (rule: Rule, value: string) => {
      return new Promise((resolve, reject) => {
        const passed = /^1[3-9]\d{9}$/.test(value.trim())
        setTimeout(() => {
          if (!value || !value.length) reject('手机号码不能为空')
          if (passed) {
            resolve('')
          } else {
            reject('手机号码格式不正确')
          }
        }, 100)
      })
    }
    const rules = reactive({
      cellphone: [
        // { required: true, message: '手机号码不能为空', trigger: 'blur' },
        // { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
        { required: true, asyncValidator: cellnumberValidator, trigger: 'blur' }
      ],
      password: [
        { required: true, message: '密码不能为空', trigger: 'blur' }
      ]
    })

    const { validate, resetFields } = useForm(form, rules)
    const login = () => {
      validate().then(() => {
        const payload = {
          username: form.cellphone,
          password: form.password
        }
        store.dispatch('loginAndFetch', { data: payload }).then(() => {
          message.success('登录成功 2秒后跳转首页')
          setTimeout(() => {
            router.push('/')
          }, 2000)
        })
      }).catch((_) => {
        return
      })
    }
    return {
      form,
      rules,
      loginForm,
      login,
      isLoginLoading
    }
  },
  render() {
    return (
      <>
        <div class="login-page">
          <a-row>
            <a-col span={24} class="login-area">
              <a-form layout="vertical" model={this.form} rules={this.rules} ref={this.loginForm}>
                <h2>欢迎回来</h2>
                <p class="subTitle">使用手机号码和密码登录</p>
                <a-form-item label="手机号码" required name="cellphone">
                  <a-input placeholder="手机号码" value={this.form.cellphone} onChange={(e: { target: { value: string } }) => this.form.cellphone = e.target?.value}>
                    {{
                      prefix: () => {
                        return <UserOutlined style="color:rgba(0,0,0,.25)" />
                      },
                      default: () => ''
                    }}
                  </a-input>
                </a-form-item>
                <a-form-item label="密码" required name="password">
                  <a-input type="password" placeholder="密码" value={this.form.password} onChange={(e: { target: { value: string } }) => this.form.password = e.target.value}>
                    {{
                      prefix: () => {
                        return <LockOutlined style="color:rgba(0,0,0,.25)" />
                      },
                      default: () => ''
                    }}
                  </a-input>
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" size="large" onClick={() => this.login()} loading={this.isLoginLoading}>
                    登录
                  </a-button>
                </a-form-item>
              </a-form>
            </a-col>
          </a-row>
        </div>
      </>
    )
  }
})