import API_URL from './environment';

// Check that the cookie is valid.
async function isAuthenticated() {
  try {
    const response = await fetch(`${API_URL}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

export default isAuthenticated;
