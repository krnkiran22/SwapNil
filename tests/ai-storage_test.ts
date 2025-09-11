import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Can save and retrieve AI request",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Save a request
        let block = chain.mineBlock([
            Tx.contractCall(
                'ai-storage',
                'save-request',
                [types.ascii("Hello AI, how are you?")],
                wallet1.address
            )
        ]);
        
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), types.uint(1));
        
        // Retrieve the request
        let getRequestResult = chain.callReadOnlyFn(
            'ai-storage',
            'get-request',
            [types.principal(wallet1.address), types.uint(1)],
            deployer.address
        );
        
        const requestData = getRequestResult.result.expectSome().expectTuple();
        assertEquals(requestData['request'], types.ascii("Hello AI, how are you?"));
        assertEquals(requestData['response'], types.none());
    }
});

Clarinet.test({
    name: "Can save AI response",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Save a request first
        let block = chain.mineBlock([
            Tx.contractCall(
                'ai-storage',
                'save-request',
                [types.ascii("What is the weather?")],
                wallet1.address
            )
        ]);
        
        // Save AI response
        block = chain.mineBlock([
            Tx.contractCall(
                'ai-storage',
                'save-response',
                [
                    types.principal(wallet1.address),
                    types.uint(1),
                    types.ascii("The weather is sunny today!")
                ],
                deployer.address
            )
        ]);
        
        assertEquals(block.receipts[0].result.expectOk(), types.bool(true));
        
        // Verify the response was saved
        let getRequestResult = chain.callReadOnlyFn(
            'ai-storage',
            'get-request',
            [types.principal(wallet1.address), types.uint(1)],
            deployer.address
        );
        
        const requestData = getRequestResult.result.expectSome().expectTuple();
        assertEquals(requestData['response'].expectSome(), types.ascii("The weather is sunny today!"));
    }
});

Clarinet.test({
    name: "Can get user request count",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Save multiple requests
        let block = chain.mineBlock([
            Tx.contractCall(
                'ai-storage',
                'save-request',
                [types.ascii("First request")],
                wallet1.address
            ),
            Tx.contractCall(
                'ai-storage',
                'save-request',
                [types.ascii("Second request")],
                wallet1.address
            )
        ]);
        
        // Check user request count
        let countResult = chain.callReadOnlyFn(
            'ai-storage',
            'get-user-request-count',
            [types.principal(wallet1.address)],
            deployer.address
        );
        
        assertEquals(countResult.result, types.uint(2));
    }
});
