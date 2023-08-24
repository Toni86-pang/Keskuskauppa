import request from "supertest"
import server from "../src/server"

describe("api/category", () => {
    it("return status code 200", async () => {
        const response = await request(server)
            .get("/api/category")
        expect(response.statusCode).toBe(200)
    })


    it("returs status code 404 for invalid route", async () => {
        const response = await request(server)
            .get("/api/invalid-route")
        expect(response.statusCode).toBe(404)
    })
})