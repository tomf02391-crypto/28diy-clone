<template>
  <div class="home-page">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner animate-slide-up card-base fx-glow" @mousemove="onGlow">
      <div class="welcome-banner__left">
        <h2>{{ greeting }}，欢迎回来</h2>
        <p>系统运行正常 · 最后更新 {{ currentTime }}</p>
      </div>
      <div class="welcome-banner__right">
        <el-tag type="success" effect="dark" round>
          <el-icon><CircleCheckFilled /></el-icon>
          运行中
        </el-tag>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="6" v-for="(stat, i) in stats" :key="stat.label">
        <div
          class="stat-card card-base fx-glow animate-slide-up"
          :style="{ animationDelay: `${i * 0.08}s` }"
          @mousemove="onGlow"
        >
          <div class="stat-card__icon" :style="{ background: stat.bg, color: stat.color }">
            <el-icon :size="24"><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-card__body">
            <div class="stat-card__value" :style="{ color: stat.color }">{{ stat.value }}</div>
            <div class="stat-card__label">{{ stat.label }}</div>
            <div class="stat-card__trend" :class="stat.trend > 0 ? 'text-success' : 'text-danger'">
              {{ stat.trend > 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}% vs 昨日
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="chart-row">
      <!-- 走势图 -->
      <el-col :xs="24" :lg="16">
        <div class="card-base animate-slide-up" style="animation-delay: .3s">
          <div class="card-header">
            <h3>开奖走势</h3>
            <el-select v-model="chartPeriod" size="small" style="width: 120px">
              <el-option label="最近30期" value="30" />
              <el-option label="最近50期" value="50" />
              <el-option label="最近100期" value="100" />
            </el-select>
          </div>
          <v-chart :option="chartOption" autoresize style="height: 320px" />
        </div>
      </el-col>

      <!-- 策略执行 -->
      <el-col :xs="24" :lg="8">
        <div class="card-base animate-slide-up" style="animation-delay: .4s">
          <div class="card-header">
            <h3>策略执行概况</h3>
          </div>
          <div class="strategy-list scrollbar-hover">
            <div v-for="s in strategies" :key="s.name" class="strategy-item fx-glow" @mousemove="onGlow">
              <div class="strategy-item__info">
                <span class="strategy-item__name">{{ s.name }}</span>
                <el-tag :type="s.running ? 'success' : 'info'" size="small" effect="plain">
                  {{ s.running ? '运行中' : '已停止' }}
                </el-tag>
              </div>
              <div class="strategy-item__stats">
                <span>{{ s.bets }}注</span>
                <span :class="s.profit >= 0 ? 'text-success' : 'text-danger'">
                  {{ s.profit >= 0 ? '+' : '' }}¥{{ s.profit.toFixed(2) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 最近投注 -->
    <div class="card-base animate-slide-up" style="animation-delay: .5s">
      <div class="card-header">
        <h3>最近投注记录</h3>
        <el-button text type="primary" @click="$router.push('/bets')">查看全部</el-button>
      </div>
      <el-table :data="recentBets" stripe style="width: 100%">
        <el-table-column prop="time" label="时间" width="100" />
        <el-table-column prop="period" label="期号" width="120" />
        <el-table-column prop="strategy" label="策略" width="120">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.strategy }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bet" label="投注内容" />
        <el-table-column prop="amount" label="金额" width="80" align="right" />
        <el-table-column label="结果" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="resultTag(row.result)" size="small">{{ row.result }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="盈亏" width="100" align="right">
          <template #default="{ row }">
            <span :class="profitClass(row)">{{ profitText(row) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { CircleCheckFilled, TrendCharts, Wallet, UserFilled, Trophy } from '@element-plus/icons-vue'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent])

const currentTime = ref('')
let timer = null

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '凌晨好'
  if (h < 12) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
})

const updateTime = () => {
  const d = new Date()
  currentTime.value = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})
onUnmounted(() => { clearInterval(timer) })

const onGlow = (e) => {
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--fx-x', `${e.clientX - rect.left}px`)
  el.style.setProperty('--fx-y', `${e.clientY - rect.top}px`)
}

const stats = [
  { label: '今日投注', value: '288', icon: TrendCharts, color: 'var(--color-brand)', bg: 'rgba(51,144,236,.1)', trend: 12 },
  { label: '今日盈亏', value: '+¥3,668.50', icon: Wallet, color: 'var(--color-success)', bg: 'rgba(21,128,61,.1)', trend: 8 },
  { label: '活跃账号', value: '3/5', icon: UserFilled, color: 'var(--color-warning)', bg: 'rgba(180,83,9,.1)', trend: 0 },
  { label: '中奖率', value: '62.5%', icon: Trophy, color: 'var(--color-brand)', bg: 'rgba(51,144,236,.1)', trend: 5 },
]

const chartPeriod = ref('30')

const chartOption = computed(() => {
  const data = Array.from({ length: 30 }, (_, i) => ({
    period: `#${(3350001 + i).toString()}`,
    value: Math.floor(Math.random() * 29)
  }))
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      data: data.map(d => d.period),
      axisLine: { lineStyle: { color: 'var(--color-divider)' } },
      axisLabel: { color: 'var(--color-text-3)', fontSize: 11, rotate: 30 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 28,
      axisLine: { show: false },
      axisLabel: { color: 'var(--color-text-3)' },
      splitLine: { lineStyle: { color: 'var(--color-divider)' } },
    },
    series: [{
      data: data.map(d => d.value),
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { color: '#3390ec', width: 2 },
      itemStyle: { color: '#3390ec' },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(51,144,236,.25)' },
            { offset: 1, color: 'rgba(51,144,236,0)' }
          ]
        }
      }
    }]
  }
})

const strategies = [
  { name: '大小单双', running: true, bets: 128, profit: 1860.50 },
  { name: '长龙捕手', running: true, bets: 56, profit: 920.00 },
  { name: '智能预测', running: true, bets: 42, profit: -280.00 },
  { name: '算法大厅', running: false, bets: 0, profit: 0 },
  { name: '对冲套利', running: false, bets: 0, profit: 0 },
  { name: '组合投注', running: true, bets: 62, profit: 1168.00 },
]

const recentBets = [
  { time: '14:32', period: '#3350030', strategy: '大小单双', bet: '大', amount: '10', result: '赢', profit: 9.7 },
  { time: '14:28', period: '#3350029', strategy: '长龙捕手', bet: '小-连5', amount: '20', result: '赢', profit: 19.4 },
  { time: '14:22', period: '#3350028', strategy: '智能预测', bet: '单', amount: '15', result: '输', profit: -15 },
  { time: '14:15', period: '#3350027', strategy: '组合投注', bet: '大+双', amount: '10', result: '赢', profit: 9.2 },
  { time: '14:08', period: '#3350026', strategy: '大小单双', bet: '小', amount: '10', result: '待开奖', profit: 0 },
  { time: '14:00', period: '#3350025', strategy: '长龙捕手', bet: '大-连3', amount: '15', result: '输', profit: -15 },
  { time: '13:52', period: '#3350024', strategy: '大小单双', bet: '双', amount: '10', result: '赢', profit: 9.5 },
]

const resultTag = (r) => r === '赢' ? 'success' : r === '输' ? 'danger' : 'warning'
const profitClass = (row) => row.profit > 0 ? 'text-success' : row.profit < 0 ? 'text-danger' : 'text-secondary'
const profitText = (row) => row.profit > 0 ? `+¥${row.profit.toFixed(1)}` : row.profit < 0 ? `-¥${Math.abs(row.profit).toFixed(1)}` : '--'
</script>

<style scoped>
.home-page { display: flex; flex-direction: column; gap: 16px; }

.welcome-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-dark) 100%);
  border: none;
}
.welcome-banner h2 { color: #fff; font-size: 20px; font-weight: 600; margin-bottom: 4px; }
.welcome-banner p { color: rgba(255,255,255,.8); font-size: 13px; }

.stats-row { margin-bottom: 0; }
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}
.stat-card__icon {
  width: 48px; height: 48px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.stat-card__value { font-size: 24px; font-weight: 700; line-height: 1.2; }
.stat-card__label { font-size: 13px; color: var(--color-text-2); margin: 2px 0; }
.stat-card__trend { font-size: 11px; }

.chart-row { margin-bottom: 0; }

.card-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid var(--color-divider);
}
.card-header h3 { font-size: 15px; font-weight: 600; }

.strategy-list {
  padding: 8px;
  max-height: 320px;
  overflow-y: auto;
}
.strategy-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; border-radius: 8px; cursor: pointer;
  transition: background .2s;
}
.strategy-item:hover { background: var(--color-bg-3); }
.strategy-item__info { display: flex; align-items: center; gap: 8px; }
.strategy-item__name { font-size: 14px; font-weight: 500; }
.strategy-item__stats { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--color-text-2); }
</style>
