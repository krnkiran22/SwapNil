import { 
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  uintCV,
  stringAsciiCV,
  principalCV,
  fetchCallReadOnlyFunction,
  cvToJSON,
} from '@stacks/transactions';

import { STACKS_TESTNET } from '@stacks/network';

// Contract details - UPDATE AFTER DEPLOYMENT
const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // Replace with actual deployed address
const CONTRACT_NAME = 'ai-storage';
const NETWORK = STACKS_TESTNET;

export interface AIRequest {
  user: string;
  requestId: number;
  request: string;
  timestamp: number;
  response?: string;
}

export class AIStorageContract {
  
  /**
   * Save a user's AI request to the blockchain
   * NOTE: This requires the contract to be deployed first
   */
  static async saveRequest(request: string, senderKey: string): Promise<string | null> {
    try {
      // For now, return a mock transaction ID until contract is deployed
      console.log('📝 Saving request to blockchain:', request);
      
      // Simulate blockchain storage
      const mockTxId = '0x' + Math.random().toString(16).substr(2, 64);
      
      // TODO: Uncomment after contract deployment
      /*
      const txOptions = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'save-request',
        functionArgs: [stringAsciiCV(request)],
        senderKey,
        network: NETWORK,
        anchorMode: AnchorMode.Any,
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResponse = await broadcastTransaction(transaction, NETWORK);
      
      if (broadcastResponse.error) {
        throw new Error(`Transaction failed: ${broadcastResponse.error}`);
      }
      
      return broadcastResponse.txid;
      */
      
      return mockTxId;
    } catch (error) {
      console.error('Error saving request to blockchain:', error);
      return null;
    }
  }

  /**
   * Save AI response to a user's request
   */
  static async saveResponse(
    userAddress: string, 
    requestId: number, 
    response: string, 
    senderKey: string
  ): Promise<string | null> {
    try {
      console.log('💾 Saving response to blockchain:', { userAddress, requestId, response });
      
      // Simulate blockchain storage
      const mockTxId = '0x' + Math.random().toString(16).substr(2, 64);
      
      // TODO: Uncomment after contract deployment
      /*
      const txOptions = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'save-response',
        functionArgs: [
          principalCV(userAddress),
          uintCV(requestId),
          stringAsciiCV(response)
        ],
        senderKey,
        network: NETWORK,
        anchorMode: AnchorMode.Any,
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResponse = await broadcastTransaction(transaction, NETWORK);
      
      if (broadcastResponse.error) {
        throw new Error(`Transaction failed: ${broadcastResponse.error}`);
      }
      
      return broadcastResponse.txid;
      */
      
      return mockTxId;
    } catch (error) {
      console.error('Error saving response to blockchain:', error);
      return null;
    }
  }

  /**
   * Get a specific request by user and request ID
   */
  static async getRequest(userAddress: string, requestId: number): Promise<AIRequest | null> {
    try {
      console.log('📖 Reading request from blockchain:', { userAddress, requestId });
      
      // TODO: Uncomment after contract deployment
      /*
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-request',
        functionArgs: [principalCV(userAddress), uintCV(requestId)],
        network: NETWORK,
        senderAddress: CONTRACT_ADDRESS,
      });

      const resultData = cvToJSON(result);
      
      if (resultData.success && resultData.value) {
        const data = resultData.value.value;
        return {
          user: userAddress,
          requestId,
          request: data.request.value,
          timestamp: parseInt(data.timestamp.value),
          response: data.response.value ? data.response.value.value : undefined
        };
      }
      */
      
      // Mock response for now
      return {
        user: userAddress,
        requestId,
        request: "Mock request from blockchain",
        timestamp: Date.now(),
        response: "Mock response from blockchain"
      };
      
    } catch (error) {
      console.error('Error fetching request:', error);
      return null;
    }
  }

  /**
   * Store request locally until blockchain integration is ready
   */
  static storeRequestLocally(request: string, userAddress?: string): number {
    const requests = JSON.parse(localStorage.getItem('ai-requests') || '[]');
    const requestId = requests.length + 1;
    
    const newRequest = {
      id: requestId,
      user: userAddress || 'unknown',
      request,
      timestamp: Date.now(),
      response: null
    };
    
    requests.push(newRequest);
    localStorage.setItem('ai-requests', JSON.stringify(requests));
    
    console.log('💾 Stored request locally:', newRequest);
    return requestId;
  }

  /**
   * Store response locally until blockchain integration is ready
   */
  static storeResponseLocally(requestId: number, response: string): void {
    const requests = JSON.parse(localStorage.getItem('ai-requests') || '[]');
    const requestIndex = requests.findIndex((r: any) => r.id === requestId);
    
    if (requestIndex !== -1) {
      requests[requestIndex].response = response;
      localStorage.setItem('ai-requests', JSON.stringify(requests));
      console.log('💾 Stored response locally:', { requestId, response });
    }
  }

  /**
   * Get all local requests
   */
  static getLocalRequests(): AIRequest[] {
    const requests = JSON.parse(localStorage.getItem('ai-requests') || '[]');
    return requests.map((r: any) => ({
      user: r.user,
      requestId: r.id,
      request: r.request,
      timestamp: r.timestamp,
      response: r.response
    }));
  }
}

// Helper function to validate Stacks address
export function isValidStacksAddress(address: string): boolean {
  return address.startsWith('ST') && address.length === 41;
}

// Helper function to truncate text for blockchain storage
export function truncateText(text: string, maxLength: number = 500): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
