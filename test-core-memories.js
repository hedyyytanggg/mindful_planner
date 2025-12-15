#!/usr/bin/env node

/**
 * Test script for Core Memories API
 * Tests the complete create, read, and delete flow
 */

const http = require('http');

// Configuration
const BASE_URL = 'http://localhost:3001';
const TEST_USER_ID = 'test-user-123';

// Mock session for testing
const SESSION_COOKIE = 'next-auth.session-token=mock-session-token';

function makeRequest(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : null;
                    resolve({
                        status: res.statusCode,
                        data: parsed,
                        headers: res.headers,
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: data,
                        headers: res.headers,
                    });
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runTests() {
    console.log('🧪 Testing Core Memories API...\n');

    try {
        // Test 1: GET memories (should be empty initially)
        console.log('Test 1: GET /api/memories (empty list)');
        const getResponse = await makeRequest('GET', '/api/memories');
        console.log(`  Status: ${getResponse.status}`);
        console.log(`  Response: ${JSON.stringify(getResponse.data)}\n`);

        // Test 2: POST a new memory
        console.log('Test 2: POST /api/memories (create memory)');
        const newMemory = {
            userId: TEST_USER_ID,
            title: 'My First Memory',
            description: 'This is a test memory for the Core Memories feature',
            memoryDate: '2024-01-15',
            tags: ['test', 'important'],
        };
        const postResponse = await makeRequest('POST', '/api/memories', newMemory);
        console.log(`  Status: ${postResponse.status}`);
        console.log(`  Response: ${JSON.stringify(postResponse.data)}\n`);

        if (postResponse.status !== 201 && postResponse.status !== 200) {
            console.log('❌ Failed to create memory');
            process.exit(1);
        }

        const memoryId = postResponse.data?.id;
        console.log(`  Created memory with ID: ${memoryId}\n`);

        // Test 3: GET memories (should have one now)
        console.log('Test 3: GET /api/memories (with one memory)');
        const getResponse2 = await makeRequest('GET', '/api/memories');
        console.log(`  Status: ${getResponse2.status}`);
        console.log(`  Response: ${JSON.stringify(getResponse2.data)}\n`);

        // Test 4: DELETE the memory
        if (memoryId) {
            console.log(`Test 4: DELETE /api/memories/${memoryId}`);
            const deleteResponse = await makeRequest('DELETE', `/api/memories/${memoryId}`);
            console.log(`  Status: ${deleteResponse.status}`);
            console.log(`  Response: ${JSON.stringify(deleteResponse.data)}\n`);
        }

        console.log('✅ All tests completed!');
    } catch (error) {
        console.error('❌ Test error:', error.message);
        process.exit(1);
    }
}

// Wait a moment for server to be ready, then run tests
setTimeout(runTests, 1000);
