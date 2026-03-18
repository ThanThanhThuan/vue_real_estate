import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { transactions as mockTransactions } from '@/data/mockData'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([...mockTransactions])

  const pending = computed(() => transactions.value.filter(t => t.status === 'pending'))
  const completed = computed(() => transactions.value.filter(t => t.status === 'completed'))

  const totalRevenue = computed(() => 
    transactions.value
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.paidAmount, 0)
  )

  const totalCommission = computed(() =>
    transactions.value.reduce((sum, t) => sum + t.commission, 0)
  )

  function getTransactionById(id) {
    return transactions.value.find(t => t.id === parseInt(id))
  }

  function getTransactionsByProperty(propertyId) {
    return transactions.value.filter(t => t.propertyId === parseInt(propertyId))
  }

  function getTransactionsByCustomer(customerId) {
    return transactions.value.filter(t => t.customerId === parseInt(customerId))
  }

  function getTransactionsBySalesPerson(salesPersonId) {
    return transactions.value.filter(t => t.salesPersonId === parseInt(salesPersonId))
  }

  function calculateCommission(salePrice, salesPersonId, targetExceeded = false) {
    const baseCommission = salePrice * 0.03
    const bonus = targetExceeded ? salePrice * 0.01 : 0
    return baseCommission + bonus
  }

  function generatePaymentSchedule(totalAmount, terms, startDate) {
    const payments = []
    const date = new Date(startDate)
    
    let installments = 1
    let amountPerPayment = totalAmount
    
    switch (terms) {
      case 'Full Payment':
        installments = 1
        amountPerPayment = totalAmount
        break
      case '2 Installments':
        installments = 2
        amountPerPayment = totalAmount / 2
        break
      case '4 Installments':
        installments = 4
        amountPerPayment = totalAmount / 4
        break
      case '6 Installments':
        installments = 6
        amountPerPayment = totalAmount / 6
        break
      case '12 Installments':
        installments = 12
        amountPerPayment = totalAmount / 12
        break
    }

    for (let i = 0; i < installments; i++) {
      date.setMonth(date.getMonth() + 1)
      payments.push({
        date: date.toISOString().split('T')[0],
        amount: Math.round(amountPerPayment),
        method: 'Check',
        status: i === 0 ? 'paid' : 'pending'
      })
    }

    return payments
  }

  function addTransaction(transaction) {
    const newId = Math.max(...transactions.value.map(t => t.id)) + 1
    const commission = calculateCommission(
      transaction.totalAmount,
      transaction.salesPersonId
    )
    
    transactions.value.push({
      ...transaction,
      id: newId,
      commission,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending',
      paymentStatus: 'pending'
    })
    return newId
  }

  function updateTransaction(id, updates) {
    const index = transactions.value.findIndex(t => t.id === parseInt(id))
    if (index !== -1) {
      transactions.value[index] = { ...transactions.value[index], ...updates }
      return true
    }
    return false
  }

  function markPaymentPaid(transactionId, paymentIndex) {
    const transaction = getTransactionById(transactionId)
    if (transaction && transaction.payments[paymentIndex]) {
      transaction.payments[paymentIndex].status = 'paid'
      
      const paidAmount = transaction.payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0)
      
      transaction.paidAmount = paidAmount
      
      if (paidAmount >= transaction.totalAmount) {
        transaction.paymentStatus = 'completed'
        transaction.status = 'completed'
      }
      
      return true
    }
    return false
  }

  return {
    transactions,
    pending,
    completed,
    totalRevenue,
    totalCommission,
    getTransactionById,
    getTransactionsByProperty,
    getTransactionsByCustomer,
    getTransactionsBySalesPerson,
    calculateCommission,
    generatePaymentSchedule,
    addTransaction,
    updateTransaction,
    markPaymentPaid
  }
})
