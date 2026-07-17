<template>
  <div class="auth-page">
    <!-- 科技背景装饰 -->
    <div class="tech-backdrop">
      <div class="tech-backdrop__orb tech-backdrop__orb--a"></div>
      <div class="tech-backdrop__orb tech-backdrop__orb--b"></div>
      <div class="tech-backdrop__grid"></div>
    </div>

    <!-- 登录卡片 -->
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
        <h1 class="auth-card__title">Telegram 云飞投</h1>
        <p class="auth-card__subtitle">云端 Telegram 自动投注控制台</p>
      </div>

      <!-- 表单 -->
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        size="large"
        @submit.prevent="onSubmit"
      >
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
            autocomplete="current-password"
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

        <div class="auth-card__row">
          <el-checkbox v-model="form.remember">记住我</el-checkbox>
          <a class="auth-card__link" href="javascript:;" @click="onForgot">忘记密码？</a>
        </div>

        <el-button
          type="primary"
          class="auth-card__submit"
          :loading="loading"
          @click="onSubmit"
        >
          登 录
        </el-button>
      </el-form>

      <!-- 底部 -->
      <div class="auth-card__footer">
        还没有账号？<router-link to="/register" class="auth-card__link">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const formRef = ref()
const loading = ref(false)
const showPassword = ref(false)
const fxX = ref(50)
const fxY = ref(50)

const form = reactive({
  username: '',
  password: '',
  remember: true
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少 6 位', trigger: 'blur' }
  ]
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
      localStorage.setItem('bet:token', 'demo-token-' + Date.now())
      ElMessage.success('登录成功')
      loading.value = false
      const next = route.query.next || '/'
      router.push(next)
    }, 600)
  })
}

function onForgot() {
  ElMessage.info('请联系管理员重置密码')
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
  margin-bottom: 28px;
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

/* 表单行 */
.auth-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
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
