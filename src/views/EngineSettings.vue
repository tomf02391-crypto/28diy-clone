<template>
  <div class="engine-page animate-fade-in">
    <div class="page-header">
      <h2>投注策略</h2>
      <p class="text-secondary">配置自动投注引擎的核心参数</p>
    </div>

    <el-tabs v-model="activeTab" class="card-base" style="padding: 4px 20px 20px">
      <el-tab-pane v-for="tab in tabs" :key="tab.key" :label="tab.label" :name="tab.key">
        <div class="strategy-config">
          <!-- 状态开关 -->
          <div class="status-bar">
            <div class="status-bar__left">
              <span class="status-bar__label">策略状态</span>
              <el-tag :type="tab.enabled ? 'success' : 'info'" effect="dark" size="small">
                {{ tab.enabled ? '运行中' : '已停止' }}
              </el-tag>
            </div>
            <el-switch v-model="tab.enabled" active-text="启用" inactive-text="停用" />
          </div>

          <!-- 投注参数 -->
          <el-form :model="tab.config" label-width="120px" label-position="left" class="config-form">
            <el-row :gutter="16">
              <el-col :xs="24" :md="12">
                <el-form-item label="投注方向">
                  <el-radio-group v-model="tab.config.direction">
                    <el-radio-button v-for="d in ['大','小','单','双']" :key="d" :value="d">{{ d }}</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="基础注额">
                  <el-input-number v-model="tab.config.baseAmount" :min="1" :step="5" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :xs="24" :md="12">
                <el-form-item label="倍投模式">
                  <el-select v-model="tab.config.martingale" style="width: 100%">
                    <el-option label="不倍投" value="none" />
                    <el-option label="马丁格尔" value="martingale" />
                    <el-option label="斐波那契" value="fibonacci" />
                    <el-option label="自定义" value="custom" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="倍投倍数">
                  <el-input-number v-model="tab.config.multiplier" :min="1" :max="10" :step="0.5" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :xs="24" :md="12">
                <el-form-item label="止盈金额">
                  <el-input-number v-model="tab.config.takeProfit" :min="0" :step="100" style="width: 100%">
                    <template #suffix>U</template>
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="止损金额">
                  <el-input-number v-model="tab.config.stopLoss" :min="0" :step="100" style="width: 100%">
                    <template #suffix>U</template>
                  </el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :xs="24" :md="12">
                <el-form-item label="最大倍投次数">
                  <el-input-number v-model="tab.config.maxRounds" :min="1" :max="20" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="连续投注期数">
                  <el-input-number v-model="tab.config.continuousPeriods" :min="1" :max="50" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <!-- 高级参数 -->
          <el-collapse>
            <el-collapse-item title="高级参数" name="advanced">
              <el-row :gutter="16">
                <el-col :xs="24" :md="12">
                  <el-form-item label="冷热号分析周期">
                    <el-input-number v-model="tab.config.hotColdPeriods" :min="10" :max="200" :step="10" style="width: 100%" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :md="12">
                  <el-form-item label="投注间隔(ms)">
                    <el-input-number v-model="tab.config.betDelay" :min="0" :max="5000" :step="100" style="width: 100%" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="16">
                <el-col :xs="24" :md="12">
                  <el-form-item label="风控阈值(%)">
                    <el-input-number v-model="tab.config.riskThreshold" :min="0" :max="100" :step="5" style="width: 100%" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :md="12">
                  <el-form-item label="开奖号码过滤">
                    <el-select v-model="tab.config.numberFilter" style="width: 100%">
                      <el-option label="不过滤" value="none" />
                      <el-option label="排除连号" value="no-consecutive" />
                      <el-option label="仅热号" value="hot-only" />
                      <el-option label="仅冷号" value="cold-only" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>

          <!-- 底部操作 -->
          <div class="config-actions">
            <el-button type="primary" @click="ElMessage.success('配置已保存')">保存配置</el-button>
            <el-button @click="resetConfig(tab)">重置</el-button>
            <el-button text type="primary">查看策略说明</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('bigSmall')

const defaultConfig = () => ({
  direction: '大',
  baseAmount: 10,
  martingale: 'martingale',
  multiplier: 2,
  takeProfit: 500,
  stopLoss: 300,
  maxRounds: 5,
  continuousPeriods: 10,
  hotColdPeriods: 50,
  betDelay: 200,
  riskThreshold: 30,
  numberFilter: 'none',
})

const tabs = ref([
  { key: 'bigSmall', label: '大小单双', enabled: true, config: defaultConfig() },
  { key: 'longDragon', label: '长龙捕手', enabled: true, config: defaultConfig() },
  { key: 'aiPredict', label: '智能预测', enabled: true, config: defaultConfig() },
  { key: 'algorithm', label: '算法大厅', enabled: false, config: defaultConfig() },
  { key: 'hedge', label: '对冲套利', enabled: false, config: defaultConfig() },
  { key: 'combo', label: '组合投注', enabled: true, config: defaultConfig() },
])

const resetConfig = (tab) => {
  tab.config = defaultConfig()
  ElMessage.info('配置已重置')
}
</script>

<style scoped>
.page-header { margin-bottom: 16px; }
.page-header h2 { font-size: 20px; font-weight: 600; margin-bottom: 4px; }
.page-header p { font-size: 13px; }

.status-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; margin-bottom: 20px;
  background: var(--color-bg-3); border-radius: var(--radius);
}
.status-bar__left { display: flex; align-items: center; gap: 12px; }
.status-bar__label { font-size: 14px; font-weight: 500; }

.config-form { margin-bottom: 8px; }

.config-actions {
  display: flex; align-items: center; gap: 12px;
  padding-top: 16px; border-top: 1px solid var(--color-divider);
}
</style>
