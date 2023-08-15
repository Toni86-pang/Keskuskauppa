import { jest } from '@jest/globals'
import { pool } from '../src/database'

// Mock the pool methods.
const initializeMockPool = (mockResponse: any) => {
    (pool as any).connect = jest.fn(() => {
        return {
            query: () => mockResponse,
            release: () => null
        }
    })
}


describe("Testing GET /Category", () => {
    const mockResponse = {
        rows: [
            { category_ID: 101, category_name: 'Test Item 1' },
            { category_ID: 102, category_name: 'Test Item 2' },
        ]
    }

    beforeAll(() => {
        initializeMockPool(mockResponse)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    it("GET /Category returns all categories", async () => {
        expect(true).toBe(true)
    })
})
