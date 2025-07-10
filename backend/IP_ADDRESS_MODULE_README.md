# IP Address Tracking Module

## Overview
This module tracks website visitors by their IP addresses. When a visitor comes to your website, their IP address is recorded. If they visit again, instead of creating a new record, the visit count is incremented.

## Features
- ✅ Record visitor IP addresses
- ✅ Track visit counts for returning visitors
- ✅ Get total visits count (including repeated visits)
- ✅ Get distinct IP addresses count
- ✅ Full Swagger API documentation

## Database Schema
The IP address data is stored with the following fields:
- `ip`: The visitor's IP address (unique)
- `visitCount`: Number of times this IP has visited (starts at 1, increments on each visit)
- `firstVisit`: Date/time of the first visit
- `lastVisit`: Date/time of the most recent visit

## API Endpoints

### 1. Record a Visit
**POST** `/ip-address`

Records a new visitor or increments the visit count for an existing visitor.

**Request Body:**
```json
{
  "ip": "192.168.1.100"
}
```

**Response:**
```json
{
  "message": "Visit recorded - new visitor",
  "isNewVisitor": true,
  "visitCount": 1,
  "ip": "192.168.1.100"
}
```

For returning visitors:
```json
{
  "message": "Visit recorded - returning visitor",
  "isNewVisitor": false,
  "visitCount": 3,
  "ip": "192.168.1.100"
}
```

### 2. Get Visitor Statistics
**GET** `/ip-address`

Returns visitor statistics including total visits and unique IP count.

**Response:**
```json
{
  "totalVisits": 150,
  "uniqueIPs": 75
}
```

- `totalVisits`: Total count of visits including repeated visits
- `uniqueIPs`: Distinct count of IP addresses

## Frontend Integration

### Basic Integration
Add this JavaScript code to your frontend to track visitors:

```javascript
const recordVisit = async () => {
    try {
        // Get visitor's IP using a service like ipify.org
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        // Record the visit
        const visitData = {
            ip: ipData.ip
        };
        
        const response = await fetch('http://localhost:3000/ip-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(visitData)
        });
        
        const result = await response.json();
        console.log('Visit recorded:', result);
    } catch (error) {
        console.error('Error recording visit:', error);
    }
};

// Get visitor statistics
const getStats = async () => {
    try {
        const response = await fetch('http://localhost:3000/ip-address');
        const stats = await response.json();
        console.log('Visitor stats:', stats);
        // stats.totalVisits = total visits including repeated visits
        // stats.uniqueIPs = distinct count of IP addresses
    } catch (error) {
        console.error('Error getting stats:', error);
    }
};

// Call this function when your website loads
recordVisit();
```

### React Integration Example
```jsx
import { useEffect } from 'react';

const useVisitorTracking = () => {
    useEffect(() => {
        const recordVisit = async () => {
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                
                await fetch('http://localhost:3000/ip-address', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ip: ipData.ip })
                });
            } catch (error) {
                console.error('Error recording visit:', error);
            }
        };
        
        recordVisit();
    }, []);
};

// Use in your main component
const App = () => {
    useVisitorTracking();
    
    return (
        <div>
            {/* Your app content */}
        </div>
    );
};
```

## Testing
Run the test file to verify the API functionality:

```bash
node test-ip-address.js
```

Make sure your NestJS server is running on port 3000 before running the tests.

## Privacy Considerations
- IP addresses are considered personal data in many jurisdictions
- Consider implementing data retention policies
- Provide clear privacy notices to visitors
- Consider IP anonymization for compliance with privacy laws

## Performance Notes
- The schema includes indexes on `ip`, `lastVisit`, and `visitCount` for optimal query performance
- The `ip` field has a unique constraint to prevent duplicate records

## Module Files
- `schemas/ip-address.schema.ts` - Database schema
- `ip-address/dto/record-visit.dto.ts` - Data transfer object
- `ip-address/ip-address.service.ts` - Business logic
- `ip-address/ip-address.controller.ts` - API endpoints
- `ip-address/ip-address.module.ts` - Module configuration

## Error Handling
The API includes proper error handling for:
- Invalid IP address formats
- Database connection issues
- Validation errors
- Missing required fields

All endpoints return appropriate HTTP status codes and error messages.

## Example Usage

### Record a visit:
```bash
curl -X POST http://localhost:3000/ip-address \
  -H "Content-Type: application/json" \
  -d '{"ip": "192.168.1.100"}'
```

### Get statistics:
```bash
curl http://localhost:3000/ip-address
``` 