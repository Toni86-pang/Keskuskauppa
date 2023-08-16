import express, { Request, Response } from "express"
import { createProduct , Product } from "./Dao"


const product = express.Router()

interface CustomRequest extends Request {
	logged_in?: boolean
	user_id?: number
}
interface Product {
	participant_id: number
	event_id: number
	user_id: number
	attendance: string[]
	private: boolean
}


/*  			 Products endpoints 				  */

product.get("/:id", async (req , res )=>{
	try {
		const ProductID = req.params.id

		const event: Product[] = await getProductById(ProductID)
	
	
	}
})


product.post("/", async (req, res) => {
	try {
	  const newProduct: Product = req.body
	  await createProduct(newProduct)
	  res.status(201).json({ message: 'Product created successfully' })
	} catch (error) {
	  res.status(500).json({ message: 'Error creating product' })
	}
  })

  product.put('/event/:id', async (req: CustomRequest, res: Response) => {
	const eventId = parseInt(req.params.id, 10)
	const userId = req.body.userId
	const attendance = req.body.attendance
	
	try {
		// Validate input data
		if (!eventId || !attendance) {
			res.status(400).send('Invalid input data')
			return
		}
		const participant = await updateParticipant(eventId, userId, attendance)
		res.status(200).json(participant)
	} catch (error) {
		console.error('Error updating participant:', error)
		res.status(500).send('Internal Server Error')
	}
})



export default product