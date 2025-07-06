/**
 * AI Manipulation Registry
 *
 * This file contains ALL methods that the AI is allowed to execute.
 * This serves as a security boundary and clear contract for what the AI can manipulate.
 *
 * IMPORTANT: Only methods defined in this registry can be executed by the AI.
 * This provides enterprise-level security and clear audit trails.
 */

/**
 * Available UI element types that can be manipulated by AI
 */
export const ELEMENT_TYPES = {
    BUTTON: 'button',
    CARD: 'card',
    COUNTER: 'counter',
    IMAGE: 'image',
    STORY: 'story',
}

/**
 * Available theme names for AI theme manipulation
 */
export const THEME_NAMES = {
    SPACE: 'space',
    OCEAN: 'ocean',
    FOREST: 'forest',
    SUNSET: 'sunset',
    MAGICAL: 'magical',
    CORPORATE: 'corporate',
    DEFAULT: 'default',
}

/**
 * Available color schemes for UI elements
 */
export const COLOR_SCHEMES = {
    PURPLE: 'purple',
    BLUE: 'blue',
    GREEN: 'green',
    RED: 'red',
    GOLD: 'gold',
    MAGIC: 'magic',
}

/**
 * Available story element types
 */
export const STORY_TYPES = {
    TITLE: 'title',
    PARAGRAPH: 'paragraph',
    CHARACTER: 'character',
}

/**
 * Registry of all AI-manipulable methods
 *
 * Each method in this registry:
 * - Has a clear, descriptive name
 * - Includes parameter validation
 * - Provides security through controlled execution
 * - Logs all actions for audit trails
 */
export class AIManipulationRegistry {
    constructor(uiState) {
        this.uiState = uiState
        this.actionLog = []

        // Validate required state properties
        this.validateUIState()
    }

    /**
     * Validate that the UI state has all required properties
     */
    validateUIState() {
        const required = [
            'elements',
            'storyElements',
            'counters',
            'backgroundStyle',
        ]
        const missing = required.filter((prop) => !(prop in this.uiState))

        if (missing.length > 0) {
            throw new Error(
                `Missing required UI state properties: ${missing.join(', ')}`
            )
        }
    }

    /**
     * Log an action for audit trail
     */
    logAction(method, params, result) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            method,
            params: JSON.stringify(params),
            result: result ? 'success' : 'failed',
            id: Date.now() + Math.random(),
        }

        this.actionLog.push(logEntry)
        console.log(`🤖 AI Action: ${method}`, logEntry)

        // Keep only last 100 actions for memory management
        if (this.actionLog.length > 100) {
            this.actionLog = this.actionLog.slice(-100)
        }
    }

    /**
     * Get all available methods that AI can execute
     * This is the complete contract of what AI can do
     */
    getAvailableMethods() {
        return {
            // UI Element Creation Methods
            addButton: this.addButton.bind(this),
            addCard: this.addCard.bind(this),
            addCounter: this.addCounter.bind(this),
            addImage: this.addImage.bind(this),
            addStoryElement: this.addStoryElement.bind(this),

            // State Manipulation Methods
            incrementCounter: this.incrementCounter.bind(this),
            changeBackground: this.changeBackground.bind(this),
            setTheme: this.setTheme.bind(this),

            // Utility Methods (read-only)
            getElementCount: this.getElementCount.bind(this),
            getActiveTheme: this.getActiveTheme.bind(this),
            getActionLog: this.getActionLog.bind(this),
        }
    }

    /**
     * Add a button element to the interface
     *
     * @param {string} text - The button text (required)
     * @param {number} id - Unique identifier (auto-generated if not provided)
     * @param {object} style - Style configuration
     * @param {string} style.color - Button color theme
     * @param {string} style.size - Button size (small, medium, large)
     * @param {string} style.theme - Visual theme
     * @returns {number} - The button ID
     */
    addButton(text = 'New Button', id = Date.now(), style = {}) {
        try {
            // Input validation
            if (!text || typeof text !== 'string') {
                throw new Error('Button text must be a non-empty string')
            }

            if (text.length > 100) {
                throw new Error('Button text must be 100 characters or less')
            }

            // Validate color if provided
            if (
                style.color &&
                !Object.values(COLOR_SCHEMES).includes(style.color)
            ) {
                style.color = COLOR_SCHEMES.PURPLE // Default fallback
            }

            const buttonElement = {
                type: ELEMENT_TYPES.BUTTON,
                id,
                text: text.trim(),
                style: {
                    color: style.color || COLOR_SCHEMES.PURPLE,
                    size: style.size || 'medium',
                    theme: style.theme || 'default',
                    ...style,
                },
                visible: true,
                createdAt: new Date().toISOString(),
            }

            this.uiState.elements.value.push(buttonElement)
            this.logAction('addButton', { text, id, style }, true)

            return id
        } catch (error) {
            this.logAction('addButton', { text, id, style }, false)
            console.error('Failed to add button:', error.message)
            throw error
        }
    }

    /**
     * Add a card element to the interface
     *
     * @param {string} title - Card title (required)
     * @param {string} content - Card content (required)
     * @param {number} id - Unique identifier (auto-generated if not provided)
     * @param {object} style - Style configuration
     * @returns {number} - The card ID
     */
    addCard(title, content, id = Date.now(), style = {}) {
        try {
            // Input validation
            if (!title || typeof title !== 'string') {
                throw new Error('Card title must be a non-empty string')
            }

            if (!content || typeof content !== 'string') {
                throw new Error('Card content must be a non-empty string')
            }

            if (title.length > 200) {
                throw new Error('Card title must be 200 characters or less')
            }

            if (content.length > 1000) {
                throw new Error('Card content must be 1000 characters or less')
            }

            const cardElement = {
                type: ELEMENT_TYPES.CARD,
                id,
                title: title.trim(),
                content: content.trim(),
                style: {
                    color: style.color || COLOR_SCHEMES.BLUE,
                    theme: style.theme || 'default',
                    ...style,
                },
                visible: true,
                createdAt: new Date().toISOString(),
            }

            this.uiState.elements.value.push(cardElement)
            this.logAction('addCard', { title, content, id, style }, true)

            return id
        } catch (error) {
            this.logAction('addCard', { title, content, id, style }, false)
            console.error('Failed to add card:', error.message)
            throw error
        }
    }

    /**
     * Add a counter element to the interface
     *
     * @param {string} label - Counter label (required)
     * @param {number} id - Unique identifier (auto-generated if not provided)
     * @param {object} style - Style configuration
     * @returns {number} - The counter ID
     */
    addCounter(label = 'Counter', id = Date.now(), style = {}) {
        try {
            // Input validation
            if (!label || typeof label !== 'string') {
                throw new Error('Counter label must be a non-empty string')
            }

            if (label.length > 100) {
                throw new Error('Counter label must be 100 characters or less')
            }

            const counterElement = {
                type: ELEMENT_TYPES.COUNTER,
                id,
                label: label.trim(),
                style: {
                    color: style.color || COLOR_SCHEMES.GREEN,
                    theme: style.theme || 'default',
                    ...style,
                },
                visible: true,
                createdAt: new Date().toISOString(),
            }

            this.uiState.elements.value.push(counterElement)

            // Initialize counter value
            if (!this.uiState.counters[id]) {
                this.uiState.counters[id] = 0
            }

            this.logAction('addCounter', { label, id, style }, true)

            return id
        } catch (error) {
            this.logAction('addCounter', { label, id, style }, false)
            console.error('Failed to add counter:', error.message)
            throw error
        }
    }

    /**
     * Add an image element to the interface
     *
     * @param {string} content - Image content (emoji or text representation)
     * @param {string} alt - Alternative text description
     * @param {number} id - Unique identifier (auto-generated if not provided)
     * @param {object} style - Style configuration
     * @returns {number} - The image ID
     */
    addImage(
        content = '🖼️',
        alt = 'AI Generated Image',
        id = Date.now(),
        style = {}
    ) {
        try {
            // Input validation
            if (!content || typeof content !== 'string') {
                throw new Error('Image content must be a non-empty string')
            }

            if (!alt || typeof alt !== 'string') {
                throw new Error('Image alt text must be a non-empty string')
            }

            if (content.length > 50) {
                throw new Error('Image content must be 50 characters or less')
            }

            if (alt.length > 200) {
                throw new Error('Image alt text must be 200 characters or less')
            }

            const imageElement = {
                type: ELEMENT_TYPES.IMAGE,
                id,
                content: content.trim(),
                alt: alt.trim(),
                style: {
                    color: style.color || COLOR_SCHEMES.PURPLE,
                    theme: style.theme || 'default',
                    ...style,
                },
                visible: true,
                createdAt: new Date().toISOString(),
            }

            this.uiState.elements.value.push(imageElement)
            this.logAction('addImage', { content, alt, id, style }, true)

            return id
        } catch (error) {
            this.logAction('addImage', { content, alt, id, style }, false)
            console.error('Failed to add image:', error.message)
            throw error
        }
    }

    /**
     * Add a story element to the interface
     *
     * @param {string} type - Type of story element (title, paragraph, character)
     * @param {string} content - Story content
     * @param {number} id - Unique identifier (auto-generated if not provided)
     * @returns {number} - The story element ID
     */
    addStoryElement(type, content, id = Date.now()) {
        try {
            // Input validation
            if (!type || !Object.values(STORY_TYPES).includes(type)) {
                throw new Error(
                    `Story type must be one of: ${Object.values(STORY_TYPES).join(', ')}`
                )
            }

            if (!content || typeof content !== 'string') {
                throw new Error('Story content must be a non-empty string')
            }

            if (content.length > 2000) {
                throw new Error('Story content must be 2000 characters or less')
            }

            const storyElement = {
                type: ELEMENT_TYPES.STORY,
                storyType: type,
                id,
                content: content.trim(),
                timestamp: new Date().toISOString(),
                createdAt: new Date().toISOString(),
            }

            this.uiState.storyElements.value.push(storyElement)
            this.logAction('addStoryElement', { type, content, id }, true)

            return id
        } catch (error) {
            this.logAction('addStoryElement', { type, content, id }, false)
            console.error('Failed to add story element:', error.message)
            throw error
        }
    }

    /**
     * Increment a counter value
     *
     * @param {number} id - Counter ID to increment
     * @param {number} amount - Amount to increment by (default: 1)
     * @returns {number} - New counter value
     */
    incrementCounter(id, amount = 1) {
        try {
            // Input validation
            if (!id) {
                throw new Error('Counter ID is required')
            }

            if (typeof amount !== 'number' || amount < 0) {
                throw new Error('Increment amount must be a positive number')
            }

            if (amount > 1000) {
                throw new Error('Increment amount cannot exceed 1000')
            }

            // Initialize counter if it doesn't exist
            if (!this.uiState.counters[id]) {
                this.uiState.counters[id] = 0
            }

            const oldValue = this.uiState.counters[id]
            this.uiState.counters[id] += amount

            this.logAction(
                'incrementCounter',
                { id, amount, oldValue, newValue: this.uiState.counters[id] },
                true
            )

            return this.uiState.counters[id]
        } catch (error) {
            this.logAction('incrementCounter', { id, amount }, false)
            console.error('Failed to increment counter:', error.message)
            throw error
        }
    }

    /**
     * Change the background style of the interface
     *
     * @param {string} style - CSS style string for background
     * @returns {string} - Applied style
     */
    changeBackground(style) {
        try {
            // Input validation
            if (!style || typeof style !== 'string') {
                throw new Error('Background style must be a non-empty string')
            }

            if (style.length > 500) {
                throw new Error(
                    'Background style must be 500 characters or less'
                )
            }

            // Basic CSS injection protection
            const dangerous = [
                'javascript:',
                'data:',
                'vbscript:',
                'onload',
                'onerror',
                '<script',
            ]
            const hasDangerous = dangerous.some((pattern) =>
                style.toLowerCase().includes(pattern.toLowerCase())
            )

            if (hasDangerous) {
                throw new Error(
                    'Background style contains potentially dangerous content'
                )
            }

            this.uiState.backgroundStyle.value = style
            this.logAction('changeBackground', { style }, true)

            return style
        } catch (error) {
            this.logAction('changeBackground', { style }, false)
            console.error('Failed to change background:', error.message)
            throw error
        }
    }

    /**
     * Apply a predefined theme to the interface
     *
     * @param {string} themeName - Name of the theme to apply
     * @returns {string} - Applied theme name
     */
    setTheme(themeName) {
        try {
            // Input validation
            if (!themeName || !Object.values(THEME_NAMES).includes(themeName)) {
                throw new Error(
                    `Theme must be one of: ${Object.values(THEME_NAMES).join(', ')}`
                )
            }

            const themes = {
                [THEME_NAMES.SPACE]:
                    'background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
                [THEME_NAMES.OCEAN]:
                    'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                [THEME_NAMES.FOREST]:
                    'background: linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
                [THEME_NAMES.SUNSET]:
                    'background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                [THEME_NAMES.MAGICAL]:
                    'background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                [THEME_NAMES.CORPORATE]:
                    'background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                [THEME_NAMES.DEFAULT]: '',
            }

            const themeStyle = themes[themeName] || themes[THEME_NAMES.DEFAULT]
            this.changeBackground(themeStyle)

            this.logAction('setTheme', { themeName, themeStyle }, true)

            return themeName
        } catch (error) {
            this.logAction('setTheme', { themeName }, false)
            console.error('Failed to set theme:', error.message)
            throw error
        }
    }

    /**
     * Get count of elements by type (read-only utility)
     *
     * @param {string} elementType - Type of element to count
     * @returns {number} - Count of elements
     */
    getElementCount(elementType = null) {
        try {
            if (!elementType) {
                return (
                    this.uiState.elements.value.length +
                    this.uiState.storyElements.value.length
                )
            }

            if (elementType === ELEMENT_TYPES.STORY) {
                return this.uiState.storyElements.value.length
            }

            return this.uiState.elements.value.filter(
                (el) => el.type === elementType
            ).length
        } catch (error) {
            console.error('Failed to get element count:', error.message)
            return 0
        }
    }

    /**
     * Get current active theme (read-only utility)
     *
     * @returns {string} - Current theme identifier
     */
    getActiveTheme() {
        try {
            const currentStyle = this.uiState.backgroundStyle.value

            // Match current style to known themes
            for (const [themeName, themeStyle] of Object.entries({
                [THEME_NAMES.SPACE]:
                    'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
                [THEME_NAMES.OCEAN]:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                [THEME_NAMES.FOREST]:
                    'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
                [THEME_NAMES.SUNSET]:
                    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                [THEME_NAMES.MAGICAL]:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                [THEME_NAMES.CORPORATE]:
                    'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            })) {
                if (currentStyle.includes(themeStyle)) {
                    return themeName
                }
            }

            return THEME_NAMES.DEFAULT
        } catch (error) {
            console.error('Failed to get active theme:', error.message)
            return THEME_NAMES.DEFAULT
        }
    }

    /**
     * Get action log for audit purposes (read-only utility)
     *
     * @param {number} limit - Maximum number of entries to return
     * @returns {Array} - Array of log entries
     */
    getActionLog(limit = 50) {
        try {
            return this.actionLog.slice(-limit)
        } catch (error) {
            console.error('Failed to get action log:', error.message)
            return []
        }
    }

    /**
     * Clear all elements (for demo reset purposes)
     *
     * @returns {boolean} - Success status
     */
    clearAllElements() {
        try {
            const beforeCount = this.getElementCount()

            this.uiState.elements.value = []
            this.uiState.storyElements.value = []

            // Clear all counters
            Object.keys(this.uiState.counters).forEach((key) => {
                delete this.uiState.counters[key]
            })

            this.uiState.backgroundStyle.value = ''

            this.logAction('clearAllElements', { beforeCount }, true)

            return true
        } catch (error) {
            this.logAction('clearAllElements', {}, false)
            console.error('Failed to clear elements:', error.message)
            return false
        }
    }
}

/**
 * Create a new AI manipulation registry instance
 *
 * @param {object} uiState - The UI state object containing reactive references
 * @returns {AIManipulationRegistry} - Registry instance
 */
export function createAIManipulationRegistry(uiState) {
    return new AIManipulationRegistry(uiState)
}

/**
 * Export default configuration for easy access
 */
export default {
    ELEMENT_TYPES,
    THEME_NAMES,
    COLOR_SCHEMES,
    STORY_TYPES,
    AIManipulationRegistry,
    createAIManipulationRegistry,
}
