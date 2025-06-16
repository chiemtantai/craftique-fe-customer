import { jwtDecode } from "jwt-decode";

export function getUserIdFromToken(token: string) {
  try {
    const decodedToken = jwtDecode<{ 
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
    }>(token);

    return decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
}

export function getRoleFromToken(token: string) {
  try {
    const decodedToken = jwtDecode<{ 
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
    }>(token);

    return decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
}

export function getNameFromToken(token: string) {
  try {
    const decodedToken = jwtDecode<{ 
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
    }>(token);

    return decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
}