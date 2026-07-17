<template>
  <div class="accounts-page animate-fade-in">
    <div class="page-header">
      <div>
        <h2>账号绑定</h2>
        <p class="text-secondary">管理您的 Telegram 投注账号</p>
      </div>
      <el-button type="primary" @click="dialogVisible = true">
        <el-icon><Plus /></el-icon> 绑定新账号
      </el-button>
    </div>

    <div class="card-base">
      <el-table :data="accounts" stripe style="width: 100%">
        <el-table-column prop="username" label="Telegram 用户名" min-width="140">
          <template #default="{ row }">
            <div style="display: flex; align-items: center; gap: 8px;">
              <el-avatar :size="32" style="background: var(--color-brand)">{{ row.username[0] }}</el-avatar>
              <span>{{ row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="group" label="群组" min-width="120" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="todayBets" label="今日投注" width="100" align="right" />
        <el-table-column label="今日盈亏" width="120" align="right">
          <template #default="{ row }">
            <span :class="row.todayProfit >= 0 ? 'text-success' : 'text-danger'">
              {{ row.todayProfit >= 0 ? '+' : '' }}¥{{ row.todayProfit.toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="{ row }">
            <el-button text size="small" @click="ElMessage.info('编辑功能开发中')">编辑</el-button>
            <el-button text size="small" :type="row.status === '在线' ? 'warning' : 'success'">
              {{ row.status === '在线' ? '暂停' : '启用' }}
            </el-button>
            <el-button text size="small" type="danger" @click="ElMessage.warning('确认删除？')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="绑定新账号" width="440px">
      <el-form :model="form" label-width="80px" label-position="left">
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="+86 138 0000 0000" />
        </el-form-item>
        <el-form-item label="验证码">
          <div style="display: flex; gap: 8px; width: 100%;">
            <el-input v-model="form.code" placeholder="请输入验证码" />
            <el-button :disabled="countdown > 0" @click="sendCode">
              {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="群组">
          <el-select v-model="form.group" placeholder="选择 Telegram 群组" style="width: 100%">
            <el-option label="PC28 加拿大28" value="pc28_canada" />
            <el-option label="幸运28 官方群" value="lucky28_official" />
            <el-option label="极速28 高频群" value="speed28" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBind">确认绑定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)
const countdown = ref(0)
const form = ref({ phone: '', code: '', group: '' })

const accounts = ref([
  { username: 'Alice_28', phone: '+86 138****8888', group: 'PC28 加拿大28', status: '在线', todayBets: 128, todayProfit: 1860.50 },
  { username: 'Bob_Lucky', phone: '+86 139****6666', group: '幸运28 官方群', status: '在线', todayBets: 86, todayProfit: 920.00 },
  { username: 'Charlie_Bet', phone: '+86 137****2222', group: '极速28 高频群', status: '离线', todayBets: 0, todayProfit: 0 },
  { username: 'Delta_Hunter', phone: '+86 135****9999', group: 'PC28 加拿大28', status: '已封禁', todayBets: 0, todayProfit: -150.00 },
])

const statusType = (s) => s === '在线' ? 'success' : s === '离线' ? 'info' : 'danger'

const sendCode = () => {
  if (!form.value.phone) { ElMessage.warning('请输入手机号'); return }
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
  ElMessage.success('验证码已发送')
}

const handleBind = () => {
  if (!form.value.phone || !form.value.code || !form.value.group) {
    ElMessage.warning('请填写完整信息')
    return
  }
  accounts.value.unshift({
    username: 'NewUser_' + Date.now().toString().slice(-4),
    phone: form.value.phone,
    group: form.value.group,
    status: '在线',
    todayBets: 0,
    todayProfit: 0,
  })
  ElMessage.success('账号绑定成功')
  dialogVisible.value = false
  form.value = { phone: '', code: '', group: '' }
}
</script>

<style scoped>
.page-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.page-header h2 { font-size: 20px; font-weight: 600; margin-bottom: 4px; }
.page-header p { font-size: 13px; }
</style>
