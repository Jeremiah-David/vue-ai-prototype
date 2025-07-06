import OpenAI from 'openai'
import {
    TICKET_TYPES,
} from './aiManipulationRegistry.js'

/**
 * Real AI Service using OpenAI API for Event Creation
 * This service uses OpenAI's function calling to execute ONLY event creation methods from the
 * AI Manipulation Registry for controlled, secure AI-driven event management.
 *
 * SECURITY: AI can only execute the 4 event creation methods defined in aiManipulationRegistry.js
 */
class AIService {
    constructor() {
        this.client = null
        this.isInitialized = false
        this.model = import.meta.env.VITE_AI_MODEL || 'gpt-4o-mini' // Default to cheapest
        this.temperature =
            parseFloat(import.meta.env.VITE_AI_TEMPERATURE) || 0.7
        this.maxTokens = parseInt(import.meta.env.VITE_AI_MAX_TOKENS) || 300
        // Context storage for conversation continuity
        this.conversationHistory = []
        this.maxHistoryLength =
            parseInt(import.meta.env.VITE_AI_CONVERSATION_LIMIT) || 5 // Reduced for cost

        // Usage tracking for cost control
        this.requestCount = 0
        this.sessionLimit = 100 // Max requests per session

        this.initializeClient()
    }

    /**
     * Initialize OpenAI client
     */
    initializeClient() {
        try {
            const apiKey = import.meta.env.VITE_OPENAI_API_KEY

            // Log for debugging
            console.log('🔑 Checking API key availability...')
            console.log('API key present:', !!apiKey)
            console.log('API key starts with sk-:', apiKey?.startsWith('sk-'))

            // Demo/Mock mode when no API key is available
            if (
                !apiKey ||
                apiKey === 'your_openai_api_key_here' ||
                apiKey === 'undefined' ||
                apiKey === ''
            ) {
                console.log(
                    '🔧 Running in DEMO MODE - No valid OpenAI API key provided'
                )
                console.log('💡 AI commands will use simulated responses')
                this.client = null // Will trigger mock mode
                this.isInitialized = true
                return
            }

            this.client = new OpenAI({
                apiKey: apiKey,
                dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy
            })

            this.isInitialized = true
            console.log('✅ OpenAI client initialized successfully')
        } catch (error) {
            console.error('❌ Failed to initialize OpenAI client, falling back to demo mode:', error)
            this.client = null // Enable mock mode on error
            this.isInitialized = true
        }
    }

    /**
     * Define the available event creation tools for OpenAI
     * These correspond exactly to the 4 event methods in the AI Manipulation Registry
     *
     * SECURITY NOTE: This function schema must match the registry methods exactly
     */
    getAvailableTools() {
        return [
            {
                type: 'function',
                function: {
                    name: 'setEventName',
                    description: 'Set the name of the event being created',
                    parameters: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                description: 'The name of the event (3-100 characters)',
                            },
                        },
                        required: ['name'],
                    },
                }
            },
            {
                type: 'function',
                function: {
                    name: 'setEventDescription',
                    description: 'Set a detailed description for the event',
                    parameters: {
                        type: 'object',
                        properties: {
                            description: {
                                type: 'string',
                                description: 'A detailed description of the event (10-500 characters)',
                            },
                        },
                        required: ['description'],
                    },
                }
            },
            {
                type: 'function',
                function: {
                    name: 'addTicketType',
                    description: 'Add a ticket type to the event. Can be called multiple times for different ticket types.',
                    parameters: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                description: 'The ticket type name (e.g., "Children", "Adults", "VIP", "Pro", "Amateur")',
                            },
                            price: {
                                type: 'number',
                                description: 'Optional ticket price',
                            },
                        },
                        required: ['name'],
                    },
                }
            },
            {
                type: 'function',
                function: {
                    name: 'toggleWaitlist',
                    description: 'Enable or disable the waitlist for the event',
                    parameters: {
                        type: 'object',
                        properties: {
                            enabled: {
                                type: 'boolean',
                                description: 'Whether to enable (true) or disable (false) the waitlist',
                            },
                        },
                        required: ['enabled'],
                    },
                }
            },
        ]
    }

    /**
     * Process a user command with OpenAI and execute the appropriate event creation functions
     *
     * @param {string} userInput - The user's natural language command
     * @param {object} registry - The AI manipulation registry instance
     * @returns {Promise<object>} - Response object with results
     */
    async processCommand(userInput, registry) {
        try {
            if (!this.isInitialized) {
                throw new Error('AI service not initialized')
            }

            if (!userInput || typeof userInput !== 'string') {
                throw new Error('Invalid user input')
            }

            // Mock mode when no OpenAI client (demo mode)
            if (!this.client) {
                return this.generateMockResponse(userInput, registry)
            }

            if (this.requestCount >= this.sessionLimit) {
                throw new Error(
                    `Session limit reached (${this.sessionLimit} requests). Please refresh the page.`
                )
            }

            this.requestCount++

            // Build conversation context for OpenAI
            const messages = [
                {
                    role: 'system',
                    content: `You are an AI assistant that helps create events through a web interface. 

Your capabilities are:
1. setEventName(name) - Set the event name
2. setEventDescription(description) - Set the event description
3. addTicketType(name, price) - Add a ticket type (can be called multiple times for different types)
4. toggleWaitlist(enabled) - Enable/disable waitlist

IMPORTANT: You can and should call MULTIPLE functions in a single response when the user provides multiple details. For ticket types, call addTicketType() multiple times for each type mentioned.

Examples:
- "Create a tech conference" → setEventName("Tech Conference"), setEventDescription("A conference for technology professionals"), addTicketType("General Admission")
- "Make a music festival with children and adult tickets" → setEventName("Music Festival"), setEventDescription("A celebration of music and arts"), addTicketType("Children"), addTicketType("Adults")
- "tech event with pro and amateur tickets and waitlist on" → setEventName("Tech Event"), setEventDescription("A technology event"), addTicketType("Pro"), addTicketType("Amateur"), toggleWaitlist(true)
- "conference with VIP, Standard, and Student tickets" → setEventName("Conference"), setEventDescription("A professional conference"), addTicketType("VIP"), addTicketType("Standard"), addTicketType("Student")`,
                },
                ...this.conversationHistory,
                {
                    role: 'user',
                    content: userInput,
                },
            ]

            // Call OpenAI with tools (new format supporting multiple function calls)
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: messages,
                tools: this.getAvailableTools(),
                tool_choice: 'auto',
                temperature: this.temperature,
                max_tokens: this.maxTokens,
            })

            const message = response.choices[0].message
            const results = []

            // Handle multiple tool calls
            if (message.tool_calls && message.tool_calls.length > 0) {
                for (const toolCall of message.tool_calls) {
                    const functionName = toolCall.function.name
                    const functionArgs = JSON.parse(toolCall.function.arguments)

                    console.log(`🎫 AI calling: ${functionName}`, functionArgs)

                    try {
                        // Execute the function through the registry
                        const result = await this.executeFunctionSafely(
                            functionName,
                            functionArgs,
                            registry
                        )

                        results.push({
                            function: functionName,
                            args: functionArgs,
                            result: result,
                        })
                    } catch (error) {
                        console.error(
                            `❌ Failed to execute ${functionName}:`,
                            error
                        )
                        results.push({
                            function: functionName,
                            args: functionArgs,
                            result: false,
                            error: error.message,
                        })
                    }
                }
            }

            // Update conversation history
            this.conversationHistory.push(
                { role: 'user', content: userInput },
                {
                    role: 'assistant',
                    content:
                        message.content ||
                        `Event updated! Executed ${results.length} function(s).`,
                }
            )

            // Limit conversation history for cost control
            if (this.conversationHistory.length > this.maxHistoryLength * 2) {
                this.conversationHistory = this.conversationHistory.slice(
                    -this.maxHistoryLength * 2
                )
            }

            return {
                success: true,
                message:
                    message.content ||
                    `Event updated successfully! Executed ${results.length} function(s).`,
                functions: results,
                usage: response.usage,
            }
        } catch (error) {
            console.error('❌ AI processing error:', error)
            return {
                success: false,
                message: `AI Error: ${error.message}`,
                functions: [],
                error: error.message,
            }
        }
    }

    /**
     * Safely execute a function through the registry with validation
     *
     * @param {string} functionName - Name of the function to execute
     * @param {object} args - Arguments to pass to the function
     * @param {object} registry - The AI manipulation registry instance
     * @returns {Promise<any>} - Function execution result
     */
    async executeFunctionSafely(functionName, args, registry) {
        try {
            // Get available methods from registry
            const registryMethods = registry.getAvailableMethods()

            // Validate function exists and is callable
            if (
                !registryMethods[functionName] ||
                typeof registryMethods[functionName] !== 'function'
            ) {
                throw new Error(`Function ${functionName} is not available`)
            }

            // Security check: Only allow the 4 event creation functions
            const allowedFunctions = [
                'setEventName',
                'setEventDescription', 
                'addTicketType', // Changed from setTicketName
                'toggleWaitlist'
            ]

            if (!allowedFunctions.includes(functionName)) {
                throw new Error(`Function ${functionName} is not allowed`)
            }

            // Execute the function
            const result = await registryMethods[functionName](...Object.values(args))

            console.log(`✅ Function ${functionName} executed successfully:`, result)
            return result
        } catch (error) {
            console.error(`❌ Function execution error for ${functionName}:`, error)
            throw error
        }
    }

    /**
     * Generate mock responses for demo mode (when no OpenAI API key is available)
     */
    async generateMockResponse(userInput, registry) {
        console.log('🎭 DEMO MODE: Generating mock AI response for:', userInput)
        
        const input = userInput.toLowerCase()
        const results = []
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        try {
            // Mock event name detection
            if (input.includes('event') || input.includes('conference') || input.includes('meetup') || input.includes('festival')) {
                let eventName = 'Demo Event'
                if (input.includes('conference')) eventName = 'Demo Conference'
                if (input.includes('meetup')) eventName = 'Demo Meetup'
                if (input.includes('festival')) eventName = 'Demo Festival'
                if (input.includes('workshop')) eventName = 'Demo Workshop'
                
                const result = await registry.executeMethod('setEventName', eventName)
                results.push({ function: 'setEventName', args: { name: eventName }, result })
            }
            
            // Mock description setting
            if (input.includes('tech') || input.includes('music') || input.includes('art') || input.includes('business')) {
                let description = 'A demo event for testing AI functionality'
                if (input.includes('tech')) description = 'A technology event showcasing the latest innovations'
                if (input.includes('music')) description = 'A musical celebration bringing people together'
                if (input.includes('art')) description = 'An artistic showcase of creative talents'
                if (input.includes('business')) description = 'A business networking and development event'
                
                const result = await registry.executeMethod('setEventDescription', description)
                results.push({ function: 'setEventDescription', args: { description }, result })
            }
            
            // Mock ticket type detection
            const ticketTypes = []
            if (input.includes('vip')) ticketTypes.push('VIP')
            if (input.includes('general') || input.includes('standard')) ticketTypes.push('General Admission')
            if (input.includes('student')) ticketTypes.push('Student')
            if (input.includes('early') && input.includes('bird')) ticketTypes.push('Early Bird')
            if (input.includes('children') || input.includes('kids')) ticketTypes.push('Children')
            if (input.includes('adult')) ticketTypes.push('Adults')
            if (input.includes('pro') || input.includes('professional')) ticketTypes.push('Professional')
            if (input.includes('amateur')) ticketTypes.push('Amateur')
            
            // If no specific types found, add a default
            if (ticketTypes.length === 0 && (input.includes('ticket') || results.length > 0)) {
                ticketTypes.push('General Admission')
            }
            
            for (const ticketType of ticketTypes) {
                const result = await registry.executeMethod('addTicketType', ticketType)
                results.push({ function: 'addTicketType', args: { name: ticketType }, result })
            }
            
            // Mock waitlist detection
            if (input.includes('waitlist')) {
                const enabled = !input.includes('no') && !input.includes('disable') && !input.includes('off')
                const result = await registry.executeMethod('toggleWaitlist', enabled)
                results.push({ function: 'toggleWaitlist', args: { enabled }, result })
            }
            
            return {
                success: true,
                message: `🎭 DEMO MODE: Simulated AI response - processed "${userInput}"`,
                results: results,
                demoMode: true
            }
            
        } catch (error) {
            console.error('❌ Mock response error:', error)
            return {
                success: false,
                message: `Demo mode error: ${error.message}`,
                results: [],
                demoMode: true
            }
        }
    }

    /**
     * Get usage statistics
     */
    getUsageStats() {
        return {
            model: this.model,
            requestCount: this.requestCount,
            sessionLimit: this.sessionLimit,
            remainingRequests: this.sessionLimit - this.requestCount,
            isInitialized: this.isInitialized,
        }
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = []
    }

    /**
     * Check if the service is ready to use
     */
    isReady() {
        return this.isInitialized && this.requestCount < this.sessionLimit
    }
}

// Export singleton instance
export default new AIService()
