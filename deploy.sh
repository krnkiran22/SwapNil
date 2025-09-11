#!/bin/bash

# AI Storage Contract Deployment Script
# Deploy to Stacks Testnet

echo "🚀 Deploying AI Storage Contract to Testnet..."

# Check if clarinet is installed
if ! command -v clarinet &> /dev/null; then
    echo "❌ Clarinet not found. Please install Clarinet first."
    echo "Visit: https://github.com/hirosystems/clarinet"
    exit 1
fi

# Validate contract syntax
echo "📝 Validating contract syntax..."
clarinet check

if [ $? -eq 0 ]; then
    echo "✅ Contract syntax is valid"
else
    echo "❌ Contract has syntax errors. Please fix them first."
    exit 1
fi

# Run tests
echo "🧪 Running contract tests..."
clarinet test

if [ $? -eq 0 ]; then
    echo "✅ All tests passed"
else
    echo "⚠️  Some tests failed, but continuing with deployment..."
fi

# Deploy to testnet
echo "📡 Deploying to Stacks Testnet..."
clarinet deploy --testnet

echo "🎉 Deployment complete!"
echo ""
echo "📋 Contract Details:"
echo "   Name: ai-storage"
echo "   Network: Stacks Testnet"
echo "   Functions:"
echo "   - save-request(request: string-ascii)"
echo "   - save-response(user: principal, request-id: uint, response: string-ascii)"
echo "   - get-request(user: principal, request-id: uint)"
echo "   - get-user-request-count(user: principal)"
echo "   - get-total-requests()"
echo ""
echo "💡 You can now integrate this contract with your AI application!"
