import request from 'supertest';
import { Application } from 'express';
import { createServer } from '../server';
import { albums } from '../models/album';

describe('Albums API', () => {
  let app: Application;
  
  beforeEach(() => {
    app = createServer();
    // Reset albums to original state before each test
    albums.length = 0;
    albums.push(
      { id: 1, title: "You, Me and an App Id", artist: "Daprize", price: 10.99, image_url: "https://aka.ms/albums-daprlogo" },
      { id: 2, title: "Seven Revision Army", artist: "The Blue-Green Stripes", price: 13.99, image_url: "https://aka.ms/albums-containerappslogo" },
      { id: 3, title: "Scale It Up", artist: "KEDA Club", price: 13.99, image_url: "https://aka.ms/albums-kedalogo" },
      { id: 4, title: "Lost in Translation", artist: "MegaDNS", price: 12.99, image_url: "https://aka.ms/albums-envoylogo" },
      { id: 5, title: "Lock Down Your Love", artist: "V is for VNET", price: 12.99, image_url: "https://aka.ms/albums-vnetlogo" },
      { id: 6, title: "Sweet Container O' Mine", artist: "Guns N Probeses", price: 14.99, image_url: "https://aka.ms/albums-containerappslogo" }
    );
  });
  
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('albums');
    });
  });
  
  describe('GET /albums', () => {
    it('should return all albums', async () => {
      const response = await request(app).get('/albums');
      
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(6);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('artist');
      expect(response.body[0]).toHaveProperty('price');
      expect(response.body[0]).toHaveProperty('image_url');
    });
    
    it('should return albums with correct data structure', async () => {
      const response = await request(app).get('/albums');
      
      expect(response.body[0]).toEqual({
        id: 1,
        title: "You, Me and an App Id",
        artist: "Daprize",
        price: 10.99,
        image_url: "https://aka.ms/albums-daprlogo"
      });
    });
  });
  
  describe('GET /albums/:id', () => {
    it('should return a single album by ID', async () => {
      const response = await request(app).get('/albums/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('title', "You, Me and an App Id");
    });
    
    it('should return 404 for non-existent album', async () => {
      const response = await request(app).get('/albums/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Album not found');
    });
    
    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/albums/invalid');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid album ID');
    });
  });
  
  describe('POST /albums', () => {
    it('should create a new album', async () => {
      const newAlbum = {
        title: "New Album",
        artist: "New Artist",
        price: 15.99,
        image_url: "https://example.com/image.jpg"
      };
      
      const response = await request(app)
        .post('/albums')
        .send(newAlbum);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 7);
      expect(response.body).toHaveProperty('title', 'New Album');
      expect(response.body).toHaveProperty('artist', 'New Artist');
      expect(response.body).toHaveProperty('price', 15.99);
    });
    
    it('should return 400 when required fields are missing', async () => {
      const invalidAlbum = {
        title: "Incomplete Album"
      };
      
      const response = await request(app)
        .post('/albums')
        .send(invalidAlbum);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Missing required fields');
    });
    
    it('should return 400 for invalid price', async () => {
      const invalidAlbum = {
        title: "Test Album",
        artist: "Test Artist",
        price: -5,
        image_url: "https://example.com/image.jpg"
      };
      
      const response = await request(app)
        .post('/albums')
        .send(invalidAlbum);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('price must be a positive number');
    });
  });
  
  describe('PUT /albums/:id', () => {
    it('should update an existing album', async () => {
      const updates = {
        title: "Updated Title",
        price: 19.99
      };
      
      const response = await request(app)
        .put('/albums/1')
        .send(updates);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('title', 'Updated Title');
      expect(response.body).toHaveProperty('price', 19.99);
      expect(response.body).toHaveProperty('artist', 'Daprize'); // Should keep original
    });
    
    it('should return 404 for non-existent album', async () => {
      const updates = { title: "Updated Title" };
      
      const response = await request(app)
        .put('/albums/999')
        .send(updates);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Album not found');
    });
    
    it('should return 400 for invalid ID format', async () => {
      const updates = { title: "Updated Title" };
      
      const response = await request(app)
        .put('/albums/invalid')
        .send(updates);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid album ID');
    });
    
    it('should return 400 for invalid price in update', async () => {
      const updates = { price: -10 };
      
      const response = await request(app)
        .put('/albums/1')
        .send(updates);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('price must be a positive number');
    });
  });
  
  describe('DELETE /albums/:id', () => {
    it('should delete an album', async () => {
      const response = await request(app).delete('/albums/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      
      // Verify album is deleted
      const getResponse = await request(app).get('/albums/1');
      expect(getResponse.status).toBe(404);
    });
    
    it('should return 404 for non-existent album', async () => {
      const response = await request(app).delete('/albums/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Album not found');
    });
    
    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).delete('/albums/invalid');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid album ID');
    });
  });
  
  describe('CORS', () => {
    it('should have CORS headers enabled', async () => {
      const response = await request(app).get('/albums');
      
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });
  });
});
