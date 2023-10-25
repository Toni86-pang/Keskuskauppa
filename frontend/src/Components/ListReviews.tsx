import { List } from "@mui/material"
import ReviewCard from "./ReviewCard"
import { Review } from "../types"
import { useEffect, useState } from "react"
import { fetchReviewsForSeller } from "../services"

interface ListReviewsProps {
	sellerId: number
	isOwn: boolean
}

const ListReviews = ({ sellerId, isOwn }: ListReviewsProps) => {

	const [reviewList, setReviewList] = useState<Review[]>([])

	useEffect(() => {
		const fetchReviews = async () => {
			const userReviews: Review[] = await fetchReviewsForSeller(sellerId)
			setReviewList(userReviews)
		}
		fetchReviews()
	}, [sellerId])


	return (
		<List>
			{reviewList.length > 0 ?
				<>
					{reviewList.map((review, index) => (
						<ReviewCard key={"reviews " + index} review={review} isOwn={isOwn} />
					))}
				</> :
				<p>Ei arvosteluja</p>}

		</List>
	)
}

export default ListReviews