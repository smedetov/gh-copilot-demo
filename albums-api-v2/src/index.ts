import { createServer } from './server';

const PORT = process.env.PORT || 3000;

const app = createServer();

app.listen(PORT, () => {
  console.log(`🚀 Albums API v2 is running on http://localhost:${PORT}`);
  console.log(`📚 Try GET http://localhost:${PORT}/albums to see all albums`);
});
