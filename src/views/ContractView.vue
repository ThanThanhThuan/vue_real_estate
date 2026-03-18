<template>
  <div class="contract-page">
    <div class="page-header">
      <h1 class="page-title">{{ t('contracts.title') }}</h1>
    </div>

    <div class="grid-2">
      <div class="card">
        <h3 class="card-title mb-2">{{ t('transactions.transactionDetails') }}</h3>
        
        <div class="form-group">
          <label class="form-label">{{ t('contracts.selectProperty') }}</label>
          <select v-model="contractData.propertyId" class="form-input" @change="updatePropertyDetails">
            <option value="">{{ t('contracts.selectProperty') }}...</option>
            <option v-for="prop in availableProperties" :key="prop.id" :value="prop.id">
              {{ prop.name }} - ${{ formatNumber(prop.price) }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('contracts.selectCustomer') }}</label>
          <select v-model="contractData.customerId" class="form-input" @change="updateCustomerDetails">
            <option value="">{{ t('contracts.selectCustomer') }}...</option>
            <option v-for="cust in customerStore.customers" :key="cust.id" :value="cust.id">
              {{ cust.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('contracts.paymentTerms') }}</label>
          <select v-model="contractData.paymentTerms" class="form-input">
            <option value="Full Payment">{{ t('contracts.fullPayment') }}</option>
            <option value="2 Installments">2 {{ t('contracts.installments') }}</option>
            <option value="4 Installments">4 {{ t('contracts.installments') }}</option>
            <option value="6 Installments">6 {{ t('contracts.installments') }}</option>
            <option value="12 Installments">12 {{ t('contracts.installments') }}</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('contracts.contractDate') }}</label>
          <input type="date" v-model="contractData.contractDate" class="form-input">
        </div>

        <button class="btn btn-primary" @click="previewContract" :disabled="!canGenerate">
          {{ t('contracts.previewContract') }}
        </button>
      </div>

      <div class="card" v-if="contractData.propertyId && contractData.customerId">
        <h3 class="card-title mb-2">{{ t('contracts.summary') }}</h3>
        
        <div class="detail-row">
          <span class="detail-label">{{ t('transactions.property') }}</span>
          <span class="detail-value">{{ selectedProperty?.name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('common.address') }}</span>
          <span class="detail-value">{{ selectedProperty?.address }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('contracts.buyer') }}</span>
          <span class="detail-value">{{ selectedCustomer?.name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('contracts.buyerContact') }}</span>
          <span class="detail-value">{{ selectedCustomer?.email }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('contracts.purchasePrice') }}</span>
          <span class="detail-value text-accent">${{ formatNumber(selectedProperty?.price || 0) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('contracts.paymentTerms') }}</span>
          <span class="detail-value">{{ contractData.paymentTerms }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('employees.commission') }} (3%)</span>
          <span class="detail-value">${{ formatNumber(commission) }}</span>
        </div>
      </div>
    </div>

    <!-- Contract Preview -->
    <div v-if="showPreview" class="card mt-3">
      <div class="flex-between mb-3">
        <h3 class="card-title">Contract Preview</h3>
        <button class="btn btn-primary" @click="exportPDF">Export PDF</button>
      </div>

      <div class="contract-preview" ref="contractRef">
        <div class="contract-header">
          <h2>REAL ESTATE PURCHASE AGREEMENT</h2>
          <p>Contract No: {{ contractData.contractNumber }}</p>
        </div>

        <div class="contract-section">
          <h4>1. PARTIES</h4>
          <p>This Agreement is entered into between <strong>RealEstate Pro Inc.</strong> ("Seller") and <strong>{{ selectedCustomer?.name }}</strong> ("Buyer").</p>
        </div>

        <div class="contract-section">
          <h4>2. PROPERTY</h4>
          <p>The Seller agrees to sell and the Buyer agrees to purchase the following property:</p>
          <div class="property-details-box">
            <p><strong>Property Name:</strong> {{ selectedProperty?.name }}</p>
            <p><strong>Address:</strong> {{ selectedProperty?.address }}</p>
            <p><strong>Type:</strong> {{ selectedProperty?.type }}</p>
            <p><strong>Size:</strong> {{ selectedProperty?.size }} m²</p>
          </div>
        </div>

        <div class="contract-section">
          <h4>3. PURCHASE PRICE</h4>
          <p>The total purchase price for the property shall be: <strong>${{ formatNumber(selectedProperty?.price || 0) }}</strong></p>
        </div>

        <div class="contract-section">
          <h4>4. PAYMENT TERMS</h4>
          <p>Payment shall be made according to the following terms: <strong>{{ contractData.paymentTerms }}</strong></p>
          <table class="payment-table">
            <tr>
              <th>Installment</th>
              <th>Amount</th>
              <th>Due Date</th>
            </tr>
            <tr v-for="(payment, index) in paymentSchedule" :key="index">
              <td>{{ index + 1 }}</td>
              <td>${{ formatNumber(payment.amount) }}</td>
              <td>{{ payment.date }}</td>
            </tr>
          </table>
        </div>

        <div class="contract-section">
          <h4>5. COMMISSION</h4>
          <p>The Seller shall pay a commission of <strong>${{ formatNumber(commission) }}</strong> (3% of purchase price) to the sales agent.</p>
        </div>

        <div class="contract-section">
          <h4>6. SIGNATURES</h4>
          <div class="signatures">
            <div class="signature-box">
              <p class="signature-line">_________________________</p>
              <p>Seller Signature</p>
              <p>RealEstate Pro Inc.</p>
            </div>
            <div class="signature-box">
              <p class="signature-line">_________________________</p>
              <p>Buyer Signature</p>
              <p>{{ selectedCustomer?.name }}</p>
            </div>
          </div>
        </div>

        <div class="contract-footer">
          <p>Date: {{ contractData.contractDate }}</p>
          <p>This document was generated by RealEstate Pro Management System</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { jsPDF } from 'jspdf'
import { usePropertyStore } from '@/stores/property'
import { useCustomerStore } from '@/stores/customer'
import { useTransactionStore } from '@/stores/transaction'

const { t } = useI18n()
const propertyStore = usePropertyStore()
const customerStore = useCustomerStore()
const transactionStore = useTransactionStore()

const contractData = ref({
  propertyId: '',
  customerId: '',
  paymentTerms: 'Full Payment',
  contractDate: new Date().toISOString().split('T')[0],
  contractNumber: `CON-${Date.now()}`
})

const showPreview = ref(false)

const availableProperties = computed(() => {
  return propertyStore.properties.filter(p => p.status === 'sold' || p.status === 'reserved')
})

const selectedProperty = computed(() => {
  return propertyStore.getPropertyById(contractData.value.propertyId)
})

const selectedCustomer = computed(() => {
  return customerStore.getCustomerById(contractData.value.customerId)
})

const commission = computed(() => {
  return Math.round((selectedProperty.value?.price || 0) * 0.03)
})

const paymentSchedule = computed(() => {
  return transactionStore.generatePaymentSchedule(
    selectedProperty.value?.price || 0,
    contractData.value.paymentTerms,
    contractData.value.contractDate
  )
})

const canGenerate = computed(() => {
  return contractData.value.propertyId && contractData.value.customerId
})

const formatNumber = (num) => num?.toLocaleString() || '0'

const updatePropertyDetails = () => {
  showPreview.value = false
}

const updateCustomerDetails = () => {
  showPreview.value = false
}

const previewContract = () => {
  showPreview.value = true
}

const exportPDF = () => {
  const doc = new jsPDF()
  const lineHeight = 10
  let y = 20

  doc.setFontSize(18)
  doc.text('REAL ESTATE PURCHASE AGREEMENT', 105, y, { align: 'center' })
  y += lineHeight * 2

  doc.setFontSize(12)
  doc.text(`Contract No: ${contractData.value.contractNumber}`, 20, y)
  y += lineHeight * 2

  doc.setFontSize(14)
  doc.text('1. PARTIES', 20, y)
  y += lineHeight
  doc.setFontSize(11)
  doc.text(`This Agreement is entered between RealEstate Pro Inc. ("Seller") and ${selectedCustomer.value?.name} ("Buyer").`, 20, y, { maxWidth: 170 })
  y += lineHeight * 2

  doc.setFontSize(14)
  doc.text('2. PROPERTY', 20, y)
  y += lineHeight
  doc.setFontSize(11)
  doc.text(`Property: ${selectedProperty.value?.name}`, 20, y)
  y += lineHeight
  doc.text(`Address: ${selectedProperty.value?.address}`, 20, y)
  y += lineHeight
  doc.text(`Type: ${selectedProperty.value?.type} | Size: ${selectedProperty.value?.size} m²`, 20, y)
  y += lineHeight * 2

  doc.setFontSize(14)
  doc.text('3. PURCHASE PRICE', 20, y)
  y += lineHeight
  doc.setFontSize(11)
  doc.text(`Total: $${formatNumber(selectedProperty.value?.price)}`, 20, y)
  y += lineHeight * 2

  doc.setFontSize(14)
  doc.text('4. PAYMENT TERMS', 20, y)
  y += lineHeight
  doc.setFontSize(11)
  doc.text(`Terms: ${contractData.value.paymentTerms}`, 20, y)
  y += lineHeight * 2

  doc.setFontSize(14)
  doc.text('5. COMMISSION', 20, y)
  y += lineHeight
  doc.setFontSize(11)
  doc.text(`Commission: $${formatNumber(commission.value)} (3%)`, 20, y)
  y += lineHeight * 2

  doc.setFontSize(14)
  doc.text('6. SIGNATURES', 20, y)
  y += lineHeight * 2
  
  doc.line(20, y, 80, y)
  doc.text('Seller', 20, y + 8)
  doc.line(110, y, 170, y)
  doc.text('Buyer', 110, y + 8)

  y += lineHeight * 3
  doc.setFontSize(10)
  doc.text(`Date: ${contractData.value.contractDate}`, 20, y)

  doc.save(`contract-${contractData.value.contractNumber}.pdf`)
}
</script>

<style scoped>
.contract-preview {
  background: white;
  color: #333;
  padding: 40px;
  border-radius: var(--radius-md);
  max-height: 600px;
  overflow-y: auto;
}

.contract-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #333;
}

.contract-header h2 {
  font-size: 24px;
  margin-bottom: 8px;
}

.contract-section {
  margin-bottom: 24px;
}

.contract-section h4 {
  font-size: 14px;
  margin-bottom: 8px;
  color: #333;
}

.contract-section p {
  font-size: 12px;
  line-height: 1.6;
}

.property-details-box {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  margin-top: 8px;
}

.property-details-box p {
  margin: 4px 0;
}

.payment-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

.payment-table th,
.payment-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  font-size: 11px;
}

.payment-table th {
  background: #f5f5f5;
}

.signatures {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 20px;
}

.signature-box {
  text-align: center;
}

.signature-line {
  border-bottom: 1px solid #333;
  margin-bottom: 8px;
  padding-bottom: 4px;
}

.contract-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
  text-align: center;
  font-size: 10px;
  color: #666;
}
</style>
