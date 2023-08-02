import jwtDecode from "jwt-decode";

// Function to check if the token has expired
export const isTokenExpired = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    
    // Get the expiration time in seconds
    const expirationTime = decodedToken.exp;
    // Get the current time in seconds
    const currentTime = Math.floor(Date.now() / 1000);

    return currentTime > expirationTime;
  } catch (error) {
    return true; // If there's an error decoding the token, consider it as expired
  }
};

export const isLoggedIn = () => {
    const accessToken = localStorage.getItem("accessToken");
    return !!accessToken;
};


// Function to check if user isAdmin
export const isAdmin = () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const decodedToken = jwtDecode(accessToken);
      
      if (decodedToken.isAdmin) {
        return true;
      }else{
        return false;
      }
  
    } catch (error) {
      return true; // If there's an error decoding the token, consider it as expired
    }
  };