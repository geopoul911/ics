export const apiRequest = async (method, endpoint, data = null, isBlob = false) => {
  const headers = {
    'User-Token': localStorage.getItem('user-token'),
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };

  if (!isBlob) {
    headers['Content-Type'] = 'application/json';
  }

  const options = {
    method,
    headers,
    credentials: 'same-origin',
    cache: 'no-store'
  };

  if (data && !isBlob) {
    options.body = JSON.stringify(data);
  } else if (data) {
    options.body = data;
  }

  const response = await fetch(endpoint, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || 'Request failed');
  }

  if (isBlob) {
    return response.blob();
  }

  return response.json();
}; 