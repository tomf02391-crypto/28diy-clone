<template>
  <div class="backtest-page animate-fade-in">
    <div class="page-header">
      <h2>策略回测</h2>
      <p class="text-secondary">使用历史数据验证策略表现</p>
    </div>

    <!-- 回测配置 -->
    <div class="card-base">
      <div class="card-header"><h3>回测配置</h3></div>
      <div class="card-body">
        <el-form label-width="100px" label-position="left">
          <el-row :gutter="16">
            <el-col :xs="24" :md="8">
              <el-form-item label="选择策略">
                <el-select v-model="config.strategy" style="width: 100%">
                  <el-option label="大小单双" value="bigSmall" />
                  <el-option label="长龙捕手" value="longDragon" />
                  <el-option label="智能预测" value="aiPredict" />
                  <el-option label="组合投注" value="combo" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="8">
              <el-form-item label="时间范围">
                <el-date-picker v-model="config.dateRange" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="8">
              <el-form-item label="初始资金">
                <el-input-number v-model="config.capital" :min="100" :step="100" style="width: 100%">
                  <template #suffix>U</template>
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="8">
              <el-form-item label="基础注额">
                <el-input-number v-model="config.baseBet" :min="1" :step="5" style="width: 100%">
                  <template #suffix>U</template>
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="8">
              <el-form-item label="倍投模式">
                <el-select v-model="config.martingale" style="width: 100%">
                  <el-option label="不倍投" value="none" />
                  <el-option label="马丁格尔" value="martingale" />
                  <el-option label="斐波那契" value="fibonacci" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="8" style="display: flex; align-items: flex-end;">
              <el-button type="primary" size="large" style="width: 100%" :loading="loading" @click="runBacktest">
                <el-icon><CaretRight /></el-icon> 开始回测
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <!-- 回测结果 -->
    <template v-if="result">
      <!-- 概览 -->
      <el-row :gutter="16" class="stats-row">
        <el-col :xs="12" :sm="6" v-for="s in resultStats" :key="s.label">
          <div class="card-base stat-mini">
            <div class="stat-mini__label">{{ s.label }}</div>
            <div class="stat-mini__value" :style="{ color: s.color }">{{ s.value }}</div>
          </div>
        </el-col>
      </el-row>

      <!-- 资金曲线 -->
      <div class="card-base">
        <div class="card-header"><h3>资金曲线</h3></div>
        <v-chart :option="equityOption" autoresize style="height: 300px" />
      </div>

      <!-- 月度盈亏 -->
      <div class="card-base">
        <div class="card-header"><h3>月度盈亏</h3></div>
        <v-chart :option="monthlyOption" autoresize style="height: 280px" />
      </div>
    </template>

    <!-- 空状态 -->
    <div v-else-if="!loading" class="card-base empty-state">
      <el-icon :size="48" color="var(--color-text-3)"><Histogram /></el-icon>
      <p class="text-tertiary" style="margin-top: 16px;">配置回测参数后点击"开始回测"</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { CaretRight, Histogram } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent])

const config = ref({
  strategy: 'bigSmall',
  dateRange: [],
  capital: 5000,
  baseBet: 10,
  martingale: 'martingale',
})

const loading = ref(false)
const result = ref(false)

const resultStats = computed(() => [
  { label: '总收益率', value: '+26.7%', color: 'var(--color-success)' },
  { label: '最大回撤', value: '-8.3%', color: 'var(--color-danger)' },
  { label: '胜率', value: '62.5%', color: 'var(--color-brand)' },
  { label: '夏普比率', value: '1.85', color: 'var(--color-text)' },
])

const equityOption = computed(() => {
  const days = 90
  let val = 5000
  const data = Array.from({ length: days }, (_, i) => {
    val += (Math.random() - 0.4) * 200
    return { day: `D${i + 1}`, value: Math.round(val * 100) / 100 }
  })
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: data.map(d => d.day), axisLabel: { color: 'var(--color-text-3)', fontSize: 11 } },
    yAxis: { type: 'value', axisLabel: { color: 'var(--color-text-3)' }, splitLine: { lineStyle: { color: 'var(--color-divider)' } } },
    series: [{
      data: data.map(d => d.value),
      type: 'line', smooth: true, symbol: 'none',
      lineStyle: { color: '#3390ec', width: 2 },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(51,144,236,.25)' }, { offset: 1, color: 'rgba(51,144,236,0)' }] } }
    }]
  }
})

const monthlyOption = computed(() => {
  const months = ['1月','2月','3月','4月','5月','6月']
  const data = [320, -150, 580, 280, -80, 420]
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: months, axisLabel: { color: 'var(--color-text-3)' } },
    yAxis: { type: 'value', axisLabel: { color: 'var(--color-text-3)' }, splitLine: { lineStyle: { color: 'var(--color-divider)' } } },
    series: [{
      data: data.map(v => ({
        value: v,
        itemStyle: { color: v >= 0 ? '#15803d' : '#dc2626' }
      })),
      type: 'bar', barWidth: '40%'
    }]
  }
})

const runBacktest = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    result.value = true
    ElMessage.success('回测完成')
  }, 2000)
}
</script>

<style scoped>
.page-header { margin-bottom: 16px; }
.page-header h2 { font-size: 20px; font-weight: 600; margin-bottom: 4px; }
.page-header p { font-size: 13px; }

.card-header { padding: 16px 20px; border-bottom: 1px solid var(--color-divider); }
.card-header h3 { font-size: 15px; font-weight: 600; }
.card-body { padding: 20px; }

.stats-row { margin-bottom: 16px; }
.stat-mini { padding: 16px 20px; }
.stat-mini__label { font-size: 13px; color: var(--color-text-2); margin-bottom: 4px; }
.stat-mini__value { font-size: 22px; font-weight: 700; }

.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 60px 20px; text-align: center;
}

.backtest-page { display: flex; flex-direction: column; gap: 16px; }
</style>
