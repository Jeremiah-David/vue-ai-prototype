<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <!-- Navigation -->
        <nav class="relative z-10 flex items-center justify-between p-6 lg:px-8">
            <div class="flex items-center">
                <div class="text-2xl font-bold text-white">
                    AI<span class="text-purple-400">Alpha</span>
                    <span class="text-sm text-gray-400 ml-2">Event Creator</span>
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
                    <span
                        class="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                        Event Creation
                    </span>
                </h1>

                <!-- Subtitle -->
                <p class="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Create events effortlessly with intelligent AI assistance.
                    Set event details, manage tickets, and configure waitlists through
                    natural language commands.
                </p>

                <!-- Interactive Demo Section -->
                <div
                    class="w-full max-w-4xl mx-auto bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-16">
                    <h3 class="text-2xl font-bold text-white mb-6 text-center">
                        Try the AI Event Creator
                    </h3>

                    <!-- Command Input -->
                    <div class="mb-6">
                        <div class="relative">
                            <input v-model="currentCommand" @keyup.enter="processCommand" type="text"
                                placeholder="Try: 'Create a tech conference in San Francisco' or 'Make a music festival with VIP tickets and waitlist'"
                                class="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20" />
                            <button @click="processCommand" :disabled="isProcessing"
                                class="absolute right-2 top-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-all">
                                {{ isProcessing ? 'Processing...' : 'Send' }}
                            </button>
                        </div>

                        <!-- AI Status Indicator -->
                        <div class="mt-2 flex items-center justify-between text-sm">
                            <div class="flex items-center space-x-2">
                                <div class="w-2 h-2 rounded-full bg-green-400"></div>
                                <span class="text-gray-400">
                                    AI Active ({{ aiService.getUsageStats().model }})
                                </span>
                            </div>
                            <div class="text-gray-500 text-xs">
                                {{ aiService.getUsageStats().remainingRequests }}/{{
                                    aiService.getUsageStats().sessionLimit }} requests left
                            </div>
                        </div>
                    </div>

                    <!-- AI Processing Status -->
                    <div v-if="isProcessing" class="mb-4 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                        <div class="flex items-center space-x-3">
                            <div
                                class="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full">
                            </div>
                            <span class="text-blue-300">AI is creating your event...</span>
                        </div>
                    </div>

                    <!-- Command History -->
                    <div v-if="commandHistory.length > 0" class="mb-6">
                        <h4 class="text-lg font-semibold text-white mb-3">
                            Recent Commands:
                        </h4>
                        <div class="space-y-2 max-h-32 overflow-y-auto">
                            <div v-for="(command, index) in commandHistory.slice(-3)" :key="index"
                                class="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <span class="text-gray-300">{{ command.command }}</span>
                                <span
                                    :class="[command.success ? 'text-green-400' : 'text-red-400', 'text-xs font-semibold']">
                                    {{ command.success ? '✓' : '✗' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Event Display Section -->
                    <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h4 class="text-xl font-bold text-white mb-4 flex items-center">
                            🎫 Current Event
                        </h4>

                        <!-- Event Name -->
                        <div class="mb-4 p-4 bg-purple-600/20 border border-purple-400/30 rounded-lg">
                            <h5 class="text-sm font-semibold text-purple-300 mb-1">Event Name</h5>
                            <p class="text-white text-lg">{{ eventName || 'No event name set' }}</p>
                        </div>

                        <!-- Event Description -->
                        <div class="mb-4 p-4 bg-blue-600/20 border border-blue-400/30 rounded-lg">
                            <h5 class="text-sm font-semibold text-blue-300 mb-1">Description</h5>
                            <p class="text-white">{{ eventDescription || 'No description set' }}</p>
                        </div>

                        <!-- Ticket Info and Waitlist -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Ticket Name -->
                            <div class="p-4 bg-green-600/20 border border-green-400/30 rounded-lg">
                                <h5 class="text-sm font-semibold text-green-300 mb-1">Ticket Type</h5>
                                <p class="text-white">{{ ticketName }}</p>
                            </div>

                            <!-- Waitlist Status -->
                            <div class="p-4 bg-orange-600/20 border border-orange-400/30 rounded-lg">
                                <h5 class="text-sm font-semibold text-orange-300 mb-1">Waitlist</h5>
                                <div class="flex items-center space-x-2">
                                    <div :class="[waitlistEnabled ? 'bg-green-500' : 'bg-gray-500', 'w-3 h-3 rounded-full']"></div>
                                    <span class="text-white">{{ waitlistEnabled ? 'Enabled' : 'Disabled' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Demo Examples -->
                    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button @click="currentCommand = 'Create a tech conference in San Francisco'; processCommand()"
                            class="p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/30 rounded-lg text-left transition-all">
                            <div class="text-purple-300 font-semibold mb-1">Tech Conference</div>
                            <div class="text-gray-400 text-sm">Create a technology conference</div>
                        </button>
                        <button @click="currentCommand = 'Make a music festival with VIP tickets and waitlist enabled'; processCommand()"
                            class="p-4 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-400/30 rounded-lg text-left transition-all">
                            <div class="text-pink-300 font-semibold mb-1">Music Festival</div>
                            <div class="text-gray-400 text-sm">Festival with VIP tickets</div>
                        </button>
                    </div>

                    <!-- Clear Button -->
                    <div class="mt-6 text-center">
                        <button @click="clearEvent"
                            class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all">
                            Clear Event
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="relative py-20 px-4">
            <div class="max-w-6xl mx-auto">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
                        AI Event Creation Features
                    </h2>
                    <p class="text-xl text-gray-300 max-w-3xl mx-auto">
                        Streamline your event planning with intelligent AI assistance
                    </p>
                </div>

                <div class="grid md:grid-cols-3 gap-8">
                    <div
                        class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-400/50 transition-all transform hover:scale-105">
                        <div
                            class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-6 flex items-center justify-center">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                                </path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-white mb-4">
                            Smart Event Setup
                        </h3>
                        <p class="text-gray-400">
                            AI understands your event requirements and configures
                            details automatically through natural commands
                        </p>
                    </div>

                    <div
                        class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-cyan-400/50 transition-all transform hover:scale-105">
                        <div
                            class="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl mb-6 flex items-center justify-center">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z">
                                </path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-white mb-4">
                            Ticket Management
                        </h3>
                        <p class="text-gray-400">
                            Configure ticket types and pricing through simple AI commands
                        </p>
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
                        <h3 class="text-xl font-semibold text-white mb-4">
                            Waitlist Control
                        </h3>
                        <p class="text-gray-400">
                            Enable or disable waitlists with intelligent capacity management
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import aiService from '@/services/aiService.js'
import { createAIManipulationRegistry } from '@/services/aiManipulationRegistry.js'

// Event state (reactive)
const eventName = ref('')
const eventDescription = ref('')
const ticketName = ref('General Admission')
const waitlistEnabled = ref(false)

// Create the AI manipulation registry with event state
const manipulationRegistry = createAIManipulationRegistry({
    eventName,
    eventDescription,
    ticketName,
    waitlistEnabled,
})

// Command processing state
const currentCommand = ref('')
const isProcessing = ref(false)
const commandHistory = ref([])

// Get the 4 available event methods from the registry
const {
    setEventName,
    setEventDescription,
    setTicketName,
    toggleWaitlist,
} = manipulationRegistry.getAvailableMethods()

// Process AI command
const processCommand = async () => {
    if (!currentCommand.value.trim() || isProcessing.value) return

    const command = currentCommand.value.trim()
    isProcessing.value = true

    try {
        console.log('🎫 Processing event command:', command)

        // Process the command through AI service
        const result = await aiService.processCommand(command, manipulationRegistry)

        // Add to command history
        commandHistory.value.push({
            command: command,
            success: result.success,
            message: result.message,
            timestamp: new Date().toLocaleTimeString(),
        })

        console.log('✅ Event command completed:', result)

        // Clear the input on success
        if (result.success) {
            currentCommand.value = ''
        }
    } catch (error) {
        console.error('❌ Event command failed:', error)
        commandHistory.value.push({
            command: command,
            success: false,
            message: error.message || 'Command failed',
            timestamp: new Date().toLocaleTimeString(),
        })
    } finally {
        isProcessing.value = false
    }
}

// Clear event function
const clearEvent = () => {
    eventName.value = ''
    eventDescription.value = ''
    ticketName.value = 'General Admission'
    waitlistEnabled.value = false
    commandHistory.value = []
    currentCommand.value = ''
    console.log('🎫 Event cleared')
}

// Demo functions
const createTechConferenceDemo = async () => {
    setEventName('Tech Innovation Conference 2025')
    await new Promise((resolve) => setTimeout(resolve, 300))
    setEventDescription('Join industry leaders for cutting-edge technology discussions, networking, and innovation showcases.')
    await new Promise((resolve) => setTimeout(resolve, 300))
    setTicketName('General Admission')
    await new Promise((resolve) => setTimeout(resolve, 300))
    toggleWaitlist(false)
}

const createMusicFestivalDemo = async () => {
    setEventName('Summer Music Festival')
    await new Promise((resolve) => setTimeout(resolve, 300))
    setEventDescription('Three days of amazing music, food trucks, and unforgettable experiences under the stars.')
    await new Promise((resolve) => setTimeout(resolve, 300))
    setTicketName('VIP')
    await new Promise((resolve) => setTimeout(resolve, 300))
    toggleWaitlist(true)
}

// Expose methods for testing and future use
defineExpose({
    // Registry and its methods
    manipulationRegistry,
    setEventName,
    setEventDescription,
    setTicketName,
    toggleWaitlist,

    // Component methods
    processCommand,
    clearEvent,
    createTechConferenceDemo,
    createMusicFestivalDemo,

    // State (read-only access)
    eventName,
    eventDescription,
    ticketName,
    waitlistEnabled,

    // Utility methods
    getActionLog: manipulationRegistry.getActionLog,
    getEventState: manipulationRegistry.getEventState,
})
</script>

<style scoped>
@keyframes pulse {
    0%,
    100% {
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
