/**
 * AI Manipulation Registry - Event Creation Tool
 *
 * This file contains ALL methods that the AI is allowed to execute for event creation.
 * This serves as a security boundary and clear contract for what the AI can manipulate.
 *
 * IMPORTANT: Only methods defined in this registry can be executed by the AI.
 * This provides enterprise-level security and clear audit trails.
 *
 * EVENT CREATION SCOPE: Only 4 methods for creating and managing events
 */

/**
 * Available event types that can be created
 */
export const EVENT_TYPES = {
    CONFERENCE: 'conference',
    WORKSHOP: 'workshop',
    FESTIVAL: 'festival',
    MEETUP: 'meetup',
    SEMINAR: 'seminar',
    CONCERT: 'concert',
    TRAINING: 'training',
    NETWORKING: 'networking',
}

/**
 * Available ticket types for events
 */
export const TICKET_TYPES = {
    GENERAL: 'General Admission',
    VIP: 'VIP',
    EARLY_BIRD: 'Early Bird',
    STUDENT: 'Student',
    PREMIUM: 'Premium',
    STANDARD: 'Standard',
}

/**
 * Registry of AI-manipulable event creation methods
 *
 * Each method in this registry:
 * - Has a clear, descriptive name for event creation
 * - Includes parameter validation
 * - Provides security through controlled execution
 * - Logs all actions for audit trails
 *
 * SCOPE: Only 4 methods for event creation tool
 */
export class AIManipulationRegistry {
    constructor(eventState) {
        this.eventState = eventState
        this.actionLog = []

        // Validate required state properties for events
        this.validateEventState()
    }

    /**
     * Validate that the event state has all required properties
     */
    validateEventState() {
        const required = [
            'eventName',
            'eventDescription', 
            'ticketName',
            'waitlistEnabled'
        ]
        const missing = required.filter((prop) => !(prop in this.eventState))

        if (missing.length > 0) {
            throw new Error(
                `Missing required event state properties: ${missing.join(', ')}`
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
        console.log(`🎫 Event AI Action: ${method}`, logEntry)

        // Keep only last 100 actions for memory management
        if (this.actionLog.length > 100) {
            this.actionLog = this.actionLog.slice(-100)
        }
    }

    /**
     * Get all available methods that AI can execute
     * This is the complete contract of what AI can do - ONLY 4 EVENT METHODS
     */
    getAvailableMethods() {
        return {
            // Event Creation Methods (ONLY THESE 4)
            setEventName: this.setEventName.bind(this),
            setEventDescription: this.setEventDescription.bind(this),
            setTicketName: this.setTicketName.bind(this),
            toggleWaitlist: this.toggleWaitlist.bind(this),
        }
    }

    /**
     * Set the event name
     *
     * @param {string} name - The event name (required)
     * @returns {boolean} - Success status
     */
    setEventName(name) {
        try {
            // Validation
            if (!name || typeof name !== 'string') {
                throw new Error('Event name must be a non-empty string')
            }

            if (name.length < 3 || name.length > 100) {
                throw new Error('Event name must be between 3 and 100 characters')
            }

            // Sanitize input
            const sanitizedName = name.trim().replace(/[<>]/g, '')

            // Update state
            this.eventState.eventName.value = sanitizedName

            this.logAction('setEventName', { name: sanitizedName }, true)
            return true
        } catch (error) {
            console.error('Error setting event name:', error)
            this.logAction('setEventName', { name }, false)
            throw error
        }
    }

    /**
     * Set the event description
     *
     * @param {string} description - The event description (required)
     * @returns {boolean} - Success status
     */
    setEventDescription(description) {
        try {
            // Validation
            if (!description || typeof description !== 'string') {
                throw new Error('Event description must be a non-empty string')
            }

            if (description.length < 10 || description.length > 500) {
                throw new Error('Event description must be between 10 and 500 characters')
            }

            // Sanitize input
            const sanitizedDescription = description.trim().replace(/[<>]/g, '')

            // Update state
            this.eventState.eventDescription.value = sanitizedDescription

            this.logAction('setEventDescription', { description: sanitizedDescription }, true)
            return true
        } catch (error) {
            console.error('Error setting event description:', error)
            this.logAction('setEventDescription', { description }, false)
            throw error
        }
    }

    /**
     * Set the ticket name/type
     *
     * @param {string} name - The ticket name (defaults to "General Admission")
     * @returns {boolean} - Success status
     */
    setTicketName(name = 'General Admission') {
        try {
            // Validation
            if (typeof name !== 'string') {
                throw new Error('Ticket name must be a string')
            }

            if (name.length < 2 || name.length > 50) {
                throw new Error('Ticket name must be between 2 and 50 characters')
            }

            // Sanitize input
            const sanitizedName = name.trim().replace(/[<>]/g, '')

            // Update state
            this.eventState.ticketName.value = sanitizedName

            this.logAction('setTicketName', { name: sanitizedName }, true)
            return true
        } catch (error) {
            console.error('Error setting ticket name:', error)
            this.logAction('setTicketName', { name }, false)
            throw error
        }
    }

    /**
     * Toggle waitlist on/off
     *
     * @param {boolean} enabled - Whether waitlist should be enabled (defaults to false)
     * @returns {boolean} - Success status
     */
    toggleWaitlist(enabled = false) {
        try {
            // Validation
            if (typeof enabled !== 'boolean') {
                throw new Error('Waitlist enabled must be a boolean')
            }

            // Update state
            this.eventState.waitlistEnabled.value = enabled

            this.logAction('toggleWaitlist', { enabled }, true)
            return true
        } catch (error) {
            console.error('Error toggling waitlist:', error)
            this.logAction('toggleWaitlist', { enabled }, false)
            throw error
        }
    }

    /**
     * Get the action log for debugging (read-only utility method)
     */
    getActionLog() {
        return [...this.actionLog] // Return copy to prevent external modification
    }

    /**
     * Get current event state (read-only utility method)
     */
    getEventState() {
        return {
            eventName: this.eventState.eventName.value,
            eventDescription: this.eventState.eventDescription.value,
            ticketName: this.eventState.ticketName.value,
            waitlistEnabled: this.eventState.waitlistEnabled.value,
        }
    }
}

/**
 * Create a new AI manipulation registry instance for event creation
 *
 * @param {object} eventState - The event state object containing reactive references
 * @returns {AIManipulationRegistry} - Registry instance
 */
export function createAIManipulationRegistry(eventState) {
    return new AIManipulationRegistry(eventState)
}

/**
 * Export default configuration for easy access
 */
export default {
    EVENT_TYPES,
    TICKET_TYPES,
    AIManipulationRegistry,
    createAIManipulationRegistry,
}
