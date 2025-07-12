// API service for frontend-backend communication
const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;

    // Load token from localStorage on initialization
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("authToken");
    }
  }

  // Helper method to make API requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "API request failed");
      }

      return data;
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  // Auth methods
  async register(userData) {
    const response = await this.makeRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async login(credentials) {
    const response = await this.makeRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout() {
    try {
      await this.makeRequest("/auth/logout", { method: "POST" });
    } finally {
      this.clearToken();
    }
  }

  async getProfile() {
    return this.makeRequest("/auth/me");
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  }

  // Question methods
  async getQuestions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/questions?${queryString}` : "/questions";
    return this.makeRequest(endpoint);
  }

  async getQuestion(id) {
    return this.makeRequest(`/questions/${id}`);
  }

  async createQuestion(questionData) {
    return this.makeRequest("/questions", {
      method: "POST",
      body: JSON.stringify(questionData),
    });
  }

  async updateQuestion(id, questionData) {
    return this.makeRequest(`/questions/${id}`, {
      method: "PUT",
      body: JSON.stringify(questionData),
    });
  }

  async deleteQuestion(id) {
    return this.makeRequest(`/questions/${id}`, {
      method: "DELETE",
    });
  }

  // Answer methods
  async getAnswers(questionId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `/answers/question/${questionId}?${queryString}`
      : `/answers/question/${questionId}`;
    return this.makeRequest(endpoint);
  }

  async createAnswer(questionId, answerData) {
    return this.makeRequest(`/answers/question/${questionId}`, {
      method: "POST",
      body: JSON.stringify(answerData),
    });
  }

  async updateAnswer(answerId, answerData) {
    return this.makeRequest(`/answers/${answerId}`, {
      method: "PUT",
      body: JSON.stringify(answerData),
    });
  }

  async deleteAnswer(answerId) {
    return this.makeRequest(`/answers/${answerId}`, {
      method: "DELETE",
    });
  }

  // Vote methods
  async voteAnswer(answerId, voteType) {
    return this.makeRequest(`/votes/answer/${answerId}`, {
      method: "POST",
      body: JSON.stringify({ voteType }),
    });
  }

  async removeVote(answerId) {
    return this.makeRequest(`/votes/answer/${answerId}`, {
      method: "DELETE",
    });
  }

  // Tag methods
  async getTags(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/tags?${queryString}` : "/tags";
    return this.makeRequest(endpoint);
  }

  async getPopularTags(limit = 20) {
    return this.makeRequest(`/tags/popular?limit=${limit}`);
  }

  async searchTags(query, limit = 10) {
    return this.makeRequest(
      `/tags/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
  }

  // Health check
  async healthCheck() {
    return this.makeRequest("/health");
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
