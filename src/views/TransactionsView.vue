<template>
  <div class="transactions-page">
    <div class="page-header">
      <h1 class="page-title">{{ t('transactions.title') }}</h1>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon success">
          <span>💵</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('transactions.totalRevenue') }}</h4>
          <div class="stat-value">${{ formatNumber(transactionStore.totalRevenue) }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon warning">
          <span>⏳</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('transactions.pendingAmount') }}</h4>
          <div class="stat-value">${{ formatNumber(pendingAmount) }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon primary">
          <span>💰</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('transactions.totalCommission') }}</h4>
          <div class="stat-value">${{ formatNumber(transactionStore.totalCommission) }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon info">
          <span>📋</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('transactions.totalTransactions') }}</h4>
          <div class="stat-value">{{ transactionStore.transactions.length }}</div>
        </div>
      </div>
    </div>

    <div class="filters">
      <select v-model="statusFilter" class="filter-select">
        <option value="">{{ t('transactions.allStatus') }}</option>
        <option value="pending">{{ t('transactions.pending') }}</option>
        <option value="completed">{{ t('transactions.completed') }}</option>
      </select>
    </div>

    <div class="card">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>{{ t('transactions.property') }}</th>
              <th>{{ t('transactions.customer') }}</th>
              <th>{{ t('transactions.salesPerson') }}</th>
              <th>{{ t('transactions.amount') }}</th>
              <th>{{ t('transactions.paid') }}</th>
              <th>{{ t('employees.commission') }}</th>
              <th>{{ t('common.status') }}</th>
              <th>{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in filteredTransactions" :key="tx.id">
              <td>#{{ tx.id }}</td>
              <td>{{ getPropertyName(tx.propertyId) }}</td>
              <td>{{ getCustomerName(tx.customerId) }}</td>
              <td>{{ getEmployeeName(tx.salesPersonId) }}</td>
              <td>${{ formatNumber(tx.totalAmount) }}</td>
              <td>${{ formatNumber(tx.paidAmount) }}</td>
              <td>${{ formatNumber(tx.commission) }}</td>
              <td>
                <span class="badge" :class="getStatusClass(tx.status)">
                  {{ t(`transactions.${tx.status}`) }}
                </span>
              </td>
              <td>
                <router-link :to="`/transactions/${tx.id}`" class="action-btn">
                  {{ t('common.view') }}
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredTransactions.length === 0" class="empty-state">
        <p>{{ t('common.noData') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTransactionStore } from '@/stores/transaction'
import { usePropertyStore } from '@/stores/property'
import { useCustomerStore } from '@/stores/customer'
import { useEmployeeStore } from '@/stores/employee'

const { t } = useI18n()
const transactionStore = useTransactionStore()
const propertyStore = usePropertyStore()
const customerStore = useCustomerStore()
const employeeStore = useEmployeeStore()

const statusFilter = ref('')

const pendingAmount = computed(() => {
  return transactionStore.pending.reduce((sum, t) => sum + (t.totalAmount - t.paidAmount), 0)
})

const filteredTransactions = computed(() => {
  let result = [...transactionStore.transactions]
  if (statusFilter.value) {
    result = result.filter(t => t.status === statusFilter.value)
  }
  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const formatNumber = (num) => num ? num.toLocaleString() : '0'

const getPropertyName = (id) => propertyStore.getPropertyById(id)?.name || 'Unknown'
const getCustomerName = (id) => customerStore.getCustomerById(id)?.name || 'Unknown'
const getEmployeeName = (id) => employeeStore.getEmployeeById(id)?.name || 'Unknown'

const getStatusClass = (status) => ({
  completed: 'badge-success',
  pending: 'badge-warning'
})[status] || 'badge-info'
</script>
