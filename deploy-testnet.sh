#!/bin/bash

# Simple testnet deployment for AI Storage Contract
echo "🚀 Deploying AI Storage Contract to Stacks Testnet..."

# Contract code
CONTRACT_CODE='
;; AI Storage Contract
;; A simple contract to store and retrieve user AI requests on the blockchain

;; Define constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_NOT_FOUND (err u101))
(define-constant ERR_INVALID_INPUT (err u102))

;; Define data variables
(define-data-var request-counter uint u0)

;; Define data maps
(define-map user-requests 
  { user: principal, request-id: uint } 
  { request: (string-ascii 500), timestamp: uint, response: (optional (string-ascii 500)) }
)

(define-map user-request-count principal uint)

;; Public function to save a user request
(define-public (save-request (request (string-ascii 500)))
  (let 
    (
      (user tx-sender)
      (current-counter (var-get request-counter))
      (new-counter (+ current-counter u1))
      (user-count (default-to u0 (map-get? user-request-count user)))
      (new-user-count (+ user-count u1))
    )
    ;; Validate input
    (asserts! (> (len request) u0) ERR_INVALID_INPUT)
    
    ;; Update counter
    (var-set request-counter new-counter)
    
    ;; Update user request count
    (map-set user-request-count user new-user-count)
    
    ;; Store the request
    (map-set user-requests 
      { user: user, request-id: new-counter }
      { 
        request: request, 
        timestamp: block-height,
        response: none
      }
    )
    
    (ok new-counter)
  )
)

;; Public function to save AI response
(define-public (save-response (user principal) (request-id uint) (response (string-ascii 500)))
  (let 
    (
      (request-data (map-get? user-requests { user: user, request-id: request-id }))
    )
    ;; Check if request exists
    (asserts! (is-some request-data) ERR_NOT_FOUND)
    
    ;; Allow anyone to save response for now
    (map-set user-requests 
      { user: user, request-id: request-id }
      (merge 
        (unwrap-panic request-data)
        { response: (some response) }
      )
    )
    
    (ok true)
  )
)

;; Read-only function to get a specific request
(define-read-only (get-request (user principal) (request-id uint))
  (map-get? user-requests { user: user, request-id: request-id })
)

;; Read-only function to get user request count
(define-read-only (get-user-request-count (user principal))
  (default-to u0 (map-get? user-request-count user))
)

;; Read-only function to get total requests
(define-read-only (get-total-requests)
  (var-get request-counter)
)

;; Read-only function to get contract owner
(define-read-only (get-contract-owner)
  CONTRACT_OWNER
)

;; Helper function to get latest request
(define-read-only (get-latest-request (user principal))
  (let 
    (
      (user-count (get-user-request-count user))
    )
    (if (> user-count u0)
      (get-request user user-count)
      none
    )
  )
)
'

echo "Contract ready for deployment!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://explorer.stacks.co/sandbox/deploy?chain=testnet"
echo "2. Connect your Stacks wallet (Leather/Hiro)"
echo "3. Paste the contract code above"
echo "4. Set contract name: 'ai-storage'"
echo "5. Deploy to testnet"
echo ""
echo "💡 After deployment, update the contract address in app/lib/ai-storage.ts"
echo ""
echo "🔗 Or use Stacks CLI if available:"
echo "stx deploy_contract ai-storage ./contracts/ai-storage.clar --testnet"
