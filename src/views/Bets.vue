<template>
  <div class="bets-page animate-fade-in">
    <div class="page-header">
      <h2>投注记录</h2>
      <p class="text-secondary">查看所有历史投注明细</p>
    </div>

    <!-- 筛选栏 -->
    <div class="card-base filter-bar">
      <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="default" style="width: 260px" />
      <el-select v-model="filter.strategy" placeholder="策略" style="width: 140px">
        <el-option label="全部策略" value="" />
        <el-option label="大小单双" value="大小单双" />
        <el-option label="长龙捕手" value="长龙捕手" />
        <el-option label="智能预测" value="智能预测" />
        <el-option label="组合投注" value="组合投注" />
      </el-select>
      <el-select v-model="filter.result" placeholder="结果" style="width: 120px">
        <el-option label="全部" value="" />
        <el-option label="赢" value="赢" />
        <el-option label="输" value="输" />
        <el-option label="待开奖" value="待开奖" />
      </el-select>
      <el-button type="primary" @click="ElMessage.success('查询完成')">查询</el-button>
      <el-button @click="ElMessage.info('导出中...')">导出</el-button>
    </div>

    <!-- 概览统计 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="6" v-for="s in summary" :key="s.label">
        <div class="card-base stat-mini">
          <div class="stat-mini__label">{{ s.label }}</div>
          <div class="stat-mini__value" :style="{ color: s.color }">{{ s.value }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 投注表格 -->
    <div class="card-base">
      <el-table :data="bets" stripe style="width: 100%">
        <el-table-column prop="time" label="时间" width="100" />
        <el-table-column prop="period" label="期号" width="120" />
        <el-table-column prop="account" label="账号" width="120" />
        <el-table-column prop="strategy" label="策略" width="100">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.strategy }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bet" label="投注内容" min-width="100" />
        <el-table-column prop="amount" label="金额" width="80" align="right">
          <template #default="{ row }">¥{{ row.amount }}</template>
        </el-table-column>
        <el-table-column prop="odds" label="赔率" width="80" align="center" />
        <el-table-column label="结果" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="resultType(row.result)" size="small">{{ row.result }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="盈亏" width="100" align="right">
          <template #default="{ row }">
            <span :class="profitClass(row.profit)">{{ profitText(row.profit) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <el-pagination background layout="prev, pager, next" :total="100" :page-size="10" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const dateRange = ref([])
const filter = ref({ strategy: '', result: '' })

const summary = [
  { label: '总投注数', value: '1,288', color: 'var(--color-text)' },
  { label: '总投注额', value: '¥12,880', color: 'var(--color-text)' },
  { label: '胜率', value: '58.3%', color: 'var(--color-brand)' },
  { label: '净盈亏', value: '+¥2,668.50', color: 'var(--color-success)' },
]

const bets = ref([
  { time: '14:32', period: '#3350030', account: 'Alice_28', strategy: '大小单双', bet: '大', amount: 10, odds: '1.97', result: '赢', profit: 9.7 },
  { time: '14:28', period: '#3350029', account: 'Bob_Lucky', strategy: '长龙捕手', bet: '小-连5', amount: 20, odds: '1.97', result: '赢', profit: 19.4 },
  { time: '14:22', period: '#3350028', account: 'Alice_28', strategy: '智能预测', bet: '单', amount: 15, odds: '1.97', result: '输', profit: -15 },
  { time: '14:15', period: '#3350027', account: 'Charlie_Bet', strategy: '组合投注', bet: '大+双', amount: 10, odds: '3.88', result: '赢', profit: 28.8 },
  { time: '14:08', period: '#3350026', account: 'Alice_28', strategy: '大小单双', bet: '小', amount: 10, odds: '1.97', result: '待开奖', profit: 0 },
  { time: '14:00', period: '#3350025', account: 'Bob_Lucky', strategy: '长龙捕手', bet: '大-连3', amount: 15, odds: '1.97', result: '输', profit: -15 },
  { time: '13:52', period: '#3350024', account: 'Alice_28', strategy: '大小单双', bet: '双', amount: 10, odds: '1.97', result: '赢', profit: 9.7 },
  { time: '13:45', period: '#3350023', account: 'Alice_28', strategy: '组合投注', bet: '小+单', amount: 12, odds: '3.88', result: '输', profit: -12 },
  { time: '13:38', period: '#3350022', account: 'Bob_Lucky', strategy: '智能预测', bet: '大', amount: 15, odds: '1.97', result: '赢', profit: 14.6 },
  { time: '13:30', period: '#3350021', account: 'Charlie_Bet', strategy: '大小单双', bet: '双', amount: 10, odds: '1.97', result: '输', profit: -10 },
])

const resultType = (r) => r === '赢' ? 'success' : r === '输' ? 'danger' : 'warning'
const profitClass = (p) => p > 0 ? 'text-success' : p < 0 ? 'text-danger' : 'text-secondary'
const profitText = (p) => p > 0 ? `+¥${p.toFixed(1)}` : p < 0 ? `-¥${Math.abs(p).toFixed(1)}` : '--'
</script>

<style scoped>
.page-header { margin-bottom: 16px; }
.page-header h2 { font-size: 20px; font-weight: 600; margin-bottom: 4px; }
.page-header p { font-size: 13px; }

.filter-bar { display: flex; gap: 12px; flex-wrap: wrap; padding: 16px; margin-bottom: 16px; }

.stats-row { margin-bottom: 16px; }
.stat-mini { padding: 16px 20px; }
.stat-mini__label { font-size: 13px; color: var(--color-text-2); margin-bottom: 4px; }
.stat-mini__value { font-size: 22px; font-weight: 700; }

.table-footer { padding: 16px; display: flex; justify-content: center; }
</style>
