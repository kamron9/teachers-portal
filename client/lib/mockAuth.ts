// Simple mock authentication state for testing without backend

let currentMockUser: any = null;
let authToken: string | null = null;

export const mockAuthState = {
  getCurrentUser: () => currentMockUser,
  getToken: () => authToken,
  setCurrentUser: (user: any) => {
    currentMockUser = user;
    if (user) {
      authToken = "mock-token-" + Date.now();
      localStorage.setItem("authToken", authToken);
    } else {
      authToken = null;
      localStorage.removeItem("authToken");
    }
  },
  isAuthenticated: () => !!currentMockUser && !!authToken,
  logout: () => {
    currentMockUser = null;
    authToken = null;
    localStorage.removeItem("authToken");
  },
};

// Initialize from localStorage on startup
const storedToken = localStorage.getItem("authToken");
if (storedToken) {
  authToken = storedToken;
  // Set default mock user
  currentMockUser = {
    id: "user-1",
    firstName: "Kamron",
    lastName: "Alimov",
    email: "kamron@example.com",
    role: "student",
    profileImage: "/placeholder.svg",
    phoneNumber: "+998901234567",
    bio: "Dasturlashni o'rganayotgan talaba",
    languages: ["O'zbek", "Ingliz", "Rus"],
    createdAt: "2024-01-15T10:00:00Z",
  };
}
