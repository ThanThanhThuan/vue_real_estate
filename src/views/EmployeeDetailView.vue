<template>
  <div class="employee-detail" v-if="employee">
    <div class="page-header">
      <div>
        <router-link to="/employees" class="back-link">← {{ t('common.back') }}</router-link>
        <h1 class="page-title">{{ employee.name }}</h1>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon primary">
          <span>💼</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('employees.role') }}</h4>
          <div class="stat-value" style="text-transform: capitalize;">{{ t(`roles.${employee.role}`) }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon success">
          <span>🏠</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('employees.sales') }}</h4>
          <div class="stat-value">{{ employee.salesCount }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon warning">
          <span>💰</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('employees.revenue') }}</h4>
          <div class="stat-value">${{ formatNumber(employee.totalRevenue) }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon info">
          <span>💵</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('employees.commission') }}</h4>
          <div class="stat-value">${{ formatNumber(employee.commission) }}</div>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <h3 class="card-title mb-2">{{ t('employees.employeeInfo') }}</h3>
        <div class="detail-row">
          <span class="detail-label">{{ t('common.email') }}</span>
          <span class="detail-value">{{ employee.email }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('common.phone') }}</span>
          <span class="detail-value">{{ employee.phone }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('employees.role') }}</span>
          <span class="badge" :class="getRoleClass(employee.role)">{{ t(`roles.${employee.role}`) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('employees.status') }}</span>
          <span class="badge" :class="employee.status === 'active' ? 'badge-success' : 'badge-danger'">
            {{ t(`employees.${employee.status}`) }}
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('employees.hireDate') }}</span>
          <span class="detail-value">{{ employee.hireDate }}</span>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title mb-2">{{ t('employees.performanceSummary') }}</h3>
        <div class="detail-row">
          <span class="detail-label">{{ t('employees.sales') }}</span>
          <span class="detail-value">{{ employee.salesCount }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('employees.totalRevenue') }}</span>
          <span class="detail-value text-accent">${{ formatNumber(employee.totalRevenue) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('employees.commission') }}</span>
          <span class="detail-value text-success">${{ formatNumber(employee.commission) }}</span>
        </div>
      </div>
    </div>

    <div class="card mt-3" v-if="employeeTransactions.length">
      <h3 class="card-title mb-2">{{ t('inventory.transactionHistory') }}</h3>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>{{ t('transactions.property') }}</th>
              <th>{{ t('transactions.customer') }}</th>
              <th>{{ t('transactions.amount') }}</th>
              <th>{{ t('employees.commission') }}</th>
              <th>{{ t('common.status') }}</th>
              <th>{{ t('common.date') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in employeeTransactions" :key="tx.id">
              <td>{{ getPropertyName(tx.propertyId) }}</td>
              <td>{{ getCustomerName(tx.customerId) }}</td>
              <td>${{ formatNumber(tx.totalAmount) }}</td>
              <td>${{ formatNumber(tx.commission) }}</td>
              <td>
                <span class="badge" :class="tx.status === 'completed' ? 'badge-success' : 'badge-warning'">
                  {{ t(`transactions.${tx.status}`) }}
                </span>
              </td>
              <td>{{ tx.createdAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div v-else class="empty-state">
    <p>{{ t('common.noData') }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useEmployeeStore } from '@/stores/employee'
import { useTransactionStore } from '@/stores/transaction'
import { usePropertyStore } from '@/stores/property'
import { useCustomerStore } from '@/stores/customer'

const { t } = useI18n()
const route = useRoute()
const employeeStore = useEmployeeStore()
const transactionStore = useTransactionStore()
const propertyStore = usePropertyStore()
const customerStore = useCustomerStore()

const employee = computed(() => employeeStore.getEmployeeById(route.params.id))
const employeeTransactions = computed(() => transactionStore.getTransactionsBySalesPerson(route.params.id))

const formatNumber = (num) => num ? num.toLocaleString() : '0'

const getRoleClass = (role) => ({
  admin: 'badge-danger',
  management: 'badge-warning',
  sales: 'badge-success'
})[role] || 'badge-info'

const getPropertyName = (id) => propertyStore.getPropertyById(id)?.name || 'Unknown'
const getCustomerName = (id) => customerStore.getCustomerById(id)?.name || 'Unknown'
</script>

<style scoped>
.back-link {
  font-size: 14px;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 8px;
}
</style>
