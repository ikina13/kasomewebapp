// Mock authentication API for offline development
export const authAPI = {
  async login(phoneNumber: string, password: string) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful login
    if (phoneNumber && password) {
      return {
        status: "success",
        message: "Login successful! (Offline Mode)",
        token: "mock_jwt_token_" + Date.now(),
        user: {
          id: "1",
          phone: phoneNumber,
          name: "Test User",
          email: "test@example.com",
        },
      }
    }

    return {
      status: "error",
      message: "Invalid credentials",
    }
  },

  async register(userData: any) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      status: "success",
      message: "Registration successful! (Offline Mode)",
      token: "mock_jwt_token_" + Date.now(),
      user: {
        id: "1",
        ...userData,
      },
    }
  },

  async logout() {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      status: "success",
      message: "Logged out successfully",
    }
  },
}
