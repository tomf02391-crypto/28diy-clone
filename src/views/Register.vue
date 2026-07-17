<template>
  <div class="auth-page">
    <!-- 科技背景装饰 -->
    <div class="tech-backdrop">
      <div class="tech-backdrop__orb tech-backdrop__orb--a"></div>
      <div class="tech-backdrop__orb tech-backdrop__orb--b"></div>
      <div class="tech-backdrop__grid"></div>
    </div>

    <!-- 注册卡片 -->
    <div
      class="auth-card card-base fx-glow animate-slide-up"
      :style="{ '--fx-x': fxX + '%', '--fx-y': fxY + '%' }"
      @mousemove="onCardGlowMove"
    >
      <!-- 头部 -->
      <div class="auth-card__header">
        <div class="auth-card__logo animate-float">
          <el-icon :size="28"><Promotion /></el-icon>
        </div>
        <h1 class="auth-card__title">注册云飞投账号</h1>
        <p class="auth-card__subtitle">开启云端 Telegram 自动投注之旅</p>
      </div>

      <!-- 表单 -->
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        size="large"
        @submit.prevent="onSubmit"
      >
        <el-form-item prop="inviteCode">
          <el-input
            v-model="form.inviteCode"
            placeholder="请输入邀请码 / 卡密"
            autocomplete="off"
          >
            <template #prefix>
              <el-icon><Key /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            autocomplete="username"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            autocomplete="new-password"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
            <template #suffix>
              <el-icon class="auth-card__eye" @click="showPassword = !showPassword">
                <View v-if="showPassword" />
                <Hide v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            :type="showConfirm ? 'text' : 'password'"
            placeholder="请再次输入密码"
            autocomplete="new-password"
            @keyup.enter="onSubmit"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
            <template #suffix>
              <el-icon class="auth-card__eye" @click="showConfirm = !showConfirm">
                <View v-if="showConfirm" />
                <Hide v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="agreement" class="auth-card__agreement">
          <el-checkbox v-model="form.agreement">
            我已阅读并同意
            <a class="auth-card__link" href="javascript:;" @click.stop="onAgreement">《用户协议》</a>
          </el-checkbox>
        </el-form-item>

        <el-button
          type="primary"
          class="auth-card__submit"
          :loading="loading"
          @click="onSubmit"
        >
          注 册
        </el-button>
      </el-form>

      <!-- 底部 -->
      <div class="auth-card__footer">
        已有账号？<router-link to="/login" class="auth-card__link">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const formRef = ref()
const loading = ref(false)
const showPassword = ref(false)
const showConfirm = ref(false)
const fxX = ref(50)
const fxY = ref(50)

const form = reactive({
  inviteCode: '',
  username: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

const validateConfirm = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const validateAgreement = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请先同意用户协议'))
  } else {
    callback()
  }
}

const rules = {
  inviteCode: [{ required: true, message: '请输入邀请码 / 卡密', trigger: 'blur' }],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度 3-20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少 6 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirm, trigger: 'blur' }
  ],
  agreement: [{ validator: validateAgreement, trigger: 'change' }]
}

function onCardGlowMove(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  fxX.value = ((e.clientX - rect.left) / rect.width) * 100
  fxY.value = ((e.clientY - rect.top) / rect.height) * 100
}

function onSubmit() {
  formRef.value?.validate((valid) => {
    if (!valid) return
    loading.value = true
    setTimeout(() => {
      loading.value = false
      ElMessage.success('注册成功，请登录')
      router.push('/login')
    }, 600)
  })
}

function onAgreement() {
  ElMessage.info('用户协议内容请联系管理员获取')
}

onMounted(() => {
  document.documentElement.setAttribute(
    'data-theme',
    localStorage.getItem('bet:theme') === 'dark' ? 'dark' : 'light'
  )
})
</script>

<style scoped>
.auth-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: hidden;
}

.auth-card {
  width: 420px;
  max-width: 100%;
  padding: 36px 32px 28px;
  position: relative;
}

/* 头部 */
.auth-card__header {
  text-align: center;
  margin-bottom: 24px;
}
.auth-card__logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px -6px rgba(51, 144, 236, 0.55);
}
.auth-card__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 6px;
}
.auth-card__subtitle {
  font-size: 13px;
  color: var(--color-text-3);
  margin: 0;
}

/* 用户协议项 */
.auth-card__agreement {
  margin-bottom: 16px;
}
.auth-card__agreement :deep(.el-form-item__content) {
  justify-content: flex-start;
  line-height: 1.6;
}

.auth-card__link {
  color: var(--color-brand);
  font-size: 13px;
  cursor: pointer;
}
.auth-card__link:hover {
  text-decoration: underline;
}

/* 提交按钮 */
.auth-card__submit {
  width: 100%;
  height: 44px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 4px;
}

/* 底部 */
.auth-card__footer {
  margin-top: 22px;
  text-align: center;
  font-size: 13px;
  color: var(--color-text-3);
}

/* 密码显示切换 */
.auth-card__eye {
  cursor: pointer;
  color: var(--color-text-3);
  transition: color 0.2s;
}
.auth-card__eye:hover {
  color: var(--color-brand);
}

/* 表单项间距收紧 */
.auth-card :deep(.el-form-item) {
  margin-bottom: 18px;
}
</style>
