import OpenAI from 'openai'

/**
 * Real AI Service using OpenAI API for UI Manipulation
 * This service uses OpenAI's function calling to execute only predefined UI methods
 * for controlled, secure AI-driven interface manipulation.
 */
class AIService {
  constructor() {
    this.client = null
    this.isInitialized = false
    this.model = import.meta.env.VITE_AI_MODEL || 'gpt-4o-mini'  // Default to cheapest
    this.temperature = parseFloat(import.meta.env.VITE_AI_TEMPERATURE) || 0.7
    this.maxTokens = parseInt(import.meta.env.VITE_AI_MAX_TOKENS) || 300
    this.mode = import.meta.env.VITE_AI_MODE || 'mock'
    
    // Context storage for conversation continuity
    this.conversationHistory = []
    this.maxHistoryLength = parseInt(import.meta.env.VITE_AI_CONVERSATION_LIMIT) || 5  // Reduced for cost
    
    // Usage tracking for cost control
    this.requestCount = 0
    this.sessionLimit = 100  // Max requests per session
    
    this.initializeClient()
  }

  /**
   * Initialize OpenAI client
   */
  initializeClient() {
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY
      
      if (!apiKey || apiKey === 'your_openai_api_key_here') {
        console.warn('⚠️ OpenAI API key not configured. Using mock mode.')
        this.mode = 'mock'
        return
      }

      this.client = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
      })
      
      this.isInitialized = true
      console.log('✅ OpenAI client initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize OpenAI client:', error)
      this.mode = 'mock'
    }
  }

  /**
   * Define the available UI manipulation functions for OpenAI
   * These correspond exactly to our Vue component methods
   */
  getAvailableFunctions() {
    return [
      {
        name: 'addButton',
        description: 'Add a button to the interface with specified text, styling, and interactions',
        parameters: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'The text to display on the button'
            },
            id: {
              type: 'number',
              description: 'Unique identifier for the button (auto-generated if not provided)'
            },
            style: {
              type: 'object',
              properties: {
                color: {
                  type: 'string',
                  enum: ['purple', 'blue', 'green', 'red', 'gold', 'magic'],
                  description: 'The color theme for the button'
                },
                size: {
                  type: 'string',
                  enum: ['small', 'medium', 'large'],
                  description: 'The size of the button'
                },
                theme: {
                  type: 'string',
                  description: 'The visual theme style'
                }
              }
            }
          },
          required: ['text']
        }
      },
      {
        name: 'addCard',
        description: 'Create a card component with title and content',
        parameters: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'The title of the card'
            },
            content: {
              type: 'string',
              description: 'The main content text of the card'
            },
            id: {
              type: 'number',
              description: 'Unique identifier for the card'
            },
            style: {
              type: 'object',
              properties: {
                color: {
                  type: 'string',
                  enum: ['blue', 'purple', 'green', 'red'],
                  description: 'The color theme for the card'
                }
              }
            }
          },
          required: ['title', 'content']
        }
      },
      {
        name: 'addCounter',
        description: 'Add a counter component with a label',
        parameters: {
          type: 'object',
          properties: {
            label: {
              type: 'string',
              description: 'The label text for the counter'
            },
            id: {
              type: 'number',
              description: 'Unique identifier for the counter'
            },
            style: {
              type: 'object',
              properties: {
                color: {
                  type: 'string',
                  enum: ['green', 'blue', 'purple', 'gold'],
                  description: 'The color theme for the counter'
                }
              }
            }
          },
          required: ['label']
        }
      },
      {
        name: 'addImage',
        description: 'Add an image or visual element to the interface',
        parameters: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'The image content (emoji or text representation)'
            },
            alt: {
              type: 'string',
              description: 'Alternative text description for the image'
            },
            id: {
              type: 'number',
              description: 'Unique identifier for the image'
            },
            style: {
              type: 'object',
              properties: {
                color: {
                  type: 'string',
                  enum: ['purple', 'blue', 'green', 'space'],
                  description: 'The color theme for the image background'
                }
              }
            }
          },
          required: ['content', 'alt']
        }
      },
      {
        name: 'addStoryElement',
        description: 'Add narrative elements like titles, paragraphs, or character descriptions',
        parameters: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['title', 'paragraph', 'character'],
              description: 'The type of story element'
            },
            content: {
              type: 'string',
              description: 'The text content of the story element'
            },
            id: {
              type: 'number',
              description: 'Unique identifier for the story element'
            }
          },
          required: ['type', 'content']
        }
      },
      {
        name: 'incrementCounter',
        description: 'Increment the value of an existing counter',
        parameters: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              description: 'The ID of the counter to increment'
            }
          },
          required: ['id']
        }
      },
      {
        name: 'changeBackground',
        description: 'Change the background style of the interface',
        parameters: {
          type: 'object',
          properties: {
            style: {
              type: 'string',
              description: 'CSS style string for the background'
            }
          },
          required: ['style']
        }
      },
      {
        name: 'setTheme',
        description: 'Apply a predefined theme to the interface',
        parameters: {
          type: 'object',
          properties: {
            themeName: {
              type: 'string',
              enum: ['space', 'ocean', 'forest', 'sunset', 'magical', 'corporate', 'default'],
              description: 'The name of the theme to apply'
            }
          },
          required: ['themeName']
        }
      }
    ]
  }

  /**
   * Create system prompt for AI that understands our UI context
   */
  getSystemPrompt() {
    return `You are an AI assistant that helps users create and manipulate user interfaces through natural language commands. You can only execute predefined UI manipulation functions - you cannot run arbitrary code or access external systems.

Available UI manipulation capabilities:
- Add interactive buttons with various colors and styles
- Create information cards with titles and content
- Add counters for tracking progress or metrics
- Place images or visual elements
- Generate story elements (titles, paragraphs, character descriptions)
- Change background themes and colors
- Increment existing counters

When a user requests UI changes, analyze their intent and call the appropriate functions with suitable parameters. For creative requests (like "create a magical story" or "build a pirate adventure"), break down the request into multiple function calls to create a cohesive experience.

Always choose appropriate colors, text, and styling that match the user's intent. For themed requests (space, ocean, magical, etc.), use consistent color schemes and appropriate visual elements.

Be creative but stay within the bounds of the available functions. If a user requests something that cannot be accomplished with the available functions, explain what you can do instead.`
  }

  /**
   * Process a natural language command using OpenAI
   */
  async processCommand(command, uiMethods) {
    try {
      if (this.mode === 'mock' || !this.isInitialized) {
        console.log('🔄 Using mock AI processor (OpenAI not configured)')
        return await this.mockProcessor(command, uiMethods)
      }

      console.log('🤖 Processing command with real AI:', command)

      // Check session limits for cost control
      if (this.requestCount >= this.sessionLimit) {
        console.warn('⚠️ Session request limit reached. Using mock mode for cost control.')
        return await this.mockProcessor(command, uiMethods)
      }

      this.requestCount++

      // Add user message to conversation history
      this.addToHistory('user', command)

      // Prepare messages for OpenAI
      const messages = [
        { role: 'system', content: this.getSystemPrompt() },
        ...this.conversationHistory.slice(-this.maxHistoryLength),
        { role: 'user', content: command }
      ]

      // Call OpenAI with function calling and cost controls
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages,
        functions: this.getAvailableFunctions(),
        function_call: 'auto',
        temperature: this.temperature,
        max_tokens: this.maxTokens  // Limit token usage for cost control
      })

      const message = response.choices[0].message

      // If AI wants to call functions, execute them
      if (message.function_call) {
        await this.executeFunctionCall(message.function_call, uiMethods)
        this.addToHistory('assistant', `Executed: ${message.function_call.name}`)
      } else if (message.content) {
        // If AI responds with text, add story element
        uiMethods.addStoryElement('paragraph', message.content)
        this.addToHistory('assistant', message.content)
      }

      return {
        success: true,
        message: 'Command processed successfully'
      }

    } catch (error) {
      console.error('❌ AI processing error:', error)
      
      // Fallback to mock processor on error
      console.log('🔄 Falling back to mock processor')
      return await this.mockProcessor(command, uiMethods)
    }
  }

  /**
   * Execute a function call from OpenAI
   */
  async executeFunctionCall(functionCall, uiMethods) {
    const { name, arguments: args } = functionCall
    
    try {
      const parsedArgs = JSON.parse(args)
      console.log(`🚀 Executing ${name} with args:`, parsedArgs)

      // Generate ID if not provided
      if (!parsedArgs.id && ['addButton', 'addCard', 'addCounter', 'addImage', 'addStoryElement'].includes(name)) {
        parsedArgs.id = Date.now() + Math.random()
      }

      // Execute the function
      switch (name) {
        case 'addButton':
          uiMethods.addButton(parsedArgs.text, parsedArgs.id, parsedArgs.style || {})
          break
        case 'addCard':
          uiMethods.addCard(parsedArgs.title, parsedArgs.content, parsedArgs.id, parsedArgs.style || {})
          break
        case 'addCounter':
          uiMethods.addCounter(parsedArgs.label, parsedArgs.id, parsedArgs.style || {})
          break
        case 'addImage':
          uiMethods.addImage(parsedArgs.content, parsedArgs.alt, parsedArgs.id, parsedArgs.style || {})
          break
        case 'addStoryElement':
          uiMethods.addStoryElement(parsedArgs.type, parsedArgs.content, parsedArgs.id)
          break
        case 'incrementCounter':
          uiMethods.incrementCounter(parsedArgs.id)
          break
        case 'changeBackground':
          uiMethods.changeBackground(parsedArgs.style)
          break
        case 'setTheme':
          uiMethods.setTheme(parsedArgs.themeName)
          break
        default:
          console.warn(`Unknown function: ${name}`)
      }
    } catch (error) {
      console.error(`Error executing ${name}:`, error)
    }
  }

  /**
   * Add message to conversation history
   */
  addToHistory(role, content) {
    this.conversationHistory.push({ role, content })
    
    // Keep history within limits
    if (this.conversationHistory.length > this.maxHistoryLength) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength)
    }
  }

  /**
   * Mock processor for fallback when OpenAI is not available
   */
  async mockProcessor(command, uiMethods) {
    console.log('🔄 Using mock AI processor')
    const cmd = command.toLowerCase()

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Story creation commands
    if (cmd.includes('story') || cmd.includes('tale') || cmd.includes('adventure')) {
      if (cmd.includes('pirate')) {
        await this.createPirateStoryMock(uiMethods)
      } else if (cmd.includes('space') || cmd.includes('galaxy')) {
        await this.createSpaceStoryMock(uiMethods)
      } else if (cmd.includes('magic') || cmd.includes('wizard') || cmd.includes('fairy')) {
        await this.createMagicalStoryMock(uiMethods)
      } else {
        await this.createGenericStoryMock(uiMethods)
      }
    }
    // Button creation commands
    else if (cmd.includes('button')) {
      const colors = ['purple', 'blue', 'green', 'red', 'gold', 'magic']
      const color = colors.find(c => cmd.includes(c)) || 'purple'
      const text = this.extractTextFromCommand(cmd, 'button') || 'AI Generated Button'
      uiMethods.addButton(text, Date.now(), { color })
    }
    // Background/theme commands
    else if (cmd.includes('background') || cmd.includes('theme')) {
      if (cmd.includes('space') || cmd.includes('stars')) {
        uiMethods.setTheme('space')
      } else if (cmd.includes('ocean') || cmd.includes('blue')) {
        uiMethods.setTheme('ocean')
      } else if (cmd.includes('magic') || cmd.includes('purple')) {
        uiMethods.setTheme('magical')
      } else if (cmd.includes('sunset') || cmd.includes('orange')) {
        uiMethods.setTheme('sunset')
      } else if (cmd.includes('forest') || cmd.includes('green')) {
        uiMethods.setTheme('forest')
      }
    }
    // Counter commands
    else if (cmd.includes('counter') || cmd.includes('count')) {
      const label = this.extractTextFromCommand(cmd, 'counter') || 'Progress Counter'
      const color = cmd.includes('blue') ? 'blue' : cmd.includes('green') ? 'green' : 'purple'
      uiMethods.addCounter(label, Date.now(), { color })
    }
    // Card commands
    else if (cmd.includes('card') || cmd.includes('dashboard')) {
      const title = this.extractTextFromCommand(cmd, 'card') || 'AI Generated Card'
      const content = `This ${title.toLowerCase()} was created by AI based on your command.`
      uiMethods.addCard(title, content, Date.now(), { color: 'blue' })
    }
    // Default response
    else {
      uiMethods.addStoryElement('paragraph', `AI processed: "${command}" - Try commands like "create a magical story", "add purple buttons", or "change to space theme"`)
    }

    return { success: true, message: 'Command processed (mock mode)' }
  }

  // Mock story generators (simplified versions)
  async createPirateStoryMock(uiMethods) {
    uiMethods.setTheme('ocean')
    await new Promise(resolve => setTimeout(resolve, 300))
    uiMethods.addStoryElement('title', '🏴‍☠️ The Treasure of Captain Blackbeard')
    await new Promise(resolve => setTimeout(resolve, 500))
    uiMethods.addButton('🗝️ Find Treasure', Date.now(), { color: 'gold' })
    uiMethods.addCounter('Treasure Found', Date.now(), { color: 'gold' })
  }

  async createSpaceStoryMock(uiMethods) {
    uiMethods.setTheme('space')
    await new Promise(resolve => setTimeout(resolve, 300))
    uiMethods.addStoryElement('title', '🚀 Mission to Alpha Centauri')
    await new Promise(resolve => setTimeout(resolve, 500))
    uiMethods.addButton('🚀 Launch', Date.now(), { color: 'blue' })
    uiMethods.addCounter('Light Years', Date.now(), { color: 'blue' })
  }

  async createMagicalStoryMock(uiMethods) {
    uiMethods.setTheme('magical')
    await new Promise(resolve => setTimeout(resolve, 300))
    uiMethods.addStoryElement('title', '🧙‍♂️ The Academy of Mystic Arts')
    await new Promise(resolve => setTimeout(resolve, 500))
    uiMethods.addButton('✨ Cast Spell', Date.now(), { color: 'magic' })
    uiMethods.addCounter('Spells Mastered', Date.now(), { color: 'purple' })
  }

  async createGenericStoryMock(uiMethods) {
    uiMethods.addStoryElement('title', '📖 An AI-Generated Adventure')
    await new Promise(resolve => setTimeout(resolve, 500))
    uiMethods.addButton('Continue Story', Date.now(), { color: 'purple' })
  }

  // Helper function to extract text from commands
  extractTextFromCommand(command, type) {
    const patterns = {
      button: /(?:button.*?["']([^"']+)["'])|(?:button\s+(?:that\s+says\s+|saying\s+|with\s+text\s+)?["']?([^"'\n]+)["']?)/i,
      counter: /(?:counter.*?["']([^"']+)["'])|(?:counter\s+(?:for\s+|called\s+|labeled\s+)?["']?([^"'\n]+)["']?)/i,
      card: /(?:card.*?["']([^"']+)["'])|(?:card\s+(?:for\s+|called\s+|titled\s+)?["']?([^"'\n]+)["']?)/i
    }

    const match = command.match(patterns[type])
    return match ? (match[1] || match[2])?.trim() : null
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = []
  }

  /**
   * Get current AI mode
   */
  getMode() {
    return this.mode
  }

  /**
   * Check if real AI is available
   */
  isRealAIAvailable() {
    return this.isInitialized && this.mode === 'real'
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
      maxTokens: this.maxTokens
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
