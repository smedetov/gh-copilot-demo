# Albums API v2

A Node.js TypeScript API for managing music albums - rewrite of the .NET albums-api.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ In-memory data store with 6 sample albums
- ✅ TypeScript for type safety
- ✅ Express.js framework
- ✅ CORS enabled for any origin
- ✅ Comprehensive unit tests with Jest
- ✅ Hot reload with ts-node-dev

## Project Structure

```
albums-api-v2/
├── src/
│   ├── __tests__/
│   │   └── albums.test.ts    # Unit tests (17 test cases)
│   ├── models/
│   │   └── album.ts          # Album interface & sample data
│   ├── routes/
│   │   └── albums.ts         # Album CRUD routes
│   ├── server.ts             # Express server configuration
│   └── index.ts              # Entry point
├── dist/                     # Compiled JavaScript (after build)
├── package.json
├── tsconfig.json
└── jest.config.js
```

## API Endpoints

### Root
- `GET /` - Welcome message

### Albums
- `GET /albums` - Get all albums
- `GET /albums/:id` - Get album by ID
- `POST /albums` - Create new album
- `PUT /albums/:id` - Update album
- `DELETE /albums/:id` - Delete album

## Album Data Structure

```typescript
{
  id: number;
  title: string;
  artist: string;
  price: number;
  image_url: string;
}
```

## Sample Data

The API includes 6 pre-loaded albums:
1. "You, Me and an App Id" by Daprize - $10.99
2. "Seven Revision Army" by The Blue-Green Stripes - $13.99
3. "Scale It Up" by KEDA Club - $13.99
4. "Lost in Translation" by MegaDNS - $12.99
5. "Lock Down Your Love" by V is for VNET - $12.99
6. "Sweet Container O' Mine" by Guns N Probeses - $14.99

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development (with hot reload)
```bash
npm run dev
```
Server starts on http://localhost:3000

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

### Run Tests
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

## Test Results

✅ **17 tests passing**
- Root endpoint
- List all albums
- Get album by ID (with validation)
- Create album (with validation)
- Update album (with validation)
- Delete album (with validation)
- CORS headers verification

## API Examples

### Get All Albums
```bash
curl http://localhost:3000/albums
```

### Get Album by ID
```bash
curl http://localhost:3000/albums/1
```

### Create New Album
```bash
curl -X POST http://localhost:3000/albums \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Album",
    "artist": "Artist Name",
    "price": 15.99,
    "image_url": "https://example.com/image.jpg"
  }'
```

### Update Album
```bash
curl -X PUT http://localhost:3000/albums/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 19.99}'
```

### Delete Album
```bash
curl -X DELETE http://localhost:3000/albums/1
```

## Integration with Vue.js Frontend

The API is designed to work seamlessly with the existing `album-viewer` Vue.js application. Simply ensure:
1. The API is running on port 3000
2. The Vue app's Vite proxy is configured to forward `/albums` requests to `http://localhost:3000`

## Technologies

- **Node.js** - Runtime environment
- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework
- **CORS** - Cross-Origin Resource Sharing
- **Jest** - Testing framework
- **Supertest** - HTTP assertions
- **ts-node-dev** - Development hot reload

## Configuration

Port can be changed via environment variable:
```bash
PORT=3001 npm run dev
```
