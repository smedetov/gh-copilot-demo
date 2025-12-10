import { Router, Request, Response } from 'express';
import { Album, albums, getNextId } from '../models/album';

const router = Router();

// GET /albums - Get all albums
router.get('/', (req: Request, res: Response) => {
  res.json(albums);
});

// GET /albums/:id - Get album by ID
router.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid album ID' });
  }
  
  const album = albums.find(a => a.id === id);
  
  if (!album) {
    return res.status(404).json({ error: 'Album not found' });
  }
  
  res.json(album);
});

// POST /albums - Create new album
router.post('/', (req: Request, res: Response) => {
  const { title, artist, price, image_url } = req.body;
  
  // Validation
  if (!title || !artist || price === undefined || !image_url) {
    return res.status(400).json({ 
      error: 'Missing required fields: title, artist, price, image_url' 
    });
  }
  
  if (typeof title !== 'string' || typeof artist !== 'string' || typeof image_url !== 'string') {
    return res.status(400).json({ 
      error: 'title, artist, and image_url must be strings' 
    });
  }
  
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ 
      error: 'price must be a positive number' 
    });
  }
  
  const newAlbum: Album = {
    id: getNextId(),
    title,
    artist,
    price,
    image_url
  };
  
  albums.push(newAlbum);
  res.status(201).json(newAlbum);
});

// PUT /albums/:id - Update album
router.put('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid album ID' });
  }
  
  const index = albums.findIndex(a => a.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Album not found' });
  }
  
  const { title, artist, price, image_url } = req.body;
  
  // Validation
  if (title !== undefined && typeof title !== 'string') {
    return res.status(400).json({ error: 'title must be a string' });
  }
  
  if (artist !== undefined && typeof artist !== 'string') {
    return res.status(400).json({ error: 'artist must be a string' });
  }
  
  if (price !== undefined && (typeof price !== 'number' || price < 0)) {
    return res.status(400).json({ error: 'price must be a positive number' });
  }
  
  if (image_url !== undefined && typeof image_url !== 'string') {
    return res.status(400).json({ error: 'image_url must be a string' });
  }
  
  // Update only provided fields
  albums[index] = {
    ...albums[index],
    ...(title !== undefined && { title }),
    ...(artist !== undefined && { artist }),
    ...(price !== undefined && { price }),
    ...(image_url !== undefined && { image_url })
  };
  
  res.json(albums[index]);
});

// DELETE /albums/:id - Delete album
router.delete('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid album ID' });
  }
  
  const index = albums.findIndex(a => a.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Album not found' });
  }
  
  const deletedAlbum = albums.splice(index, 1)[0];
  res.json(deletedAlbum);
});

export default router;
