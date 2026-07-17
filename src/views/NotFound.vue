<template>
  <div class="not-found">
    <div class="tech-backdrop">
      <div class="tech-backdrop__orb tech-backdrop__orb--a"></div>
      <div class="tech-backdrop__orb tech-backdrop__orb--b"></div>
      <div class="tech-backdrop__grid"></div>
    </div>
    <div class="not-found__content animate-fade-in">
      <div class="not-found__code">404</div>
      <h2 class="not-found__title">页面未找到</h2>
      <p class="not-found__desc">您访问的页面不存在或已被移动</p>
      <el-button type="primary" size="large" @click="$router.push('/')">
        <el-icon><HomeFilled /></el-icon>
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { HomeFilled } from '@element-plus/icons-vue'
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
}

.not-found__content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.not-found__code {
  font-size: 120px;
  font-weight: 700;
  line-height: 1;
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-light));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
}

.not-found__title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}

.not-found__desc {
  font-size: 14px;
  color: var(--color-text-3);
  margin-bottom: 24px;
}
</style>
