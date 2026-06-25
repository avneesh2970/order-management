export const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }

  
};