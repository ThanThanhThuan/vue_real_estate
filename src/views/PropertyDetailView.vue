<template>
  <div class="property-detail" v-if="property">
    <div class="page-header">
      <div>
        <router-link to="/inventory" class="back-link">← {{ t('common.back') }}</router-link>
        <h1 class="page-title">{{ property.name }}</h1>
      </div>
      <div class="action-buttons">
        <button class="btn btn-secondary" @click="showEditModal = true">{{ t('common.edit') }}</button>
        <button class="btn btn-danger" @click="deleteProperty">{{ t('common.delete') }}</button>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="property-image-large">
          <span>{{ getPropertyIcon(property.type) }}</span>
        </div>
        
        <div class="property-info mt-3">
          <div class="detail-row">
            <span class="detail-label">{{ t('common.code') }}</span>
            <span class="detail-value">{{ property.code }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{ t('common.status') }}</span>
            <span class="badge" :class="getStatusClass(property.status)">
              {{ t(`inventory.${property.status}`) }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{ t('inventory.type') }}</span>
            <span class="detail-value">{{ property.type }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{ t('inventory.price') }}</span>
            <span class="detail-value text-accent">${{ formatNumber(property.price) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{ t('inventory.size') }}</span>
            <span class="detail-value">{{ property.size }} m²</span>
          </div>
          <div v-if="property.bedrooms" class="detail-row">
            <span class="detail-label">{{ t('inventory.bedrooms') }}</span>
            <span class="detail-value">{{ property.bedrooms }}</span>
          </div>
          <div v-if="property.bathrooms" class="detail-row">
            <span class="detail-label">{{ t('inventory.bathrooms') }}</span>
            <span class="detail-value">{{ property.bathrooms }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title mb-2">{{ t('common.address') }} & {{ t('inventory.propertyDetails') }}</h3>
        <div class="detail-row">
          <span class="detail-label">{{ t('common.address') }}</span>
          <span class="detail-value">{{ property.address }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('inventory.assignedTo') }}</span>
          <span class="detail-value">{{ assignedTo?.name || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('inventory.createdAt') }}</span>
          <span class="detail-value">{{ property.createdAt }}</span>
        </div>
        <div v-if="property.reservedAt" class="detail-row">
          <span class="detail-label">{{ t('inventory.reservedAt') }}</span>
          <span class="detail-value">{{ property.reservedAt }}</span>
        </div>
        <div v-if="property.soldAt" class="detail-row">
          <span class="detail-label">{{ t('inventory.soldAt') }}</span>
          <span class="detail-value">{{ property.soldAt }}</span>
        </div>
        
        <div v-if="property.description" class="mt-3">
          <h4 class="mb-1">{{ t('inventory.description') }}</h4>
          <p class="text-muted">{{ property.description }}</p>
        </div>

        <div v-if="property.features?.length" class="mt-3">
          <h4 class="mb-1">{{ t('inventory.features') }}</h4>
          <div class="features-list">
            <span v-for="feature in property.features" :key="feature" class="badge badge-info">
              {{ feature }}
            </span>
          </div>
        </div>

        <div v-if="property.status === 'available'" class="mt-3">
          <button class="btn btn-primary" @click="showStatusModal = true">
            {{ t('inventory.updateStatus') }}
          </button>
        </div>
      </div>
    </div>

    <div class="card mt-3" v-if="propertyTransactions.length">
      <h3 class="card-title mb-2">{{ t('inventory.transactionHistory') }}</h3>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>{{ t('transactions.customer') }}</th>
              <th>{{ t('transactions.amount') }}</th>
              <th>{{ t('common.status') }}</th>
              <th>{{ t('common.date') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in propertyTransactions" :key="tx.id">
              <td>#{{ tx.id }}</td>
              <td>{{ getCustomerName(tx.customerId) }}</td>
              <td>${{ formatNumber(tx.totalAmount) }}</td>
              <td>
                <span class="badge" :class="getTransactionStatusClass(tx.status)">
                  {{ t(`transactions.${tx.status}`) }}
                </span>
              </td>
              <td>{{ tx.createdAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Status Update Modal -->
    <div v-if="showStatusModal" class="modal-overlay" @click.self="showStatusModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ t('inventory.updateStatus') }}</h3>
          <button class="modal-close" @click="showStatusModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">{{ t('common.status') }}</label>
            <select v-model="newStatus" class="form-input">
              <option value="available">{{ t('inventory.available') }}</option>
              <option value="reserved">{{ t('inventory.reserved') }}</option>
              <option value="sold">{{ t('inventory.sold') }}</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showStatusModal = false">{{ t('common.cancel') }}</button>
          <button class="btn btn-primary" @click="updateStatus">{{ t('common.update') }}</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="empty-state">
    <p>{{ t('common.noData') }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/property'
import { useCustomerStore } from '@/stores/customer'
import { useTransactionStore } from '@/stores/transaction'
import { useEmployeeStore } from '@/stores/employee'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const propertyStore = usePropertyStore()
const customerStore = useCustomerStore()
const transactionStore = useTransactionStore()
const employeeStore = useEmployeeStore()

const showStatusModal = ref(false)
const showEditModal = ref(false)
const newStatus = ref('available')

const property = computed(() => propertyStore.getPropertyById(route.params.id))
const assignedTo = computed(() => employeeStore.getEmployeeById(property.value?.assignedTo))
const propertyTransactions = computed(() => transactionStore.getTransactionsByProperty(route.params.id))

const formatNumber = (num) => num ? num.toLocaleString() : '0'

const getPropertyIcon = (type) => {
  const icons = { Apartment: '🏢', House: '🏡', Villa: '🏰', Commercial: '🏬', Land: '🌳' }
  return icons[type] || '🏠'
}

const getStatusClass = (status) => ({
  available: 'badge-success',
  reserved: 'badge-warning',
  sold: 'badge-danger'
})[status] || 'badge-info'

const getTransactionStatusClass = (status) => ({
  completed: 'badge-success',
  pending: 'badge-warning'
})[status] || 'badge-info'

const getCustomerName = (id) => customerStore.getCustomerById(id)?.name || 'Unknown'

const updateStatus = () => {
  if (property.value) {
    propertyStore.updateStatus(property.value.id, newStatus.value)
    showStatusModal.value = false
  }
}

const deleteProperty = () => {
  if (confirm(t('inventory.deleteConfirm'))) {
    propertyStore.deleteProperty(route.params.id)
    router.push('/inventory')
  }
}
</script>

<style scoped>
.back-link {
  font-size: 14px;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 8px;
}

.property-image-large {
  height: 200px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  color: var(--text-secondary);
}

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
