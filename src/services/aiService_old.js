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
            {
                name: 'addCard',
                description: 'Create a card component with title and content',
                parameters: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            description: 'The title of the card',
                        },
                        content: {
                            type: 'string',
                            description: 'The main content text of the card',
                        },
                        id: {
                            type: 'number',
                            description: 'Unique identifier for the card',
                        },
                        style: {
                            type: 'object',
                            properties: {
                                color: {
                                    type: 'string',
                                    enum: Object.values(COLOR_SCHEMES),
                                    description: 'The color theme for the card',
                                },
                            },
                        },
                    },
                    required: ['title', 'content'],
                },
            },
            {
                name: 'addCounter',
                description: 'Add a counter component with a label',
                parameters: {
                    type: 'object',
                    properties: {
                        label: {
                            type: 'string',
                            description: 'The label text for the counter',
                        },
                        id: {
                            type: 'number',
                            description: 'Unique identifier for the counter',
                        },
                        style: {
                            type: 'object',
                            properties: {
                                color: {
                                    type: 'string',
                                    enum: Object.values(COLOR_SCHEMES),
                                    description:
                                        'The color theme for the counter',
                                },
                            },
                        },
                    },
                    required: ['label'],
                },
            },
            {
                name: 'addImage',
                description: 'Add an image or visual element to the interface',
                parameters: {
                    type: 'object',
                    properties: {
                        content: {
                            type: 'string',
                            description:
                                'The image content (emoji or text representation)',
                        },
                        alt: {
                            type: 'string',
                            description:
                                'Alternative text description for the image',
                        },
                        id: {
                            type: 'number',
                            description: 'Unique identifier for the image',
                        },
                        style: {
                            type: 'object',
                            properties: {
                                color: {
                                    type: 'string',
                                    enum: Object.values(COLOR_SCHEMES),
                                    description:
                                        'The color theme for the image background',
                                },
                            },
                        },
                    },
                    required: ['content', 'alt'],
                },
            },
            {
                name: 'addStoryElement',
                description:
                    'Add narrative elements like titles, paragraphs, or character descriptions',
                parameters: {
                    type: 'object',
                    properties: {
                        type: {
                            type: 'string',
                            enum: Object.values(STORY_TYPES),
                            description: 'The type of story element',
                        },
                        content: {
                            type: 'string',
                            description:
                                'The text content of the story element',
                        },
                        id: {
                            type: 'number',
                            description:
                                'Unique identifier for the story element',
                        },
                    },
                    required: ['type', 'content'],
                },
            },
            {
                name: 'incrementCounter',
                description: 'Increment the value of an existing counter',
                parameters: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                            description: 'The ID of the counter to increment',
                        },
                        amount: {
                            type: 'number',
                            description: 'Amount to increment by (default: 1)',
                            minimum: 1,
                            maximum: 1000,
                        },
                    },
                    required: ['id'],
                },
            },
            {
                name: 'changeBackground',
                description: 'Change the background style of the interface',
                parameters: {
                    type: 'object',
                    properties: {
                        style: {
                            type: 'string',
                            description: 'CSS style string for the background',
                        },
                    },
                    required: ['style'],
                },
            },
            {
                name: 'setTheme',
                description: 'Apply a predefined theme to the interface',
                parameters: {
                    type: 'object',
                    properties: {
                        themeName: {
                            type: 'string',
                            enum: Object.values(THEME_NAMES),
                            description: 'The name of the theme to apply',
                        },
                    },
                    required: ['themeName'],
                },
            },
        ]
    }

    /**
     * Create system prompt for AI that understands our UI context
     */
    getSystemPrompt() {
        return `You are an AI assistant that helps users create and manipulate user interfaces through natural language commands. You can ONLY execute predefined UI manipulation functions from the secure registry - you cannot run arbitrary code or access external systems.

SECURITY RESTRICTION: You can only call functions defined in the AI Manipulation Registry. These functions are:
${this.getAvailableFunctions()
    .map((f) => `- ${f.name}: ${f.description}`)
    .join('\n')}

Available UI manipulation capabilities:
- Add interactive buttons with various colors (${Object.values(COLOR_SCHEMES).join(', ')})
- Create information cards with titles and content  
- Add counters for tracking progress or metrics
- Place images or visual elements with emojis
- Generate story elements (${Object.values(STORY_TYPES).join(', ')})
- Change background themes (${Object.values(THEME_NAMES).join(', ')})
- Increment existing counters

When a user requests UI changes, analyze their intent and call the appropriate registry functions with suitable parameters. For creative requests (like "create a magical story" or "build a pirate adventure"), break down the request into multiple function calls to create a cohesive experience.

Always choose appropriate colors, text, and styling that match the user's intent. For themed requests (space, ocean, magical, etc.), use consistent color schemes and appropriate visual elements.

Be creative but stay within the bounds of the available registry functions. If a user requests something that cannot be accomplished with the available functions, explain what you can do instead.

IMPORTANT: All function calls will be validated against the registry for security.`
    }

    /**
     * Process a natural language command using OpenAI
     * AI can only execute methods from the manipulation registry
     */
    async processCommand(command, manipulationRegistry) {
        try {
            if (!this.isInitialized) {
                throw new Error(
                    'OpenAI client not initialized. Check your API key.'
                )
            }

            console.log('🤖 Processing command with AI:', command)

            // Validate that we have a registry with secure methods
            if (
                !manipulationRegistry ||
                typeof manipulationRegistry.getAvailableMethods !== 'function'
            ) {
                throw new Error('Invalid manipulation registry provided')
            }

            // Check session limits for cost control
            if (this.requestCount >= this.sessionLimit) {
                throw new Error(
                    `Session request limit reached (${this.sessionLimit} requests). Please refresh to continue.`
                )
            }

            this.requestCount++

            // Add user message to conversation history
            this.addToHistory('user', command)

            // Prepare messages for OpenAI
            const messages = [
                { role: 'system', content: this.getSystemPrompt() },
                ...this.conversationHistory.slice(-this.maxHistoryLength),
                { role: 'user', content: command },
            ]

            // Call OpenAI with function calling and cost controls
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: messages,
                functions: this.getAvailableFunctions(),
                function_call: 'auto',
                temperature: this.temperature,
                max_tokens: this.maxTokens, // Limit token usage for cost control
            })

            const message = response.choices[0].message

            // If AI wants to call functions, execute them via registry
            if (message.function_call) {
                await this.executeFunctionCall(
                    message.function_call,
                    manipulationRegistry
                )
                this.addToHistory(
                    'assistant',
                    `Executed: ${message.function_call.name}`
                )
            } else if (message.content) {
                // If AI responds with text, add story element via registry
                const registryMethods =
                    manipulationRegistry.getAvailableMethods()
                registryMethods.addStoryElement('paragraph', message.content)
                this.addToHistory('assistant', message.content)
            }

            return {
                success: true,
                message: 'Command processed successfully',
            }
        } catch (error) {
            console.error('❌ AI processing error:', error)
            throw error
        }
    }

    /**
     * Execute a function call from OpenAI via the secure manipulation registry
     */
    async executeFunctionCall(functionCall, manipulationRegistry) {
        const { name, arguments: args } = functionCall

        try {
            const parsedArgs = JSON.parse(args)
            console.log(`🚀 Executing ${name} with args:`, parsedArgs)

            // Get registry methods (this is the security boundary)
            const registryMethods = manipulationRegistry.getAvailableMethods()

            // Validate that the function exists in the registry
            if (
                !registryMethods[name] ||
                typeof registryMethods[name] !== 'function'
            ) {
                throw new Error(
                    `Function ${name} is not available in the manipulation registry`
                )
            }

            // Generate ID if not provided for functions that need it
            if (
                !parsedArgs.id &&
                [
                    'addButton',
                    'addCard',
                    'addCounter',
                    'addImage',
                    'addStoryElement',
                ].includes(name)
            ) {
                parsedArgs.id = Date.now() + Math.random()
            }

            // Execute the function through the registry (security enforced here)
            switch (name) {
                case 'addButton':
                    registryMethods.addButton(
                        parsedArgs.text,
                        parsedArgs.id,
                        parsedArgs.style || {}
                    )
                    break
                case 'addCard':
                    registryMethods.addCard(
                        parsedArgs.title,
                        parsedArgs.content,
                        parsedArgs.id,
                        parsedArgs.style || {}
                    )
                    break
                case 'addCounter':
                    registryMethods.addCounter(
                        parsedArgs.label,
                        parsedArgs.id,
                        parsedArgs.style || {}
                    )
                    break
                case 'addImage':
                    registryMethods.addImage(
                        parsedArgs.content,
                        parsedArgs.alt,
                        parsedArgs.id,
                        parsedArgs.style || {}
                    )
                    break
                case 'addStoryElement':
                    registryMethods.addStoryElement(
                        parsedArgs.type,
                        parsedArgs.content,
                        parsedArgs.id
                    )
                    break
                case 'incrementCounter':
                    registryMethods.incrementCounter(
                        parsedArgs.id,
                        parsedArgs.amount
                    )
                    break
                case 'changeBackground':
                    registryMethods.changeBackground(parsedArgs.style)
                    break
                case 'setTheme':
                    registryMethods.setTheme(parsedArgs.themeName)
                    break
                default:
                    throw new Error(
                        `Function ${name} is not implemented in the execution handler`
                    )
            }
        } catch (error) {
            console.error(`❌ Error executing ${name}:`, error)
            throw error // Re-throw to handle in calling function
        }
    }

    /**
     * Add message to conversation history
     */
    addToHistory(role, content) {
        this.conversationHistory.push({ role, content })

        // Keep history within limits
        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory = this.conversationHistory.slice(
                -this.maxHistoryLength
            )
        }
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = []
    }

    /**
     * Get usage statistics for cost monitoring
     */
    getUsageStats() {
        return {
            requestCount: this.requestCount,
            sessionLimit: this.sessionLimit,
            remainingRequests: this.sessionLimit - this.requestCount,
            model: this.model,
            maxTokens: this.maxTokens,
        }
    }

    /**
     * Reset usage counter (call this at start of new session)
     */
    resetUsage() {
        this.requestCount = 0
        console.log('🔄 Usage counter reset')
    }
}

// Export singleton instance
export default new AIService()
