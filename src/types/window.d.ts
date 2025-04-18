type EthereumEventType = 'connect' | 'disconnect' | 'accountsChanged' | 'chainChanged' | 'message';

interface RequestArguments {
  method: string;
  params?: unknown[] | Record<string, unknown>;
}

interface Window {
  ethereum?: {
    isMetaMask: boolean;
    request: (args: RequestArguments) => Promise<unknown>;
    on: (event: EthereumEventType, callback: (params: unknown) => void) => void;
    removeListener: (event: EthereumEventType, callback: (params: unknown) => void) => void;
    addListener: (event: EthereumEventType, callback: (params: unknown) => void) => void;
  };
}

