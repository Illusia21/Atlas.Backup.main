/**
 * Clears localStorage and redirects user to login
 */
export function logout() {
    localStorage.clear();
    window.location.href = '/login';
}