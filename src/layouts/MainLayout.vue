<template>
  <div class="layout">
    <!-- 背景装饰层 -->
    <div class="tech-backdrop">
      <div class="tech-backdrop__orb tech-backdrop__orb--a"></div>
      <div class="tech-backdrop__orb tech-backdrop__orb--b"></div>
      <div class="tech-backdrop__grid"></div>
    </div>

    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ 'is-collapsed': collapsed }">
      <div class="sidebar__logo">
        <div class="sidebar__logo-icon">
          <el-icon :size="20"><Promotion /></el-icon>
        </div>
        <span v-show="!collapsed" class="sidebar__logo-text">云飞投</span>
      </div>

      <el-scrollbar class="sidebar__scroll">
        <el-menu
          :default-active="activeMenu"
          :collapse="collapsed"
          :collapse-transition="false"
          router
          class="sidebar__menu"
          background-color="transparent"
          text-color="rgba(255,255,255,.65)"
          active-text-color="#ffffff"
        >
          <el-menu-item
            v-for="item in menuItems"
            :key="item.path"
            :index="item.path"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>

      <div class="sidebar__footer">
        <button
          class="sidebar__collapse-btn"
          :title="collapsed ? '展开侧边栏' : '收起侧边栏'"
          @click="toggleCollapse"
        >
          <el-icon :size="16">
            <Expand v-if="collapsed" />
            <Fold v-else />
          </el-icon>
          <span v-show="!collapsed" class="sidebar__collapse-text">收起菜单</span>
        </button>
      </div>
    </aside>

    <!-- 主区域 -->
    <div class="main" :class="{ 'is-collapsed': collapsed }">
      <!-- 顶部导航栏 -->
      <header class="topbar">
        <div class="topbar-glowline">
          <div class="topbar-sweep"></div>
        </div>
        <div class="topbar__left">
          <button
            class="topbar__icon-btn"
            :title="collapsed ? '展开侧边栏' : '收起侧边栏'"
            @click="toggleCollapse"
          >
            <el-icon :size="18">
              <Expand v-if="collapsed" />
              <Fold v-else />
            </el-icon>
          </button>
          <h1 class="topbar__title">{{ pageTitle }}</h1>
        </div>
        <div class="topbar__right">
          <button
            class="topbar__icon-btn"
            :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
            @click="toggleTheme"
          >
            <el-icon :size="18">
              <Sunny v-if="isDark" />
              <Moon v-else />
            </el-icon>
          </button>
          <el-dropdown trigger="click" @command="handleUserCommand">
            <div class="topbar__user">
              <el-avatar :size="30" class="topbar__avatar">U</el-avatar>
              <span class="topbar__username">用户</span>
              <el-icon class="topbar__arrow"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="member">
                  <el-icon><User /></el-icon>会员信息
                </el-dropdown-item>
                <el-dropdown-item command="preferences">
                  <el-icon><Setting /></el-icon>偏好配置
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 内容区域 -->
      <main class="content">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

const collapsed = ref(false)
const isDark = ref(false)

const menuItems = [
  { path: '/', title: '首页', icon: 'HomeFilled' },
  { path: '/accounts', title: '账号绑定', icon: 'ChatDotRound' },
  { path: '/settings/engine', title: '投注策略', icon: 'Lightning' },
  { path: '/preferences', title: '偏好配置', icon: 'Setting' },
  { path: '/bets', title: '投注记录', icon: 'Tickets' },
  { path: '/backtest', title: '策略回测', icon: 'Histogram' },
  { path: '/help', title: '帮助中心', icon: 'QuestionFilled' },
  { path: '/member', title: '会员信息', icon: 'User' }
]

const activeMenu = computed(() => {
  const path = route.path
  if (menuItems.some((i) => i.path === path)) return path
  let best = '/'
  for (const item of menuItems) {
    if (item.path !== '/' && path.startsWith(item.path) && item.path.length > best.length) {
      best = item.path
    }
  }
  return best
})

const pageTitle = computed(() => route.meta.title || '云飞投')

function toggleCollapse() {
  collapsed.value = !collapsed.value
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

function toggleTheme() {
  isDark.value = !isDark.value
  localStorage.setItem('bet:theme', isDark.value ? 'dark' : 'light')
  applyTheme()
}

function handleUserCommand(command) {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        localStorage.removeItem('bet:token')
        ElMessage.success('已退出登录')
        router.push('/login')
      })
      .catch(() => {})
  } else if (command === 'member') {
    router.push('/member')
  } else if (command === 'preferences') {
    router.push('/preferences')
  }
}

onMounted(() => {
  isDark.value = localStorage.getItem('bet:theme') === 'dark'
  applyTheme()
})
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

/* ===== 侧边栏 ===== */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: var(--color-sidebar-bg);
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow: hidden;
  transition: width 0.28s ease;
}
.sidebar.is-collapsed {
  width: var(--sidebar-width-collapsed);
}

.sidebar__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  height: var(--navbar-height);
  padding: 0 16px;
  background: var(--color-sidebar-logo-bg);
  color: #fff;
  flex-shrink: 0;
}
.sidebar.is-collapsed .sidebar__logo {
  justify-content: center;
  padding: 0;
}
.sidebar__logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  flex-shrink: 0;
}
.sidebar__logo-text {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  white-space: nowrap;
}

.sidebar__scroll {
  flex: 1;
  min-height: 0;
}

/* 菜单覆盖样式 */
.sidebar__menu {
  border-right: none !important;
}
.sidebar__menu:not(.el-menu--collapse) {
  width: var(--sidebar-width) !important;
}
.sidebar__menu.el-menu--collapse {
  width: var(--sidebar-width-collapsed) !important;
}
.sidebar__menu :deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.65);
  height: 46px;
  line-height: 46px;
  margin: 2px 8px;
  border-radius: 8px;
  border-left: 3px solid transparent;
  transition: background-color 0.2s, color 0.2s;
}
.sidebar__menu :deep(.el-menu-item:hover) {
  background: rgba(64, 145, 247, 0.15) !important;
  color: #fff;
}
.sidebar__menu :deep(.el-menu-item.is-active) {
  background: rgba(64, 145, 247, 0.18) !important;
  color: #fff !important;
  border-left-color: var(--color-brand);
}
.sidebar__menu:not(.el-menu--collapse) :deep(.el-menu-item .el-icon) {
  margin-right: 10px;
  font-size: 18px;
}

.sidebar__footer {
  flex-shrink: 0;
  padding: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.sidebar__collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 36px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.65);
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}
.sidebar__collapse-btn:hover {
  background: rgba(64, 145, 247, 0.15);
  color: #fff;
}
.sidebar__collapse-text {
  font-size: 13px;
  white-space: nowrap;
}

/* ===== 主区域 ===== */
.main {
  flex: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.28s ease;
}
.main.is-collapsed {
  margin-left: var(--sidebar-width-collapsed);
}

/* ===== 顶部导航栏 ===== */
.topbar {
  position: sticky;
  top: 0;
  height: var(--navbar-height);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-divider);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 50;
}
.topbar__left,
.topbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.topbar__icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--color-text-2);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}
.topbar__icon-btn:hover {
  background: var(--color-bg-3);
  color: var(--color-brand);
}
.topbar__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}
.topbar__user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.topbar__user:hover {
  background: var(--color-bg-3);
}
.topbar__avatar {
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}
.topbar__username {
  font-size: 13px;
  color: var(--color-text);
}
.topbar__arrow {
  color: var(--color-text-3);
  font-size: 12px;
}

/* ===== 内容区域 ===== */
.content {
  flex: 1;
  padding: 16px;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .sidebar {
    width: var(--sidebar-width-collapsed);
  }
  .main {
    margin-left: var(--sidebar-width-collapsed);
  }
  .topbar__username {
    display: none;
  }
}
</style>
