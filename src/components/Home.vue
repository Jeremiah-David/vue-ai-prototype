<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- Navigation -->
    <nav class="relative z-10 flex items-center justify-between p-6 lg:px-8">
      <div class="flex items-center">
        <div class="text-2xl font-bold text-white">
          AI<span class="text-purple-400">Alpha</span>
        </div>
      </div>
      <div class="hidden md:flex items-center space-x-8">
        <a href="#features" class="text-gray-300 hover:text-white transition-colors">Features</a>
        <a href="#demo" class="text-gray-300 hover:text-white transition-colors">Demo</a>
        <button
          class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-all transform hover:scale-105">
          Get Started
        </button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative flex items-center justify-center min-h-[80vh] px-4">
      <!-- Background Effects -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse">
        </div>
        <div
          class="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000">
        </div>
        <div
          class="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000">
        </div>
      </div>

      <div class="relative z-10 text-center max-w-5xl mx-auto">
        <!-- Main Headline -->
        <h1 class="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
          AI-Driven
          <span class="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            UI Manipulation
          </span>
        </h1>

        <!-- Subtitle -->
        <p class="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Transform your applications with intelligent interface control.
          Add buttons, counters, and components through natural AI commands.
        </p>

        <!-- Interactive Demo Section -->
        <div class="w-full max-w-4xl mx-auto bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-16">
          <h3 class="text-2xl font-bold text-white mb-6 text-center">Try the AI Demo</h3>

          <!-- Command Input -->
          <div class="mb-6">
            <div class="relative">
              <input v-model="currentCommand" @keyup.enter="processCommand" type="text"
                placeholder="Try: 'Create a magical story with purple buttons' or 'Add a space theme background'"
                class="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20" />
              <button @click="processCommand" :disabled="isProcessing"
                class="absolute right-2 top-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-all">
                {{ isProcessing ? 'Processing...' : 'Send' }}
              </button>
            </div>

            <!-- AI Status Indicator -->
            <div class="mt-2 flex items-center justify-between text-sm">
              <div class="flex items-center space-x-2">
                <div :class="{
                  'w-2 h-2 rounded-full': true,
                  'bg-green-400': aiService.isRealAIAvailable(),
                  'bg-yellow-400': aiService.getMode() === 'mock'
                }"></div>
                <span class="text-gray-400">
                  {{ aiService.isRealAIAvailable() ? `Real AI Active (${aiService.getUsageStats().model})` : 'Mock AI
                  Mode' }}
                </span>
              </div>
              <div class="text-gray-500 text-xs">
                {{ aiService.isRealAIAvailable() ?
                  `${aiService.getUsageStats().remainingRequests}/${aiService.getUsageStats().sessionLimit} requests left`
                  :
                'Configure VITE_OPENAI_API_KEY for real AI' }}
              </div>
            </div>
          </div>

          <!-- AI Processing Status -->
          <div v-if="isProcessing" class="mb-4 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"></div>
              <span class="text-blue-300">AI is analyzing your request...</span>
            </div>
          </div>

          <!-- Command History -->
          <div v-if="commandHistory.length > 0" class="mb-6">
            <h4 class="text-lg font-semibold text-white mb-3">Recent Commands:</h4>
            <div class="space-y-2 max-h-32 overflow-y-auto">
              <div v-for="(cmd, index) in commandHistory.slice(-3)" :key="index"
                class="text-sm text-gray-300 bg-white/5 rounded-lg p-2">
                <span class="text-green-400">></span> {{ cmd.command }}
                <span class="text-xs text-gray-500 ml-2">{{ cmd.timestamp }}</span>
              </div>
            </div>
          </div>

          <!-- Demo Actions -->
          <div class="flex flex-wrap gap-2 justify-center">
            <button @click="runDemoScenario('story')"
              class="px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-lg text-sm transition-all">
              Demo: Story Creation
            </button>
            <button @click="runDemoScenario('dashboard')"
              class="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded-lg text-sm transition-all">
              Demo: Dashboard
            </button>
            <button @click="runDemoScenario('theme')"
              class="px-4 py-2 bg-green-600/30 hover:bg-green-600/50 text-green-300 rounded-lg text-sm transition-all">
              Demo: Theme Change
            </button>
            <button @click="clearDemo"
              class="px-4 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-300 rounded-lg text-sm transition-all">
              Clear Demo
            </button>
          </div>
        </div>

        <!-- Dynamic Demo Area -->
        <div class="w-full max-w-6xl mx-auto" :style="backgroundStyle">
          <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 min-h-96">
            <h3 class="text-2xl font-bold text-white mb-6 text-center">AI Generated Interface</h3>

            <!-- Story Content Area -->
            <div v-if="storyElements.length > 0" class="mb-8">
              <div v-for="element in storyElements" :key="element.id"
                class="mb-4 p-4 bg-white/10 rounded-lg border border-white/20">
                <h4 v-if="element.type === 'title'" class="text-xl font-bold text-white">{{ element.content }}</h4>
                <p v-else-if="element.type === 'paragraph'" class="text-gray-300 leading-relaxed">{{ element.content }}
                </p>
                <div v-else-if="element.type === 'character'" class="flex items-center space-x-3">
                  <div class="w-3 h-3 rounded-full bg-purple-400"></div>
                  <span class="text-purple-300 font-semibold">{{ element.content }}</span>
                </div>
              </div>
            </div>

            <!-- Dynamic Elements Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <!-- Dynamic Buttons -->
              <div v-for="element in elements" :key="element.id"
                class="transition-all duration-300 transform hover:scale-105">
                <button v-if="element.type === 'button'" @click="handleElementClick(element)"
                  :class="getButtonClasses(element)" class="w-full py-3 px-4 rounded-lg font-semibold transition-all">
                  {{ element.text }}
                </button>

                <!-- Dynamic Cards -->
                <div v-else-if="element.type === 'card'" :class="getCardClasses(element)" class="p-4 rounded-lg border">
                  <h4 class="font-bold mb-2">{{ element.title }}</h4>
                  <p class="text-sm opacity-80">{{ element.content }}</p>
                </div>

                <!-- Dynamic Counters -->
                <div v-else-if="element.type === 'counter'" :class="getCounterClasses(element)"
                  class="p-4 rounded-lg border text-center">
                  <div class="text-2xl font-bold mb-2">{{ counters[element.id] || 0 }}</div>
                  <div class="text-sm opacity-80 mb-2">{{ element.label }}</div>
                  <button @click="incrementCounter(element.id)"
                    class="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs transition-all">
                    +1
                  </button>
                </div>

                <!-- Dynamic Images -->
                <div v-else-if="element.type === 'image'" class="relative rounded-lg overflow-hidden">
                  <div :class="getImageClasses(element)"
                    class="w-full h-32 flex items-center justify-center text-white">
                    <span class="text-lg">{{ element.content || '🖼️ Image' }}</span>
                  </div>
                  <div class="absolute bottom-2 left-2 text-xs text-white/80">{{ element.alt }}</div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="elements.length === 0 && storyElements.length === 0" class="text-center py-12">
              <div class="text-gray-400 mb-4">
                <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 2v14a2 2 0 002 2h6a2 2 0 002-2V6H7z">
                  </path>
                </svg>
              </div>
              <p class="text-gray-400">Type a command above to see AI magic happen!</p>
              <p class="text-sm text-gray-500 mt-2">Try: "Create a magical adventure story" or "Add colorful buttons"
              </p>
            </div>
          </div>
        </div>

        <!-- Feature Pills -->
        <div class="flex flex-wrap justify-center gap-4 text-sm">
          <span class="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20">
            Vue 3 Composition API
          </span>
          <span class="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20">
            Enterprise Ready
          </span>
          <span class="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20">
            Real-time Manipulation
          </span>
          <span class="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20">
            Scalable Architecture
          </span>
        </div>
      </div>
    </section>

    <!-- Features Preview Section -->
    <section id="features" class="relative py-20 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
            Intelligent Interface Control
          </h2>
          <p class="text-xl text-gray-300 max-w-2xl mx-auto">
            Watch as AI commands seamlessly transform your application's interface in real-time
          </p>
        </div>

        <!-- Feature Cards -->
        <div class="grid md:grid-cols-3 gap-8">
          <div
            class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-400/50 transition-all transform hover:scale-105">
            <div
              class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-6 flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4">
                </path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Dynamic Components</h3>
            <p class="text-gray-400">Add buttons, counters, and UI elements through simple AI commands</p>
          </div>

          <div
            class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-cyan-400/50 transition-all transform hover:scale-105">
            <div
              class="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl mb-6 flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z">
                </path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Real-time Updates</h3>
            <p class="text-gray-400">Instant visual feedback as AI manipulates your interface</p>
          </div>

          <div
            class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-pink-400/50 transition-all transform hover:scale-105">
            <div
              class="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl mb-6 flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Enterprise Scale</h3>
            <p class="text-gray-400">Built with Vue 3 and designed for production environments</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Preview Section -->
    <section id="demo" class="relative py-20 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-8">
          See It In Action
        </h2>
        <div class="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
          <div class="bg-slate-800 rounded-2xl p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex space-x-2">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span class="text-gray-400 text-sm">AI Command Interface</span>
            </div>
            <div class="text-left">
              <div class="text-green-400 mb-2">$ ai.addButton("Click Me", "primary")</div>
              <div class="text-blue-400 mb-2">$ ai.incrementCounter("mainCounter")</div>
              <div class="text-purple-400">$ ai.changeBackground("gradient-purple")</div>
            </div>
          </div>
          <p class="text-gray-300 text-lg">
            Ready to revolutionize how you build interfaces? Start your journey with AIAlpha.
          </p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative py-12 px-4 border-t border-white/10">
      <div class="max-w-6xl mx-auto text-center">
        <div class="text-2xl font-bold text-white mb-4">
          AI<span class="text-purple-400">Alpha</span>
        </div>
        <p class="text-gray-400 mb-6">
          Prototype for AI-driven UI manipulation • Built with Vue 3 & Tailwind CSS
        </p>
        <div class="flex justify-center space-x-6 text-gray-400">
          <a href="#" class="hover:text-white transition-colors">Documentation</a>
          <a href="#" class="hover:text-white transition-colors">GitHub</a>
          <a href="#" class="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Component state for AI manipulation features
import { ref, reactive } from 'vue'
import aiService from '../services/aiService.js'

// Reactive state for demo interface
const currentCommand = ref('')
const isProcessing = ref(false)
const commandHistory = ref([])

// State for AI manipulation
const elements = ref([])
const storyElements = ref([])
const counters = reactive({})
const backgroundStyle = ref('')

// AI manipulation methods
const addButton = (text = 'New Button', id = Date.now(), style = {}) => {
  elements.value.push({
    type: 'button',
    id,
    text,
    style: {
      color: style.color || 'purple',
      size: style.size || 'medium',
      theme: style.theme || 'default',
      ...style
    },
    visible: true
  })
  console.log(`AI Command: Added button "${text}" with ID ${id}`)
}

const addCard = (title, content, id = Date.now(), style = {}) => {
  elements.value.push({
    type: 'card',
    id,
    title,
    content,
    style: {
      color: style.color || 'blue',
      theme: style.theme || 'default',
      ...style
    },
    visible: true
  })
  console.log(`AI Command: Added card "${title}" with ID ${id}`)
}

const addCounter = (label = 'Counter', id = Date.now(), style = {}) => {
  elements.value.push({
    type: 'counter',
    id,
    label,
    style: {
      color: style.color || 'green',
      theme: style.theme || 'default',
      ...style
    },
    visible: true
  })
  if (!counters[id]) counters[id] = 0
  console.log(`AI Command: Added counter "${label}" with ID ${id}`)
}

const addImage = (content = '🖼️', alt = 'AI Generated Image', id = Date.now(), style = {}) => {
  elements.value.push({
    type: 'image',
    id,
    content,
    alt,
    style: {
      color: style.color || 'purple',
      theme: style.theme || 'default',
      ...style
    },
    visible: true
  })
  console.log(`AI Command: Added image "${alt}" with ID ${id}`)
}

const addStoryElement = (type, content, id = Date.now()) => {
  storyElements.value.push({
    type, // 'title', 'paragraph', 'character'
    id,
    content,
    timestamp: new Date().toISOString()
  })
  console.log(`AI Command: Added story ${type}: "${content}"`)
}

const incrementCounter = (id) => {
  if (!counters[id]) counters[id] = 0
  counters[id]++
  console.log(`AI Command: Incremented counter ${id} to ${counters[id]}`)
}

const changeBackground = (style) => {
  backgroundStyle.value = style
  console.log(`AI Command: Changed background to ${style}`)
}

const setTheme = (themeName) => {
  const themes = {
    space: 'background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
    ocean: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    forest: 'background: linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    sunset: 'background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    magical: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    corporate: 'background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    default: ''
  }

  changeBackground(themes[themeName] || themes.default)
  console.log(`AI Command: Applied ${themeName} theme`)
}

// Styling helper methods
const getButtonClasses = (element) => {
  const baseClasses = ['shadow-lg', 'transform', 'transition-all', 'hover:scale-105']
  const colorClasses = {
    purple: ['bg-purple-600', 'hover:bg-purple-700', 'text-white'],
    blue: ['bg-blue-600', 'hover:bg-blue-700', 'text-white'],
    green: ['bg-green-600', 'hover:bg-green-700', 'text-white'],
    red: ['bg-red-600', 'hover:bg-red-700', 'text-white'],
    gold: ['bg-yellow-600', 'hover:bg-yellow-700', 'text-white'],
    magic: ['bg-gradient-to-r', 'from-purple-500', 'to-pink-500', 'hover:from-purple-600', 'hover:to-pink-600', 'text-white']
  }

  return [...baseClasses, ...(colorClasses[element.style?.color] || colorClasses.purple)]
}

const getCardClasses = (element) => {
  const colorClasses = {
    blue: ['bg-blue-600/20', 'border-blue-400/30', 'text-blue-100'],
    purple: ['bg-purple-600/20', 'border-purple-400/30', 'text-purple-100'],
    green: ['bg-green-600/20', 'border-green-400/30', 'text-green-100'],
    red: ['bg-red-600/20', 'border-red-400/30', 'text-red-100']
  }

  return colorClasses[element.style?.color] || colorClasses.blue
}

const getCounterClasses = (element) => {
  const colorClasses = {
    green: ['bg-green-600/20', 'border-green-400/30', 'text-green-100'],
    blue: ['bg-blue-600/20', 'border-blue-400/30', 'text-blue-100'],
    purple: ['bg-purple-600/20', 'border-purple-400/30', 'text-purple-100'],
    gold: ['bg-yellow-600/20', 'border-yellow-400/30', 'text-yellow-100']
  }

  return colorClasses[element.style?.color] || colorClasses.green
}

const getImageClasses = (element) => {
  const colorClasses = {
    purple: ['bg-gradient-to-br', 'from-purple-600', 'to-purple-800'],
    blue: ['bg-gradient-to-br', 'from-blue-600', 'to-blue-800'],
    green: ['bg-gradient-to-br', 'from-green-600', 'to-green-800'],
    space: ['bg-gradient-to-br', 'from-gray-900', 'to-blue-900']
  }

  return colorClasses[element.style?.color] || colorClasses.purple
}

// Event handlers
const handleElementClick = (element) => {
  console.log(`Clicked element: ${element.type} - ${element.text || element.title}`)

  // Add click feedback
  if (element.type === 'button') {
    // Create a temporary visual effect or action
    addLogMessage(`Button "${element.text}" was clicked!`)
  }
}

const addLogMessage = (message) => {
  commandHistory.value.push({
    command: `System: ${message}`,
    timestamp: new Date().toLocaleTimeString()
  })
}

// Command processing with Real AI Integration
const processCommand = async () => {
  if (!currentCommand.value.trim() || isProcessing.value) return

  const command = currentCommand.value.trim()
  isProcessing.value = true

  // Add to history
  commandHistory.value.push({
    command: command,
    timestamp: new Date().toLocaleTimeString(),
    mode: aiService.getMode()
  })

  try {
    // Create UI methods object to pass to AI service
    const uiMethods = {
      addButton,
      addCard,
      addCounter,
      addImage,
      addStoryElement,
      incrementCounter,
      changeBackground,
      setTheme
    }

    // Process command with real AI service
    const result = await aiService.processCommand(command, uiMethods)

    if (result.success) {
      commandHistory.value.push({
        command: `System: ${result.message}`,
        timestamp: new Date().toLocaleTimeString(),
        mode: aiService.getMode()
      })
    }
  } catch (error) {
    console.error('Command processing error:', error)
    commandHistory.value.push({
      command: `Error: Failed to process command - ${error.message}`,
      timestamp: new Date().toLocaleTimeString(),
      mode: 'error'
    })
  }

  currentCommand.value = ''
  isProcessing.value = false
}

// Mock AI processor - simulates real AI responses
const mockAIProcessor = async (command) => {
  const cmd = command.toLowerCase()

  // Story creation commands
  if (cmd.includes('story') || cmd.includes('tale') || cmd.includes('adventure')) {
    if (cmd.includes('pirate')) {
      await createPirateStory()
    } else if (cmd.includes('space') || cmd.includes('galaxy')) {
      await createSpaceStory()
    } else if (cmd.includes('magic') || cmd.includes('wizard') || cmd.includes('fairy')) {
      await createMagicalStory()
    } else {
      await createGenericStory()
    }
  }

  // Button creation commands
  else if (cmd.includes('button')) {
    const colors = ['purple', 'blue', 'green', 'red', 'gold', 'magic']
    const color = colors.find(c => cmd.includes(c)) || 'purple'
    const text = extractTextFromCommand(cmd, 'button') || 'AI Generated Button'
    addButton(text, Date.now(), { color })
  }

  // Background/theme commands
  else if (cmd.includes('background') || cmd.includes('theme')) {
    if (cmd.includes('space') || cmd.includes('stars')) {
      setTheme('space')
    } else if (cmd.includes('ocean') || cmd.includes('blue')) {
      setTheme('ocean')
    } else if (cmd.includes('magic') || cmd.includes('purple')) {
      setTheme('magical')
    } else if (cmd.includes('sunset') || cmd.includes('orange')) {
      setTheme('sunset')
    } else if (cmd.includes('forest') || cmd.includes('green')) {
      setTheme('forest')
    }
  }

  // Counter commands
  else if (cmd.includes('counter') || cmd.includes('count')) {
    const label = extractTextFromCommand(cmd, 'counter') || 'Progress Counter'
    const color = cmd.includes('blue') ? 'blue' : cmd.includes('green') ? 'green' : 'purple'
    addCounter(label, Date.now(), { color })
  }

  // Card commands
  else if (cmd.includes('card') || cmd.includes('dashboard')) {
    const title = extractTextFromCommand(cmd, 'card') || 'AI Generated Card'
    const content = `This ${title.toLowerCase()} was created by AI based on your command.`
    addCard(title, content, Date.now(), { color: 'blue' })
  }

  // Default response
  else {
    addStoryElement('paragraph', `AI processed: "${command}" - Try commands like "create a magical story", "add purple buttons", or "change to space theme"`)
  }
}

// Helper function to extract text from commands
const extractTextFromCommand = (command, type) => {
  const patterns = {
    button: /(?:button.*?["']([^"']+)["'])|(?:button\s+(?:that\s+says\s+|saying\s+|with\s+text\s+)?["']?([^"'\n]+)["']?)/i,
    counter: /(?:counter.*?["']([^"']+)["'])|(?:counter\s+(?:for\s+|called\s+|labeled\s+)?["']?([^"'\n]+)["']?)/i,
    card: /(?:card.*?["']([^"']+)["'])|(?:card\s+(?:for\s+|called\s+|titled\s+)?["']?([^"'\n]+)["']?)/i
  }

  const match = command.match(patterns[type])
  return match ? (match[1] || match[2])?.trim() : null
}

// Predefined demo scenarios
const runDemoScenario = async (scenario) => {
  isProcessing.value = true

  switch (scenario) {
    case 'story':
      currentCommand.value = 'Create a magical adventure story with wizards and dragons'
      break
    case 'dashboard':
      currentCommand.value = 'Create a corporate dashboard with progress counters and status cards'
      break
    case 'theme':
      currentCommand.value = 'Change to a beautiful space theme with starry background'
      break
  }

  await new Promise(resolve => setTimeout(resolve, 500))
  await processCommand()
}

// Story generators
const createPirateStory = async () => {
  setTheme('ocean')
  await new Promise(resolve => setTimeout(resolve, 300))

  addStoryElement('title', '🏴‍☠️ The Treasure of Captain Blackbeard')
  await new Promise(resolve => setTimeout(resolve, 500))

  addStoryElement('character', 'Captain Jack Sparrow - The brave pirate captain')
  await new Promise(resolve => setTimeout(resolve, 500))

  addStoryElement('paragraph', 'In the deep blue Caribbean seas, Captain Jack discovered an ancient map leading to the legendary treasure of Captain Blackbeard. The adventure begins with three mysterious keys...')
  await new Promise(resolve => setTimeout(resolve, 500))

  addButton('🗝️ First Key', Date.now(), { color: 'gold' })
  await new Promise(resolve => setTimeout(resolve, 300))
  addButton('🗝️ Second Key', Date.now(), { color: 'gold' })
  await new Promise(resolve => setTimeout(resolve, 300))
  addButton('🗝️ Third Key', Date.now(), { color: 'gold' })

  addCounter('Treasure Found', Date.now(), { color: 'gold' })
}

const createSpaceStory = async () => {
  setTheme('space')
  await new Promise(resolve => setTimeout(resolve, 300))

  addStoryElement('title', '🚀 Mission to Alpha Centauri')
  await new Promise(resolve => setTimeout(resolve, 500))

  addStoryElement('character', 'Commander Nova - Interstellar Explorer')
  await new Promise(resolve => setTimeout(resolve, 500))

  addStoryElement('paragraph', 'In the year 2150, Commander Nova embarks on humanitys first journey to Alpha Centauri. Armed with advanced technology and unwavering determination, the mission begins...')
  await new Promise(resolve => setTimeout(resolve, 500))

  addButton('🚀 Launch Sequence', Date.now(), { color: 'blue' })
  await new Promise(resolve => setTimeout(resolve, 300))
  addButton('🛸 Hyperdrive', Date.now(), { color: 'purple' })
  await new Promise(resolve => setTimeout(resolve, 300))
  addButton('🌟 Scan Stars', Date.now(), { color: 'magic' })

  addCounter('Light Years Traveled', Date.now(), { color: 'blue' })
  addCard('Mission Status', 'All systems operational. Crew morale: High. Estimated arrival: 4.3 years.', Date.now(), { color: 'blue' })
}

const createMagicalStory = async () => {
  setTheme('magical')
  await new Promise(resolve => setTimeout(resolve, 300))

  addStoryElement('title', '🧙‍♂️ The Academy of Mystic Arts')
  await new Promise(resolve => setTimeout(resolve, 500))

  addStoryElement('character', 'Merlin the Wise - Grand Wizard')
  await new Promise(resolve => setTimeout(resolve, 500))

  addStoryElement('paragraph', 'Young apprentices gather at the mystical academy where ancient spells and magical creatures await. Your journey into the world of magic begins with learning three fundamental spells...')
  await new Promise(resolve => setTimeout(resolve, 500))

  addButton('✨ Levitation Spell', Date.now(), { color: 'magic' })
  await new Promise(resolve => setTimeout(resolve, 300))
  addButton('🔮 Crystal Vision', Date.now(), { color: 'purple' })
  await new Promise(resolve => setTimeout(resolve, 300))
  addButton('🌟 Star Magic', Date.now(), { color: 'magic' })

  addCounter('Spells Mastered', Date.now(), { color: 'purple' })
  addCard('Magical Progress', 'Your magical abilities are growing stronger with each spell you master!', Date.now(), { color: 'purple' })
}

const createGenericStory = async () => {
  addStoryElement('title', '📖 An AI-Generated Adventure')
  await new Promise(resolve => setTimeout(resolve, 500))

  addStoryElement('paragraph', 'This is a demonstration of AI-powered storytelling. The system can generate interactive narratives, create themed interfaces, and add dynamic elements based on natural language commands.')
  await new Promise(resolve => setTimeout(resolve, 500))

  addButton('Continue Story', Date.now(), { color: 'purple' })
  addCounter('Story Progress', Date.now(), { color: 'green' })
}

// Clear demo function
const clearDemo = () => {
  elements.value = []
  storyElements.value = []
  Object.keys(counters).forEach(key => delete counters[key])
  backgroundStyle.value = ''
  commandHistory.value = []
  console.log('Demo cleared')
}

// Expose methods for future AI integration
defineExpose({
  addButton,
  addCard,
  addCounter,
  addImage,
  addStoryElement,
  incrementCounter,
  changeBackground,
  setTheme,
  processCommand,
  clearDemo,
  elements,
  storyElements,
  counters
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.4;
  }
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
}
</style>
