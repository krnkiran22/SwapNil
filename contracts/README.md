# AI Storage Smart Contract

A Clarity smart contract on Stacks blockchain for storing AI requests and responses permanently on-chain.

## 📋 Contract Overview

This contract allows users to:

- **Save AI requests** to the blockchain with timestamp
- **Store AI responses** linked to specific requests
- **Retrieve requests and responses** by user and request ID
- **Track user activity** with request counters

## 🏗️ Contract Functions

### Public Functions

#### `save-request(request: string-ascii)`

Saves a user's AI request to the blockchain.

- **Parameters**: `request` - The user's question/request (max 500 characters)
- **Returns**: Request ID (uint)
- **Cost**: ~0.01 STX

#### `save-response(user: principal, request-id: uint, response: string-ascii)`

Saves AI response to a specific user request.

- **Parameters**:
  - `user` - Principal address of the user
  - `request-id` - ID of the original request
  - `response` - AI's response (max 500 characters)
- **Returns**: Success boolean

### Read-Only Functions

#### `get-request(user: principal, request-id: uint)`

Retrieves a specific request and its response.

- **Returns**: Optional tuple with request data

#### `get-user-request-count(user: principal)`

Gets total number of requests made by a user.

- **Returns**: Number of requests (uint)

#### `get-latest-request(user: principal)`

Gets the most recent request from a user.

- **Returns**: Optional tuple with latest request data

#### `get-total-requests()`

Gets total number of requests across all users.

- **Returns**: Total request count (uint)

## 🚀 Deployment

### Prerequisites

1. Install [Clarinet](https://github.com/hirosystems/clarinet)
2. Have STX tokens for testnet deployment

### Deploy to Testnet

```bash
# Validate contract
clarinet check

# Run tests
clarinet test

# Deploy to testnet
clarinet deploy --testnet
```

Or use the deployment script:

```bash
chmod +x deploy.sh
./deploy.sh
```

## 💻 Frontend Integration

Install the required packages:

```bash
npm install @stacks/transactions @stacks/network @stacks/auth @stacks/connect
```

### Example Usage

```typescript
import { AIStorageContract } from "./lib/ai-storage";

// Save a user request
const txId = await AIStorageContract.saveRequest(
  "What is the weather today?",
  privateKey
);

// Get user's request count
const count = await AIStorageContract.getUserRequestCount(userAddress);

// Retrieve a specific request
const request = await AIStorageContract.getRequest(userAddress, 1);
```

## 📊 Data Structure

### Request Data

```clarity
{
  request: string-ascii(500),    // User's question
  timestamp: uint,               // Block height when stored
  response: optional(string-ascii(500))  // AI's response (if any)
}
```

## 🔐 Security Features

- **User isolation**: Each user can only access their own requests
- **Input validation**: Prevents empty requests
- **Immutable storage**: Once stored, data cannot be modified
- **Transparent**: All data is publicly readable on blockchain

## 💡 Use Cases

1. **AI Chat History**: Permanent storage of conversations
2. **Audit Trail**: Immutable record of AI interactions
3. **Analytics**: Track usage patterns and popular queries
4. **Decentralized AI**: Build trustless AI applications

## 🛠️ Integration with Your AI App

To integrate with your existing AI application:

1. **When user sends a request**:

   ```typescript
   // Save to blockchain
   const requestId = await AIStorageContract.saveRequest(userInput, privateKey);

   // Send to AI backend
   const aiResponse = await fetch('/api/chat', { ... });
   ```

2. **When AI responds**:

   ```typescript
   // Save response to blockchain
   await AIStorageContract.saveResponse(
     userAddress,
     requestId,
     aiResponse,
     adminPrivateKey
   );
   ```

3. **Display chat history**:

   ```typescript
   // Get user's conversation history
   const count = await AIStorageContract.getUserRequestCount(userAddress);
   const conversations = [];

   for (let i = 1; i <= count; i++) {
     const request = await AIStorageContract.getRequest(userAddress, i);
     conversations.push(request);
   }
   ```

## 📝 Contract Address

After deployment, update the contract address in `app/lib/ai-storage.ts`:

```typescript
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

## 🧪 Testing

Run the test suite:

```bash
clarinet test
```

Tests cover:

- Saving and retrieving requests
- Adding responses to requests
- User request counting
- Error handling

## 🔗 Blockchain Explorer

View your deployed contract and transactions on:

- **Testnet**: https://explorer.stacks.co/?chain=testnet
- **Mainnet**: https://explorer.stacks.co/

## 📈 Gas Costs

Estimated transaction costs:

- `save-request`: ~0.01 STX
- `save-response`: ~0.008 STX
- Read functions: Free

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - feel free to use in your projects!

---

**Ready to store your AI conversations on the blockchain! 🚀**
