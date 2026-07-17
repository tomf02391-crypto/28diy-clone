<template>
  <div class="help-page animate-fade-in">
    <div class="page-header">
      <h2>帮助中心</h2>
      <p class="text-secondary">查找常见问题解答和使用指南</p>
    </div>

    <!-- 搜索 -->
    <div class="card-base search-card">
      <el-input v-model="searchQuery" placeholder="搜索常见问题..." size="large" :prefix-icon="Search" clearable />
    </div>

    <!-- 使用指南 -->
    <el-row :gutter="16">
      <el-col :xs="12" :sm="8" v-for="guide in guides" :key="guide.title">
        <div class="guide-card card-base fx-glow" @mousemove="onGlow">
          <div class="guide-card__icon" :style="{ color: 'var(--color-brand)' }">
            <el-icon :size="28"><component :is="guide.icon" /></el-icon>
          </div>
          <h3>{{ guide.title }}</h3>
          <p class="text-secondary">{{ guide.desc }}</p>
        </div>
      </el-col>
    </el-row>

    <!-- 常见问题 -->
    <div class="card-base">
      <div class="card-header"><h3>常见问题</h3></div>
      <el-collapse v-model="activeNames" style="padding: 0 20px;">
        <el-collapse-item v-for="(faq, i) in faqs" :key="i" :title="faq.q" :name="String(i)">
          <p class="faq-answer">{{ faq.a }}</p>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 联系客服 -->
    <div class="card-base contact-card">
      <div class="contact-card__left">
        <el-icon :size="32" color="var(--color-brand)"><Headset /></el-icon>
        <div>
          <h3>需要更多帮助？</h3>
          <p class="text-secondary">联系我们的客服团队，7x24 小时为您服务</p>
        </div>
      </div>
      <el-button type="primary" size="large" @click="ElMessage.success('正在连接客服...')">
        联系客服
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, Headset, Promotion, Lightning, ChatDotRound, Tickets, DataAnalysis, QuestionFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchQuery = ref('')
const activeNames = ref(['0'])

const onGlow = (e) => {
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--fx-x', `${e.clientX - rect.left}px`)
  el.style.setProperty('--fx-y', `${e.clientY - rect.top}px`)
}

const guides = [
  { title: '快速入门', desc: '5分钟了解云飞投的基本使用', icon: Promotion },
  { title: '策略配置', desc: '学习如何配置各类投注策略', icon: Lightning },
  { title: '账号管理', desc: '管理您的 Telegram 投注账号', icon: ChatDotRound },
  { title: '投注教程', desc: '了解投注流程和规则', icon: Tickets },
  { title: '数据分析', desc: '使用回测和统计工具', icon: DataAnalysis },
  { title: '常见问题', desc: '查找常见问题解答', icon: QuestionFilled },
]

const faqs = [
  { q: '如何绑定 Telegram 账号？', a: '1. 进入「账号绑定」页面，点击「绑定新账号」按钮。2. 输入您的 Telegram 手机号并获取验证码。3. 选择投注群组并确认绑定。绑定成功后，系统将自动监控该群组的开奖信息。' },
  { q: '投注策略如何配置？', a: '进入「投注策略」页面，选择需要配置的策略标签页。设置投注方向、基础注额、倍投模式、止盈止损等参数。配置完成后点击「保存配置」即可生效。' },
  { q: '什么是马丁格尔倍投？', a: '马丁格尔倍投是一种经典投注策略：每次亏损后将投注额翻倍，以覆盖之前的亏损并获利。例如：首注10U，亏损后投20U，再亏损投40U，以此类推。需注意设置最大倍投次数以控制风险。' },
  { q: '如何查看投注记录？', a: '进入「投注记录」页面，可按时间范围、策略类型和投注结果进行筛选。支持导出记录明细，方便进行数据分析和对账。' },
  { q: '资金安全如何保障？', a: '云飞投采用银行级加密技术保护您的账户安全。所有投注资金均在 Telegram 群组内完成，平台不接触资金。同时提供风控配置，包括单笔限额、日限额和止损设置。' },
  { q: '如何联系客服？', a: '您可以通过页面底部的「联系客服」按钮直接与我们的7x24小时在线客服对话。也可以通过 Telegram 官方客服账号 @cloud_bet_support 联系我们。' },
]
</script>

<style scoped>
.help-page { display: flex; flex-direction: column; gap: 16px; }
.page-header h2 { font-size: 20px; font-weight: 600; margin-bottom: 4px; }
.page-header p { font-size: 13px; }

.search-card { padding: 4px; }

.guide-card {
  padding: 24px; cursor: pointer; margin-bottom: 16px;
  transition: transform .3s;
}
.guide-card:hover { transform: translateY(-2px); }
.guide-card__icon { margin-bottom: 12px; }
.guide-card h3 { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
.guide-card p { font-size: 13px; }

.card-header { padding: 16px 20px; border-bottom: 1px solid var(--color-divider); }
.card-header h3 { font-size: 15px; font-weight: 600; }
.faq-answer { font-size: 14px; color: var(--color-text-2); line-height: 1.6; padding: 8px 0; }

.contact-card {
  display: flex; align-items: center; justify-content: space-between;
  padding: 24px;
}
.contact-card__left { display: flex; align-items: center; gap: 16px; }
.contact-card__left h3 { font-size: 16px; font-weight: 600; margin-bottom: 2px; }
.contact-card__left p { font-size: 13px; }
</style>
