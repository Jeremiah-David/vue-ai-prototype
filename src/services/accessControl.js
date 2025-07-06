/**
 * Simple Access Control for Coworker Demo
 * Enterprise-ready: Can be extended with JWT, OAuth, or integrated with company SSO
 */

export class AccessControl {
  constructor() {
    this.isAuthenticated = false
    this.sessionKey = 'aialpha_access_token'
    this.validPasswords = [
      'demo2025',           // Simple demo password
      'aialpha-preview',    // Project-specific password
      'team-access'         // Team password
    ]
  }

  /**
   * Check if user is already authenticated
   */
  checkAuthentication() {
    const token = sessionStorage.getItem(this.sessionKey)
    if (token) {
      // In enterprise: validate JWT token, check expiry, verify with server
      this.isAuthenticated = this.validateToken(token)
    }
    return this.isAuthenticated
  }

  /**
   * Authenticate user with password
   */
  authenticate(password) {
    if (this.validPasswords.includes(password)) {
      // In enterprise: generate JWT token, set proper expiry
      const token = this.generateToken(password)
      sessionStorage.setItem(this.sessionKey, token)
      this.isAuthenticated = true
      return true
    }
    return false
  }

  /**
   * Log out user
   */
  logout() {
    sessionStorage.removeItem(this.sessionKey)
    this.isAuthenticated = false
  }

  /**
   * Generate simple token (enterprise: use proper JWT)
   */
  generateToken(password) {
    return btoa(`${password}:${Date.now()}`)
  }

  /**
   * Validate token (enterprise: verify JWT signature, check expiry)
   */
  validateToken(token) {
    try {
      const decoded = atob(token)
      const [password, timestamp] = decoded.split(':')
      const tokenAge = Date.now() - parseInt(timestamp)
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours

      return this.validPasswords.includes(password) && tokenAge < maxAge
    } catch {
      return false
    }
  }

  /**
   * Enterprise extension points:
   * - integrate with company LDAP/Active Directory
   * - add role-based access (admin, viewer, editor)
   * - implement proper JWT with RS256 signing
   * - add audit logging
   * - integrate with company SSO (SAML, OAuth2)
   */
}
