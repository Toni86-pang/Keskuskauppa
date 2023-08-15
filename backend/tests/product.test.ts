// import request from 'supertest';
// import express from 'express';
// import productRouter from '../product'; // Replace with the correct path to your product router
// import { executeQuery } from '../database'; // Import your executeQuery function

// const app = express();
// app.use('/api/product', productRouter);

// describe('Product Creation', () => {
//   it('should create a new product', async () => {
//     // Arrange
//     const newProduct = {
//       user_ID: 1,
//       title: 'Test Product',
//       category_ID: 1,
//       subcategory_ID: 1,
//       location: 'Test Location',
//       description: 'Test Description',
//       price: 100,
//     };

//     // Act
//     const response = await request(app)
//       .post('/api/product/product')
//       .send(newProduct);

//     // Assert
//     expect(response.status).toBe(201);
//     expect(response.body).toEqual({ message: 'Product created successfully' });

//     // Clean up: Delete the newly created product from the database
//     await executeQuery('DELETE FROM products WHERE title = $1', [newProduct.title]);
//   });
// });
