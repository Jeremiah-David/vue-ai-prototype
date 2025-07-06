<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">AI Alpha Prototype</h1>
        <p class="text-gray-600 mt-2">Restricted Access - Coworkers Only</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Access Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter access password"
            :class="{ 'border-red-500': error }"
          />
        </div>
        
        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Authenticating...' : 'Access Demo' }}
        </button>
      </form>
      
      <div class="mt-6 text-center text-sm text-gray-500">
        <p>🔒 This is a restricted prototype</p>
        <p>Contact Jeremiah for access</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['authenticated'])

const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  // Simulate slight delay for UX
  await new Promise(resolve => setTimeout(resolve, 500))
  
  try {
    const { AccessControl } = await import('../services/accessControl.js')
    const accessControl = new AccessControl()
    
    if (accessControl.authenticate(password.value)) {
      emit('authenticated')
    } else {
      error.value = 'Invalid access password. Contact Jeremiah for access.'
      password.value = ''
    }
  } catch (err) {
    error.value = 'Authentication system error. Please try again.'
    console.error('Auth error:', err)
  }
  
  loading.value = false
}
</script>
