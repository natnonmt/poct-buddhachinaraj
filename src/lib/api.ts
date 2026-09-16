const API_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

export async function poctApi(action: string, data: any = {}) {
  try {
    // For GET requests (reads), we use query params
    if (['getEquipment', 'getIQC', 'getDashboardStats'].includes(action)) {
      const query = new URLSearchParams({ action, ...data }).toString();
      const response = await fetch(`${API_URL}?${query}`);
      const result = await response.json();
      if (result.status === 'error') throw new Error(result.message);
      return result.data || result.stats;
    }

    // For POST requests (writes), we send JSON body
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // GAS requires text/plain to avoid CORS preflight in some cases
      },
      body: JSON.stringify({ action, ...data }),
    });
    const result = await response.json();
    if (result.status === 'error') throw new Error(result.message);
    return result;
  } catch (error: any) {
    console.error(`API Error (${action}):`, error);
    throw error;
  }
}
