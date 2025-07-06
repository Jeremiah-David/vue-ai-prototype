/**
 * AI Manipulation Registry Test Suite
 * 
 * This file demonstrates how to test the AI manipulation registry
 * and validate that it works correctly.
 */

import { createAIManipulationRegistry, ELEMENT_TYPES, THEME_NAMES, COLOR_SCHEMES, STORY_TYPES } from '../src/services/aiManipulationRegistry.js'
import { ref, reactive } from 'vue'

/**
 * Test Suite for AI Manipulation Registry
 */
export class RegistryTestSuite {
    constructor() {
        this.testResults = []
        this.setupTestEnvironment()
    }

    setupTestEnvironment() {
        // Create test UI state
        this.testUIState = {
          elements: ref([]),
          storyElements: ref([]),
          counters: reactive({}),
          backgroundStyle: ref('')
        }

        // Create registry instance
        this.registry = createAIManipulationRegistry(this.testUIState)
        this.methods = this.registry.getAvailableMethods()
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🧪 Starting AI Manipulation Registry Tests...')
        
        try {
          await this.testButtonCreation()
          await this.testCardCreation()
          await this.testCounterOperations()
          await this.testImageCreation()
          await this.testStoryElements()
          await this.testThemeOperations()
          await this.testInputValidation()
          await this.testSecurityFeatures()
          await this.testAuditTrail()
          
          this.printResults()
        } catch (error) {
          console.error('❌ Test suite failed:', error)
        }
    }

    /**
     * Test button creation functionality
     */
    async testButtonCreation() {
        const testName = 'Button Creation'
        
        try {
          // Test basic button creation
          const buttonId = this.methods.addButton('Test Button', 12345, { color: COLOR_SCHEMES.PURPLE })
          
          // Verify button was added to state
          const button = this.testUIState.elements.value.find(el => el.id === 12345)
          
          if (button && button.text === 'Test Button' && button.type === ELEMENT_TYPES.BUTTON) {
            this.recordTest(testName, 'PASS', 'Button created successfully')
          } else {
            this.recordTest(testName, 'FAIL', 'Button not found in state')
          }
        } catch (error) {
          this.recordTest(testName, 'FAIL', error.message)
        }
    }

    /**
     * Test card creation functionality
     */
    async testCardCreation() {
        const testName = 'Card Creation'
        
        try {
          const cardId = this.methods.addCard('Test Card', 'This is test content', 54321, { color: COLOR_SCHEMES.BLUE })
          
          const card = this.testUIState.elements.value.find(el => el.id === 54321)
          
          if (card && card.title === 'Test Card' && card.type === ELEMENT_TYPES.CARD) {
            this.recordTest(testName, 'PASS', 'Card created successfully')
          } else {
            this.recordTest(testName, 'FAIL', 'Card not found in state')
          }
        } catch (error) {
          this.recordTest(testName, 'FAIL', error.message)
        }
    }

    /**
     * Test counter operations
     */
    async testCounterOperations() {
        const testName = 'Counter Operations'
        
        try {
          // Create counter
          const counterId = this.methods.addCounter('Test Counter', 98765, { color: COLOR_SCHEMES.GREEN })
          
          // Increment counter
          const newValue = this.methods.incrementCounter(98765, 5)
          
          if (this.testUIState.counters[98765] === 5 && newValue === 5) {
            this.recordTest(testName, 'PASS', 'Counter operations work correctly')
          } else {
            this.recordTest(testName, 'FAIL', `Expected 5, got ${this.testUIState.counters[98765]}`)
          }
        } catch (error) {
          this.recordTest(testName, 'FAIL', error.message)
        }
    }

    /**
     * Test image creation
     */
    async testImageCreation() {
        const testName = 'Image Creation'
        
        try {
          const imageId = this.methods.addImage('🚀', 'Rocket emoji', 11111, { color: COLOR_SCHEMES.MAGIC })
          
          const image = this.testUIState.elements.value.find(el => el.id === 11111)
          
          if (image && image.content === '🚀' && image.type === ELEMENT_TYPES.IMAGE) {
            this.recordTest(testName, 'PASS', 'Image created successfully')
          } else {
            this.recordTest(testName, 'FAIL', 'Image not found in state')
          }
        } catch (error) {
          this.recordTest(testName, 'FAIL', error.message)
        }
    }

    /**
     * Test story elements
     */
    async testStoryElements() {
        const testName = 'Story Elements'
        
        try {
          const storyId = this.methods.addStoryElement(STORY_TYPES.TITLE, 'Test Story Title', 22222)
          
          const story = this.testUIState.storyElements.value.find(el => el.id === 22222)
          
          if (story && story.content === 'Test Story Title' && story.storyType === STORY_TYPES.TITLE) {
            this.recordTest(testName, 'PASS', 'Story element created successfully')
          } else {
            this.recordTest(testName, 'FAIL', 'Story element not found in state')
          }
        } catch (error) {
          this.recordTest(testName, 'FAIL', error.message)
        }
    }

    /**
     * Test theme operations
     */
    async testThemeOperations() {
        const testName = 'Theme Operations'
        
        try {
          this.methods.setTheme(THEME_NAMES.SPACE)
          
          const currentTheme = this.methods.getActiveTheme()
          
          if (currentTheme === THEME_NAMES.SPACE) {
            this.recordTest(testName, 'PASS', 'Theme operations work correctly')
          } else {
            this.recordTest(testName, 'FAIL', `Expected ${THEME_NAMES.SPACE}, got ${currentTheme}`)
          }
        } catch (error) {
          this.recordTest(testName, 'FAIL', error.message)
        }
    }

    /**
     * Test input validation
     */
    async testInputValidation() {
        const testName = 'Input Validation'
        
        try {
          // Test invalid button text (empty)
          let errorCaught = false
          try {
            this.methods.addButton('', 99999)
          } catch (error) {
            errorCaught = true
          }
          
          if (errorCaught) {
            this.recordTest(testName, 'PASS', 'Input validation works correctly')
          } else {
            this.recordTest(testName, 'FAIL', 'Invalid input was accepted')
          }
        } catch (error) {
          this.recordTest(testName, 'FAIL', error.message)
        }
    }

    /**
     * Test security features
     */
    async testSecurityFeatures() {
        const testName = 'Security Features'
        
        try {
          // Test CSS injection protection
          let errorCaught = false
          try {
            this.methods.changeBackground('background: url(javascript:alert("hack"))')
          } catch (error) {
            errorCaught = true
          }
          
          if (errorCaught) {
            this.recordTest(testName, 'PASS', 'Security protection works correctly')
          } else {
            this.recordTest(testName, 'FAIL', 'Dangerous input was accepted')
          }
        } catch (error) {
          this.recordTest(testName, 'FAIL', error.message)
        }
    }

    /**
     * Test audit trail
     */
    async testAuditTrail() {
        const testName = 'Audit Trail'
        
        try {
          const logBefore = this.methods.getActionLog().length
          
          // Perform an action
          this.methods.addButton('Audit Test', 88888)
          
          const logAfter = this.methods.getActionLog().length
          
          if (logAfter > logBefore) {
            this.recordTest(testName, 'PASS', 'Audit trail is working')
          } else {
            this.recordTest(testName, 'FAIL', 'Action was not logged')
          }
        } catch (error) {
          this.recordTest(testName, 'FAIL', error.message)
        }
    }

    /**
     * Record test result
     */
    recordTest(testName, status, message) {
        this.testResults.push({
          test: testName,
          status,
          message,
          timestamp: new Date().toISOString()
        })
        
        const emoji = status === 'PASS' ? '✅' : '❌'
        console.log(`${emoji} ${testName}: ${message}`)
    }

    /**
     * Print test results summary
     */
    printResults() {
        const passed = this.testResults.filter(r => r.status === 'PASS').length
        const failed = this.testResults.filter(r => r.status === 'FAIL').length
        const total = this.testResults.length
        
        console.log('\n📊 Test Results Summary:')
        console.log(`✅ Passed: ${passed}/${total}`)
        console.log(`❌ Failed: ${failed}/${total}`)
        console.log(`📈 Success Rate: ${((passed/total) * 100).toFixed(1)}%`)
        
        if (failed === 0) {
          console.log('\n🎉 All tests passed! The AI Manipulation Registry is working correctly.')
        } else {
          console.log('\n⚠️ Some tests failed. Please review the registry implementation.')
        }
    }

    /**
     * Get element count for testing
     */
    getElementCount() {
        return this.methods.getElementCount()
    }

    /**
     * Clear all elements for clean testing
     */
    clearAll() {
        return this.registry.clearAllElements()
    }
}

/**
 * Manual test function for browser console
 */
window.testAIRegistry = async () => {
    const testSuite = new RegistryTestSuite()
    await testSuite.runAllTests()
    return testSuite
}

// Export for module usage
export default RegistryTestSuite
