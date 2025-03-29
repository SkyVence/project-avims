/**
 * Get a cookie value by name
 * @param name The name of the cookie to retrieve
 * @returns The cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') {
    return null; // Return null in server-side rendering
  }

  const cookieString = document.cookie;
  const cookies = cookieString.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    // Check if this cookie string begins with the name we want
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }

  return null;
}

/**
 * Set a cookie with the given name and value
 * @param name The name of the cookie
 * @param value The value to store
 * @param daysToExpire Number of days until the cookie expires
 */
export function setCookie(name: string, value: string, daysToExpire: number = 365): void {
  if (typeof window === 'undefined') {
    return; // Do nothing in server-side rendering
  }

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + daysToExpire);

  const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
  document.cookie = cookieValue;
}

/**
 * Delete a cookie by name
 * @param name The name of the cookie to delete
 */
export function deleteCookie(name: string): void {
  if (typeof window === 'undefined') {
    return; // Do nothing in server-side rendering
  }

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
} 