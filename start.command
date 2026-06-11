#!/bin/bash
echo "Starting Hayder League..."
cd "$(dirname "$0")/server" && npx tsx src/index.ts &
SERVER_PID=$!
cd "$(dirname "$0")/client" && npx vite --host &
CLIENT_PID=$!
echo "Server: http://localhost:3002"
echo "Client: http://localhost:5173"
echo "Press Ctrl+C to stop"
trap "kill $SERVER_PID $CLIENT_PID 2>/dev/null" EXIT
wait
