// Save token to localStorage
export const saveToken = (token) => {
    if (token) {
      localStorage.setItem("token", token);
    }
  };
  
  // Get token from localStorage
  export const getToken = () => {
    return localStorage.getItem("token");
  };
  
  // Remove token (logout)
  export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Optional: clear saved user info if stored
  };
  
  // Save user info (optional, for easy access in frontend)
  export const saveUser = (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  };
  
  // Get user info (optional)
  export const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  };
  