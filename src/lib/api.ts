const API_BASE = 'http://localhost:3001/api';

// Token management
export const getToken = () => localStorage.getItem('auth_token');
export const setToken = (token: string) => localStorage.setItem('auth_token', token);
export const removeToken = () => localStorage.removeItem('auth_token');

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && endpoint !== '/auth/register' && endpoint !== '/auth/login') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data;
  },

  register: async (email: string, password: string, role: string = 'STAFF') => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  },

  getMe: async () => {
    return apiCall('/me');
  },

  logout: () => {
    removeToken();
  },
};

// Homepage API
export const homepageAPI = {
  getCurrent: async () => {
    return apiCall('/homepage/current');
  },

  createDraft: async () => {
    return apiCall('/homepage/draft', {
      method: 'POST',
    });
  },

  updateDraft: async (id: number, data: any) => {
    return apiCall(`/homepage/draft/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  },

  publish: async (id: number) => {
    return apiCall(`/homepage/${id}/publish`, {
      method: 'POST',
    });
  },
};

// Leads API
export const leadsAPI = {
  create: async (lead: {
    full_name?: string;
    email?: string;
    phone?: string;
    source?: string;
    message?: string;
    utm?: any;
  }) => {
    return apiCall('/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    });
  },

  list: async (filters: {
    status?: string;
    q?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });
    return apiCall(`/leads?${params.toString()}`);
  },

  get: async (id: number) => {
    return apiCall(`/leads/${id}`);
  },

  update: async (id: number, updates: { status?: string; tags?: string[] }) => {
    return apiCall(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  addNote: async (id: number, note: string) => {
    return apiCall(`/leads/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
  },

  exportCSV: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE}/leads/export.csv`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Export failed');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  },
};

// Analytics API
export const analyticsAPI = {
  getLeadsSummary: async (days: number = 30) => {
    return apiCall(`/analytics/leads-summary?days=${days}`);
  },
};

// Audit API
export const auditAPI = {
  list: async (limit: number = 100) => {
    return apiCall(`/audit?limit=${limit}`);
  },
};

export default { authAPI, homepageAPI, leadsAPI, analyticsAPI, auditAPI };

