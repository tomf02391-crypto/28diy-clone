<template>
  <div class="preferences-page animate-fade-in">
    <div class="page-header">
      <h2>偏好配置</h2>
      <p class="text-secondary">自定义您的投注控制台体验</p>
    </div>

    <el-row :gutter="16">
      <!-- 界面偏好 -->
      <el-col :xs="24" :lg="12">
        <div class="card-base fx-glow" @mousemove="onGlow">
          <div class="card-header"><h3><el-icon><Monitor /></el-icon> 界面偏好</h3></div>
          <div class="card-body">
            <el-form label-width="100px" label-position="left">
              <el-form-item label="主题模式">
                <el-radio-group v-model="pref.theme">
                  <el-radio-button value="light">亮色</el-radio-button>
                  <el-radio-button value="dark">暗色</el-radio-button>
                  <el-radio-button value="auto">跟随系统</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="语言">
                <el-select v-model="pref.lang" style="width: 120px">
                  <el-option label="中文" value="zh" />
                  <el-option label="English" value="en" />
                </el-select>
              </el-form-item>
              <el-form-item label="时区">
                <el-select v-model="pref.timezone" style="width: 200px">
                  <el-option label="(UTC+8) 北京" value="Asia/Shanghai" />
                  <el-option label="(UTC+0) 伦敦" value="Europe/London" />
                  <el-option label="(UTC-5) 纽约" value="America/New_York" />
                </el-select>
              </el-form-item>
              <el-form-item label="数字格式">
                <el-switch v-model="pref.thousands" active-text="千分位" inactive-text="原样" />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>

      <!-- 通知设置 -->
      <el-col :xs="24" :lg="12">
        <div class="card-base fx-glow" @mousemove="onGlow">
          <div class="card-header"><h3><el-icon><Bell /></el-icon> 通知设置</h3></div>
          <div class="card-body">
            <div class="switch-row" v-for="item in notifSettings" :key="item.label">
              <span>{{ item.label }}</span>
              <el-switch v-model="item.value" />
            </div>
          </div>
        </div>
      </el-col>

      <!-- 风控配置 -->
      <el-col :xs="24" :lg="12">
        <div class="card-base fx-glow" @mousemove="onGlow">
          <div class="card-header"><h3><el-icon><Aim /></el-icon> 风控配置</h3></div>
          <div class="card-body">
            <el-form label-width="120px" label-position="left">
              <el-form-item label="单笔最大投注">
                <el-input-number v-model="risk.maxPerBet" :min="1" :step="10" style="width: 100%">
                  <template #suffix>U</template>
                </el-input-number>
              </el-form-item>
              <el-form-item label="单日最大投注">
                <el-input-number v-model="risk.maxPerDay" :min="100" :step="100" style="width: 100%">
                  <template #suffix>U</template>
                </el-input-number>
              </el-form-item>
              <el-form-item label="单日最大亏损">
                <el-input-number v-model="risk.maxLoss" :min="0" :step="100" style="width: 100%">
                  <template #suffix>U</template>
                </el-input-number>
              </el-form-item>
              <el-form-item label="连续亏损停止">
                <el-input-number v-model="risk.maxLossStreak" :min="1" :max="20" style="width: 100%">
                  <template #suffix>次</template>
                </el-input-number>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>

      <!-- 开奖设置 -->
      <el-col :xs="24" :lg="12">
        <div class="card-base fx-glow" @mousemove="onGlow">
          <div class="card-header"><h3><el-icon><DataLine /></el-icon> 开奖设置</h3></div>
          <div class="card-body">
            <el-form label-width="120px" label-position="left">
              <el-form-item label="开奖来源">
                <el-select v-model="lottery.source" style="width: 100%">
                  <el-option label="PC28 官方" value="pc28" />
                  <el-option label="多源验证" value="multi" />
                </el-select>
              </el-form-item>
              <el-form-item label="开奖延迟">
                <el-input-number v-model="lottery.delay" :min="0" :max="60" :step="1" style="width: 100%">
                  <template #suffix>秒</template>
                </el-input-number>
              </el-form-item>
              <el-form-item label="自动对账">
                <el-switch v-model="lottery.autoReconcile" />
              </el-form-item>
              <el-form-item label="对账容差">
                <el-input-number v-model="lottery.tolerance" :min="0" :max="10" :step="0.1" style="width: 100%">
                  <template #suffix>U</template>
                </el-input-number>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="config-footer">
      <el-button type="primary" size="large" @click="ElMessage.success('所有配置已保存')">保存所有配置</el-button>
      <el-button size="large" @click="ElMessage.info('已恢复默认设置')">恢复默认</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Monitor, Bell, Aim, DataLine } from '@element-plus/icons-vue'

const onGlow = (e) => {
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--fx-x', `${e.clientX - rect.left}px`)
  el.style.setProperty('--fx-y', `${e.clientY - rect.top}px`)
}

const pref = ref({ theme: 'light', lang: 'zh', timezone: 'Asia/Shanghai', thousands: true })

const notifSettings = ref([
  { label: '开奖提醒', value: true },
  { label: '投注成功通知', value: true },
  { label: '盈亏日报', value: false },
  { label: '异常报警', value: true },
  { label: 'Telegram 推送', value: true },
])

const risk = ref({ maxPerBet: 50, maxPerDay: 1000, maxLoss: 300, maxLossStreak: 5 })
const lottery = ref({ source: 'multi', delay: 3, autoReconcile: true, tolerance: 0.5 })
</script>

<style scoped>
.page-header { margin-bottom: 16px; }
.page-header h2 { font-size: 20px; font-weight: 600; margin-bottom: 4px; }
.page-header p { font-size: 13px; }

.card-header { padding: 16px 20px; border-bottom: 1px solid var(--color-divider); }
.card-header h3 { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; }
.card-body { padding: 20px; }

.switch-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 0; border-bottom: 1px solid var(--color-divider);
}
.switch-row:last-child { border-bottom: none; }

.config-footer {
  display: flex; gap: 12px; justify-content: flex-end;
  margin-top: 16px;
}
</style>
