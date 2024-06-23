const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function request(url: string, method: HttpMethod, data?: any) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include', // This is important for handling cookies, which may include your session info
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_HOST}${url}`, config);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    return response.text();
  }
}

const apiService = {
  get: (url: string) => request(url, 'GET'),
  post: (url: string, data: any) => request(url, 'POST', data),
  put: (url: string, data: any) => request(url, 'PUT', data),
  delete: (url: string, data?: any) => request(url, 'DELETE', data),
};

export default apiService;