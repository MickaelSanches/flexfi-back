#!/bin/bash

# Set server URL
SERVER="http://localhost:3000"

# Create a simple base64 image for testing
BASE64_IMAGE="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="

# Create a new LOI
echo "Testing LOI creation..."
RESPONSE=$(curl -s -X POST "$SERVER/api/loi" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "company": "Acme Corp",
    "email": "john.doe@example.com",
    "country": "United States",
    "sector": "Technology",
    "comments": "This is a test submission",
    "signature": "'"$BASE64_IMAGE"'"
  }')

echo "Response: $RESPONSE"

# Extract the LOI ID from the response
LOI_ID=$(echo $RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$LOI_ID" ]; then
  echo "Failed to create LOI"
  exit 1
fi

echo "LOI created with ID: $LOI_ID"

# Get the LOI details
echo -e "\nGetting LOI details..."
curl -s -X GET "$SERVER/api/loi/$LOI_ID" | jq

# Get all LOIs
echo -e "\nGetting all LOIs..."
curl -s -X GET "$SERVER/api/loi" | jq

echo -e "\nTests completed!" 