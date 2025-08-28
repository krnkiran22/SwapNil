interface LeatherProvider {
  request: (method: string, params?: any) => Promise<any>;
}

interface Window {
  LeatherProvider?: LeatherProvider;
}