/**
 * @file auth.js
 * @description Handles user authentication logic for registration and login using the Noroff API.
 * @module auth
 */

const BASE_URL = "https://v2.api.noroff.dev";
const REGISTER_URL = `${BASE_URL}/auth/register`;
const LOGIN_URL = `${BASE_URL}/auth/login`;

/**
 * API request headers
 * @constant {Object}
 */
const headers = {
  "Content-Type": "application/json",
  "X-Noroff-API-Key": "e6f16bc6-a633-40af-ad6b-db10b065d4e2",
};

/**
 * Registers a new user using the Noroff Auth API.
 * @async
 * @function registerUser
 * @param {Object} user - User information
 * @param {string} user.name - The user's full name
 * @param {string} user.email - The user's email (must end with @stud.noroff.no)
 * @param {string} user.password - The user's password (min. 8 characters)
 * @returns {Promise<Object>} The registered user data or error object
 * @throws {Error} If registration fails or the API returns an error
 */
export async function registerUser({ name, email, password }) {
  try {
    const response = await fetch(REGISTER_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || "Registration failed.");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Logs in an existing user using the Noroff Auth API.
 * @async
 * @function loginUser
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @returns {Promise<Object>} Login response containing access token and user data
 * @throws {Error} If login fails or the API returns an error
 */
export async function loginUser(email, password) {
  try {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || "Login failed.");
    }

    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.data));

    const token = localStorage.getItem("accessToken");
    if (token) {
      const creditsResponse = await fetch('https://v2.api.noroff.dev/auction/user/credits', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Noroff-API-Key': "1d6d6a25-2013-4a8e-9a20-f8e10b64f3a8",
        }
      });

      const creditsData = await creditsResponse.json();
      if (creditsData && creditsData.credits) {
        return { ...data, credits: creditsData.credits };
      }
    }

    return data; 
  } catch (error) {
    throw error;
  }
}