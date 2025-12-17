export type AuthRequest = {
  headers: {
    authorization?: string;
    Authorization?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};
