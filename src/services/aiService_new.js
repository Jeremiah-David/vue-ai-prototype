import OpenAI from 'openai'
import {
    EVENT_TYPES,
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

            if (!apiKey || apiKey === 'your_openai_api_key_here') {
                throw new Error('OpenAI API key is required for AI functionality')
            }

            this.client = new OpenAI({
                apiKey: apiKey,
                dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy
            })

            this.isInitialized = true
            console.log('✅ OpenAI client initialized successfully')
        } catch (error) {
            console.error('❌ Failed to initialize OpenAI client:', error)
            throw error
        }
    }

    /**
     * Define the available event creation functions for OpenAI
     * These correspond exactly to the 4 event methods in the AI Manipulation Registry
     *
     * SECURITY NOTE: This function schema must match the registry methods exactly
     */
    getAvailableFunctions() {
        return [
            {
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
            },
            {
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
            },
            {
                name: 'setTicketName',
                description: 'Set the name/type of tickets for the event',
                parameters: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'The ticket name/type (defaults to "General Admission")',
                            enum: Object.values(TICKET_TYPES),
                        },
                    },
                    required: ['name'],
                },
            },
            {
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

Your only capabilities are:
1. setEventName(name) - Set the event name
2. setEventDescription(description) - Set the event description
3. setTicketName(name) - Set the ticket type/name
4. toggleWaitlist(enabled) - Enable/disable waitlist

You can ONLY use these 4 functions. When a user asks you to create an event, analyze their request and use the appropriate functions to set up the event details.

Examples:
- "Create a tech conference" → setEventName("Tech Conference"), setEventDescription("A conference for technology professionals"), setTicketName("General Admission"), toggleWaitlist(false)
- "Make a music festival with VIP tickets and waitlist" → setEventName("Music Festival"), setEventDescription("A celebration of music and arts"), setTicketName("VIP"), toggleWaitlist(true)

Always respond naturally and explain what you're doing.`,
                },
                ...this.conversationHistory,
                {
                    role: 'user',
                    content: userInput,
                },
            ]

            // Call OpenAI with function calling
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: messages,
                functions: this.getAvailableFunctions(),
                function_call: 'auto',
                temperature: this.temperature,
                max_tokens: this.maxTokens,
            })

            const message = response.choices[0].message
            const results = []

            // Handle function calls
            if (message.function_call) {
                const functionName = message.function_call.name
                const functionArgs = JSON.parse(message.function_call.arguments)

                console.log(`🎫 AI calling: ${functionName}`, functionArgs)

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
            }

            // Update conversation history
            this.conversationHistory.push(
                { role: 'user', content: userInput },
                { role: 'assistant', content: message.content || 'Event updated successfully!' }
            )

            // Limit conversation history for cost control
            if (this.conversationHistory.length > this.maxHistoryLength * 2) {
                this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength * 2)
            }

            return {
                success: true,
                message: message.content || 'Event updated successfully!',
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
                'setTicketName',
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
