<template>
  <div class="member-page animate-fade-in">
    <div class="page-header">
      <h2>会员信息</h2>
      <p class="text-secondary">管理您的账户和会员权益</p>
    </div>

    <!-- 会员卡片 -->
    <div class="member-banner card-base">
      <div class="member-banner__left">
        <el-avatar :size="64" style="background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));">
          <el-icon :size="32"><User /></el-icon>
        </el-avatar>
        <div>
          <div class="member-banner__name">
            Alice_28
            <el-tag type="warning" effect="dark" size="small" round>VIP</el-tag>
          </div>
          <p class="text-secondary">注册时间: 2024-03-15</p>
        </div>
      </div>
      <div class="member-banner__right">
        <div class="member-stat">
          <span class="member-stat__value">1,288</span>
          <span class="member-stat__label">总投注</span>
        </div>
        <div class="member-stat">
          <span class="member-stat__value text-success">+¥8,668</span>
          <span class="member-stat__label">总盈亏</span>
        </div>
        <div class="member-stat">
          <span class="member-stat__value">58.3%</span>
          <span class="member-stat__label">胜率</span>
        </div>
        <div class="member-stat">
          <span class="member-stat__value">124</span>
          <span class="member-stat__label">活跃天数</span>
        </div>
      </div>
    </div>

    <el-row :gutter="16">
      <!-- 套餐信息 -->
      <el-col :xs="24" :lg="12">
        <div class="card-base">
          <div class="card-header"><h3>当前套餐</h3></div>
          <div class="card-body">
            <div class="plan-info">
              <div>
                <span class="plan-info__name">专业版</span>
                <el-tag type="success" effect="plain" size="small">使用中</el-tag>
              </div>
              <span class="plan-info__expire text-secondary">到期: 2025-03-15</span>
            </div>
            <ul class="benefits-list">
              <li><el-icon color="var(--color-success)"><CircleCheckFilled /></el-icon> 多账号绑定 (最多5个)</li>
              <li><el-icon color="var(--color-success)"><CircleCheckFilled /></el-icon> 全策略解锁</li>
              <li><el-icon color="var(--color-success)"><CircleCheckFilled /></el-icon> 优先客服支持</li>
              <li><el-icon color="var(--color-success)"><CircleCheckFilled /></el-icon> 高级数据分析</li>
              <li><el-icon color="var(--color-success)"><CircleCheckFilled /></el-icon> API 接口访问</li>
            </ul>
            <div class="plan-actions">
              <el-button type="primary">续费</el-button>
              <el-button>升级套餐</el-button>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 使用记录 -->
      <el-col :xs="24" :lg="12">
        <div class="card-base">
          <div class="card-header"><h3>本月使用</h3></div>
          <div class="card-body">
            <div class="usage-item">
              <div class="usage-item__header">
                <span>投注次数</span>
                <span class="text-secondary">{{ usage.bets }}/10000</span>
              </div>
              <el-progress :percentage="usage.bets / 100" :color="'var(--color-brand)'" :show-text="false" />
            </div>
            <div class="usage-item">
              <div class="usage-item__header">
                <span>API 调用</span>
                <span class="text-secondary">{{ usage.apiCalls }}/50000</span>
              </div>
              <el-progress :percentage="usage.apiCalls / 500" :color="'var(--color-success)'" :show-text="false" />
            </div>
            <div class="usage-item">
              <div class="usage-item__header">
                <span>存储使用</span>
                <span class="text-secondary">{{ usage.storage }}MB/500MB</span>
              </div>
              <el-progress :percentage="usage.storage / 5" :color="'var(--color-warning)'" :show-text="false" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 账户安全 -->
    <div class="card-base">
      <div class="card-header"><h3>账户安全</h3></div>
      <div class="card-body">
        <div class="security-row">
          <div class="security-row__left">
            <el-icon :size="20" color="var(--color-brand)"><Lock /></el-icon>
            <div>
              <span class="security-row__title">登录密码</span>
              <p class="text-secondary">建议定期修改密码以保护账户安全</p>
            </div>
          </div>
          <el-button text type="primary" @click="ElMessage.info('修改密码功能开发中')">修改</el-button>
        </div>
        <div class="security-row">
          <div class="security-row__left">
            <el-icon :size="20" color="var(--color-success)"><CircleCheck /></el-icon>
            <div>
              <span class="security-row__title">两步验证</span>
              <p class="text-secondary">为账户增加额外的安全保护层</p>
            </div>
          </div>
          <el-switch v-model="twoFA" @change="ElMessage.success(twoFA ? '两步验证已开启' : '两步验证已关闭')" />
        </div>
        <div class="security-row">
          <div class="security-row__left">
            <el-icon :size="20" color="var(--color-warning)"><Monitor /></el-icon>
            <div>
              <span class="security-row__title">登录设备管理</span>
              <p class="text-secondary">查看和管理已登录的设备</p>
            </div>
          </div>
          <el-button text type="primary" @click="ElMessage.info('当前有2台设备在线')">查看</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User, CircleCheckFilled, CircleCheck, Lock, Monitor } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const twoFA = ref(true)
const usage = ref({ bets: 1288, apiCalls: 12500, storage: 128 })
</script>

<style scoped>
.member-page { display: flex; flex-direction: column; gap: 16px; }
.page-header h2 { font-size: 20px; font-weight: 600; margin-bottom: 4px; }
.page-header p { font-size: 13px; }

.member-banner {
  display: flex; align-items: center; justify-content: space-between;
  padding: 24px; flex-wrap: wrap; gap: 16px;
}
.member-banner__left { display: flex; align-items: center; gap: 16px; }
.member-banner__name { font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.member-banner__right { display: flex; gap: 32px; flex-wrap: wrap; }
.member-stat { display: flex; flex-direction: column; align-items: center; }
.member-stat__value { font-size: 22px; font-weight: 700; }
.member-stat__label { font-size: 12px; color: var(--color-text-3); }

.card-header { padding: 16px 20px; border-bottom: 1px solid var(--color-divider); }
.card-header h3 { font-size: 15px; font-weight: 600; }
.card-body { padding: 20px; }

.plan-info { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.plan-info__name { font-size: 18px; font-weight: 600; margin-right: 8px; }

.benefits-list { list-style: none; margin-bottom: 20px; }
.benefits-list li { display: flex; align-items: center; gap: 8px; padding: 8px 0; font-size: 14px; }

.plan-actions { display: flex; gap: 12px; }

.usage-item { margin-bottom: 20px; }
.usage-item:last-child { margin-bottom: 0; }
.usage-item__header { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }

.security-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 0; border-bottom: 1px solid var(--color-divider);
}
.security-row:last-child { border-bottom: none; }
.security-row__left { display: flex; align-items: center; gap: 12px; }
.security-row__title { font-size: 14px; font-weight: 500; }
.security-row__left p { font-size: 12px; }
</style>
