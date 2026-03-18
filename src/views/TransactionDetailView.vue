<template>
  <div class="transaction-detail" v-if="transaction">
    <div class="page-header">
      <div>
        <router-link to="/transactions" class="back-link">← {{ t('common.back') }}</router-link>
        <h1 class="page-title">{{ t('transactions.transactionDetails') }} #{{ transaction.id }}</h1>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <h3 class="card-title mb-2">{{ t('transactions.transactionDetails') }}</h3>
        <div class="detail-row">
          <span class="detail-label">{{ t('transactions.property') }}</span>
          <router-link :to="`/inventory/${transaction.propertyId}`" class="detail-value text-accent">
            {{ property?.name }}
          </router-link>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('transactions.customer') }}</span>
          <router-link :to="`/customers/${transaction.customerId}`" class="detail-value text-accent">
            {{ customer?.name }}
          </router-link>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('transactions.salesPerson') }}</span>
          <span class="detail-value">{{ salesPerson?.name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('transactions.amount') }}</span>
          <span class="detail-value text-accent">${{ formatNumber(transaction.totalAmount) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('transactions.paid') }}</span>
          <span class="detail-value text-success">${{ formatNumber(transaction.paidAmount) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('transactions.remaining') }}</span>
          <span class="detail-value text-warning">${{ formatNumber(transaction.totalAmount - transaction.paidAmount) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('transactions.paymentStatus') }}</span>
          <span class="badge" :class="getStatusClass(transaction.paymentStatus)">
            {{ t(`transactions.${transaction.paymentStatus}`) }}
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('contracts.paymentTerms') }}</span>
          <span class="detail-value">{{ transaction.paymentTerms }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('inventory.createdAt') }}</span>
          <span class="detail-value">{{ transaction.createdAt }}</span>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title mb-2">{{ t('transactions.commissionBreakdown') }}</h3>
        <div class="commission-box">
          <div class="commission-item">
            <span>{{ t('transactions.salePrice') }}</span>
            <span>${{ formatNumber(transaction.totalAmount) }}</span>
          </div>
          <div class="commission-item">
            <span>{{ t('transactions.baseCommission') }}</span>
            <span>${{ formatNumber(transaction.totalAmount * 0.03) }}</span>
          </div>
          <div class="commission-divider"></div>
          <div class="commission-item total">
            <span>{{ t('transactions.totalCommission') }}</span>
            <span class="text-accent">${{ formatNumber(transaction.commission) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card mt-3">
      <h3 class="card-title mb-2">{{ t('transactions.paymentSchedule') }}</h3>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>{{ t('transactions.dueDate') }}</th>
              <th>{{ t('transactions.amount') }}</th>
              <th>{{ t('transactions.method') }}</th>
              <th>{{ t('common.status') }}</th>
              <th>{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(payment, index) in transaction.payments" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ payment.date }}</td>
              <td>${{ formatNumber(payment.amount) }}</td>
              <td>{{ payment.method }}</td>
              <td>
                <span class="badge" :class="payment.status === 'paid' ? 'badge-success' : 'badge-warning'">
                  {{ payment.status === 'paid' ? t('transactions.completed') : t('transactions.pending') }}
                </span>
              </td>
              <td>
                <button 
                  v-if="payment.status !== 'paid'" 
                  class="btn btn-sm btn-success"
                  @click="markPaid(index)"
                >
                  {{ t('transactions.markPaid') }}
                </button>
              </td>
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
import { useTransactionStore } from '@/stores/transaction'
import { usePropertyStore } from '@/stores/property'
import { useCustomerStore } from '@/stores/customer'
import { useEmployeeStore } from '@/stores/employee'

const { t } = useI18n()
const route = useRoute()
const transactionStore = useTransactionStore()
const propertyStore = usePropertyStore()
const customerStore = useCustomerStore()
const employeeStore = useEmployeeStore()

const transaction = computed(() => transactionStore.getTransactionById(route.params.id))
const property = computed(() => propertyStore.getPropertyById(transaction.value?.propertyId))
const customer = computed(() => customerStore.getCustomerById(transaction.value?.customerId))
const salesPerson = computed(() => employeeStore.getEmployeeById(transaction.value?.salesPersonId))

const formatNumber = (num) => num ? num.toLocaleString() : '0'

const getStatusClass = (status) => ({
  completed: 'badge-success',
  partial: 'badge-warning',
  pending: 'badge-warning'
})[status] || 'badge-info'

const markPaid = (index) => {
  transactionStore.markPaymentPaid(route.params.id, index)
}
</script>

<style scoped>
.back-link {
  font-size: 14px;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 8px;
}

.commission-box {
  background: var(--primary);
  border-radius: var(--radius-md);
  padding: 20px;
}

.commission-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: var(--text-secondary);
}

.commission-item.total {
  font-weight: 600;
  font-size: 18px;
  color: var(--text-primary);
}

.commission-divider {
  height: 1px;
  background: var(--border);
  margin: 12px 0;
}
</style>
