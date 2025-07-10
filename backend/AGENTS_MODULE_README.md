# Agents Module Documentation

## Overview
The Agents module provides CRUD operations for managing agent records in the portfolio application.

## Features
- Create new agents with required and optional fields
- Retrieve all agents with pagination
- Get active agents only
- Get individual agent by ID
- Update agent information (admin only)
- Delete agents (admin only)
- Get agent statistics (total and active counts)

## Schema
The Agent schema includes the following fields:
- `userName` (required): Full name of the agent
- `email` (optional): Email address
- `phone` (required): Phone number
- `message` (optional): Additional message
- `isActive` (default: true): Status flag
- `createdAt` & `updatedAt` (auto-generated): Timestamps

## API Endpoints

### Public Endpoints
- `POST /agents` - Create a new agent
- `GET /agents` - Get all agents (with pagination)
- `GET /agents/active` - Get active agents only
- `GET /agents/count` - Get total and active agent counts
- `GET /agents/:id` - Get agent by ID

### Admin-Only Endpoints (requires authentication)
- `PUT /agents/:id` - Update agent
- `DELETE /agents/:id` - Delete agent

## Request Examples

### Create Agent
```bash
curl -X POST http://localhost:3000/agents \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+966 50 444 5566",
    "message": "Looking for collaboration opportunities"
  }'
```

### Get All Agents
```bash
curl -X GET "http://localhost:3000/agents?limit=10&page=1"
```

### Get Active Agents
```bash
curl -X GET http://localhost:3000/agents/active
```

### Get Agent by ID
```bash
curl -X GET http://localhost:3000/agents/66a1b2c3d4e5f6789012345
```

### Update Agent (Admin Only)
```bash
curl -X PUT http://localhost:3000/agents/66a1b2c3d4e5f6789012345 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userName": "John Doe Updated",
    "message": "Updated message"
  }'
```

### Delete Agent (Admin Only)
```bash
curl -X DELETE http://localhost:3000/agents/66a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Files Created
1. `backend/src/schemas/agent.schema.ts` - Database schema
2. `backend/src/agents/dto/create-agent.dto.ts` - Create validation DTO
3. `backend/src/agents/dto/update-agent.dto.ts` - Update validation DTO
4. `backend/src/agents/agents.service.ts` - Business logic
5. `backend/src/agents/agents.controller.ts` - API endpoints
6. `backend/src/agents/agents.module.ts` - Module definition
7. `backend/test-agents-api.js` - Test script

## Testing
Run the test script to verify all endpoints:
```bash
node test-agents-api.js
```

## Notes
- Email and message fields are optional
- Update and delete operations require admin authentication
- All agents are active by default
- Pagination is supported for retrieving agents
- Database indexes are created for better performance 