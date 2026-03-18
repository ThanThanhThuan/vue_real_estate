<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <span class="logo-icon">🏠</span>
            <span class="logo-text">RealEstate Pro</span>
          </div>
          <h1>{{ t('auth.welcome') }}</h1>
          <p>{{ t('auth.signInDesc') }}</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label class="form-label">{{ t('auth.username') }}</label>
            <input 
              type="text" 
              v-model="username"
              class="form-input" 
              :placeholder="t('auth.username')"
              required
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">{{ t('auth.password') }}</label>
            <input 
              type="password" 
              v-model="password"
              class="form-input" 
              :placeholder="t('auth.password')"
              required
            >
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button type="submit" class="btn btn-primary login-btn" :disabled="loading">
            {{ loading ? t('auth.signingIn') : t('auth.signIn') }}
          </button>
        </form>

        <div class="demo-accounts">
          <p class="demo-title">{{ t('auth.demoAccounts') }}</p>
          <div class="demo-list">
            <div class="demo-item">
              <span class="demo-role">{{ t('roles.admin') }}</span>
              <span class="demo-creds">admin / admin123</span>
            </div>
            <div class="demo-item">
              <span class="demo-role">{{ t('roles.management') }}</span>
              <span class="demo-creds">manager / manager123</span>
            </div>
            <div class="demo-item">
              <span class="demo-role">{{ t('roles.sales') }}</span>
              <span class="demo-creds">sales / sales123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  await new Promise(resolve => setTimeout(resolve, 500))

  const result = authStore.login(username.value, password.value)
  
  if (result.success) {
    router.push('/')
  } else {
    error.value = t('auth.invalidCredentials')
  }
  
  loading.value = false
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--background) 0%, var(--primary) 100%);
  padding: 20px;
}

.login-card {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 48px;
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.logo-icon {
  font-size: 32px;
}

.logo-text {
  font-family: 'Outfit', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.login-header h1 {
  font-size: 28px;
  margin-bottom: 8px;
}

.login-header p {
  color: var(--text-secondary);
}

.login-form {
  margin-bottom: 24px;
}

.login-btn {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  margin-top: 8px;
}

.error-message {
  background: rgba(255, 107, 107, 0.15);
  color: var(--danger);
  padding: 12px;
  border-radius: var(--radius-sm);
  margin-bottom: 16px;
  font-size: 14px;
}

.demo-accounts {
  border-top: 1px solid var(--border);
  padding-top: 24px;
}

.demo-title {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.demo-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--primary);
  border-radius: var(--radius-sm);
  font-size: 12px;
}

.demo-role {
  font-weight: 600;
  color: var(--accent);
}

.demo-creds {
  color: var(--text-secondary);
  font-family: monospace;
}
</style>
