import request from 'supertest'
import express from 'express'
import productRouters from '../src/routers/productRouters' 

const app = express()
app.use(express.json())
app.use('/api/product', productRouters)

// Mock data
const mockProduct = {
    product_ID: 1,
    user_ID: 1,
    title: 'Mock Product',
    category_ID: 1,
    subcategory_ID: 1,
    location: 'Mock Location',
    description: 'Mock Description',
    price: 100,
  }
  
  // Mock functions
  const mockCreateProduct = jest.fn(() => Promise.resolve())
  const mockGetAllProducts = jest.fn(() => Promise.resolve([mockProduct]))
  const mockGetProductById = jest.fn(() => Promise.resolve(mockProduct))
  const mockDeleteProduct = jest.fn(() => Promise.resolve())
  const mockUpdateProductData = jest.fn(() => Promise.resolve(mockProduct))
  
  // Mock the product DAOs
  jest.mock('../src/daos/productsDao', () => ({
    createProduct: mockCreateProduct,
    getAllProducts: mockGetAllProducts,
    getProductById: mockGetProductById,
    deleteProduct: mockDeleteProduct,
    updateProductData: mockUpdateProductData,
  }))

describe('Product Endpoints', () => {
  it('should create a new product', async () => {
    const newProduct = {
      title: 'Test Product',
      category_ID: 1,
      subcategory_ID: 1,
      location: 'Test Location',
      description: 'Test Description',
      price: 100,
    }

    const response = await request(app)
      .post('/api/product')
      .send(newProduct)

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('Product created successfully')
  })

  it('should get all products', async () => {
    const response = await request(app).get('/api/product')

    expect(response.status).toBe(200)
    
  })

  it('should get a specific product by ID', async () => {
    const productID = 3
    const response = await request(app).get(`/api/product/${productID}`)
    expect(response.status).toBe(200)
  })

  it('should delete a product by ID', async () => {
    const productID = 3
    const response = await request(app).delete(`/api/product/delete/${productID}`)
    expect(response.status).toBe(200)
  })

  it('should update a product by ID', async () => {
    const productID = 3
    const updatedProduct = {
      title: 'Updated Product',
      category_ID: 2,
      subcategory_ID: 2,
      location: 'Updated Location',
      description: 'Updated Description',
      price: 200,
    }

    const response = await request(app)
      .put(`/api/product/${productID}`)
      .send(updatedProduct)

    expect(response.status).toBe(200) 
  })
})
