// IP Info Service
// Fetches IP address and ISP information

interface IPInfoResponse {
  ip: string;
  isp?: string;
  org?: string;
  hostname?: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  postal?: string;
  timezone?: string;
}

/**
 * Fetches IP address and ISP information using ipinfo.io API
 * @returns Promise with IP information
 */
export const fetchIPInfo = async (): Promise<IPInfoResponse> => {
  try {
    // Using ipinfo.io which provides basic IP info without requiring an API key
    const response = await fetch('https://ipinfo.io/json');
    
    if (!response.ok) {
      throw new Error('Failed to fetch IP information');
    }
    
    const data: IPInfoResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching IP information:', error);
    // Return at least the IP address from client-side if API fails
    return { 
      ip: 'Unable to fetch IP',
      isp: 'Unable to fetch ISP'
    };
  }
};

/**
 * Alternative method to get just the IP address if the main service fails
 * @returns Promise with just the IP address
 */
export const fetchIPAddressOnly = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    
    if (!response.ok) {
      throw new Error('Failed to fetch IP address');
    }
    
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return 'Unable to fetch IP';
  }
};
