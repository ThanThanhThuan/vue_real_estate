<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon primary">
          <span>🏠</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('dashboard.totalProperties') }}</h4>
          <div class="stat-value">{{ propertyStore.totalProperties }}</div>
          <div class="stat-trend up">
            <span>{{ propertyStore.available.length }} {{ t('dashboard.available') }}</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon success">
          <span>👥</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('dashboard.totalCustomers') }}</h4>
          <div class="stat-value">{{ customerStore.totalCustomers }}</div>
          <div class="stat-trend up">
            <span>{{ customerStore.active.length }} {{ t('dashboard.active') }}</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon warning">
          <span>💰</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('dashboard.monthlyRevenue') }}</h4>
          <div class="stat-value">${{ formatNumber(monthlyRevenue) }}</div>
          <div class="stat-trend up">
            <span>+12% {{ t('dashboard.fromLastMonth') }}</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon info">
          <span>📋</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('dashboard.pendingTransactions') }}</h4>
          <div class="stat-value">{{ transactionStore.pending.length }}</div>
          <div class="stat-trend">
            <span>${{ formatNumber(pendingAmount) }} {{ t('dashboard.pending') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <h3 class="chart-title">{{ t('dashboard.monthlySales') }}</h3>
        <Bar :data="salesChartData" :options="chartOptions" />
      </div>

      <div class="chart-card">
        <h3 class="chart-title">{{ t('dashboard.propertiesByStatus') }}</h3>
        <Doughnut :data="statusChartData" :options="doughnutOptions" />
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('dashboard.topEmployees') }}</h3>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ t('common.name') }}</th>
                <th>{{ t('employees.sales') }}</th>
                <th>{{ t('employees.revenue') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="emp in topEmployees" :key="emp.id">
                <td>{{ emp.name }}</td>
                <td>{{ emp.salesCount }}</td>
                <td>${{ formatNumber(emp.totalRevenue) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('dashboard.recentTransactions') }}</h3>
        </div>
        <div class="recent-transactions">
          <div v-for="tx in recentTransactions" :key="tx.id" class="transaction-item">
            <div class="transaction-info">
              <span class="transaction-property">{{ getPropertyName(tx.propertyId) }}</span>
              <span class="transaction-customer">{{ getCustomerName(tx.customerId) }}</span>
            </div>
            <div class="transaction-amount">
              <span class="amount">${{ formatNumber(tx.totalAmount) }}</span>
              <span class="badge" :class="getStatusClass(tx.status)">
                {{ t(`transactions.${tx.status}`) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { usePropertyStore } from '@/stores/property'
import { useCustomerStore } from '@/stores/customer'
import { useTransactionStore } from '@/stores/transaction'
import { useEmployeeStore } from '@/stores/employee'
import { monthlySales } from '@/data/mockData'

const { t } = useI18n()

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const propertyStore = usePropertyStore()
const customerStore = useCustomerStore()
const transactionStore = useTransactionStore()
const employeeStore = useEmployeeStore()

const formatNumber = (num) => {
  return num ? num.toLocaleString() : '0'
}

const monthlyRevenue = computed(() => {
  return monthlySales[monthlySales.length - 1].revenue
})

const pendingAmount = computed(() => {
  return transactionStore.pending.reduce((sum, t) => sum + (t.totalAmount - t.paidAmount), 0)
})

const salesChartData = computed(() => ({
  labels: monthlySales.map(m => m.month),
  datasets: [
    {
      label: t('employees.sales'),
      data: monthlySales.map(m => m.sales),
      backgroundColor: 'rgba(233, 69, 96, 0.8)',
      borderRadius: 6
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.1)' },
      ticks: { color: '#a0a0b8' }
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.1)' },
      ticks: { color: '#a0a0b8' }
    }
  }
}

const statusChartData = computed(() => ({
  labels: [t('inventory.available'), t('inventory.reserved'), t('inventory.sold')],
  datasets: [{
    data: [
      propertyStore.available.length,
      propertyStore.reserved.length,
      propertyStore.sold.length
    ],
    backgroundColor: [
      'rgba(0, 217, 165, 0.8)',
      'rgba(255, 201, 60, 0.8)',
      'rgba(255, 107, 107, 0.8)'
    ],
    borderWidth: 0
  }]
}))

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#a0a0b8' }
    }
  }
}

const topEmployees = computed(() => {
  return [...employeeStore.employees]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5)
})

const recentTransactions = computed(() => {
  return [...transactionStore.transactions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

const getPropertyName = (id) => {
  const property = propertyStore.getPropertyById(id)
  return property?.name || 'Unknown'
}

const getCustomerName = (id) => {
  const customer = customerStore.getCustomerById(id)
  return customer?.name || 'Unknown'
}

const getStatusClass = (status) => {
  const classes = {
    completed: 'badge-success',
    pending: 'badge-warning'
  }
  return classes[status] || 'badge-info'
}
</script>

<style scoped>
.recent-transactions {
  display: flex;
  flex-direction: column;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.transaction-property {
  font-weight: 500;
}

.transaction-customer {
  font-size: 12px;
  color: var(--text-secondary);
}

.transaction-amount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.amount {
  font-weight: 600;
  color: var(--accent);
}
</style>
