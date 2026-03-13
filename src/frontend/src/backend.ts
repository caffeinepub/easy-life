// Stub backend for when the Motoko canister is not compiled
// Replace with actual generated backend when available

export type CreateActorOptions = {
  agentOptions?: Record<string, unknown>;
  agent?: unknown;
  processError?: (e: unknown) => never;
};

export class ExternalBlob {
  static fromURL(url: string) {
    return new ExternalBlob(url);
  }
  constructor(public url: string) {}
  async getBytes(): Promise<Uint8Array> { return new Uint8Array(); }
  onProgress?: (progress: number) => void;
}

export interface backendInterface {
  _initializeAccessControlWithSecret(token: string): Promise<void>;
  getCallerUserProfile(): Promise<UserProfile | null>;
  saveCallerUserProfile(profile: UserProfile): Promise<void>;
  isStripeConfigured(): Promise<boolean>;
  setStripeConfiguration(config: StripeConfiguration): Promise<void>;
  createCheckoutSession(items: ShoppingItem[], successUrl: string, cancelUrl: string): Promise<string>;
}

export type UserProfile = {
  name: string;
  email: string;
};

export type StripeConfiguration = {
  secretKey: string;
  allowedCountries: string[];
};

export type ShoppingItem = {
  name: string;
  price: number;
  quantity: number;
};

export function createActor(
  _canisterId: string,
  _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
  _downloadFile: (bytes: Uint8Array) => Promise<ExternalBlob>,
  _options?: CreateActorOptions,
): backendInterface {
  // Return a stub implementation
  return {
    _initializeAccessControlWithSecret: async () => {},
    getCallerUserProfile: async () => null,
    saveCallerUserProfile: async () => {},
    isStripeConfigured: async () => false,
    setStripeConfiguration: async () => {},
    createCheckoutSession: async () => JSON.stringify({ id: "mock", url: "" }),
  };
}
