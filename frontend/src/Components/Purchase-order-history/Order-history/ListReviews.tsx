import { List, Typography, Box } from "@mui/material"
import ReviewCard from "./ReviewCard"
import { useEffect, useState } from "react"
import { Review } from "../../../Services-types/types"
import { fetchReviewsForSeller } from "../../../Services-types/services"

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
				<Box mb={2} ml={3}>
					<Typography>Ei vielä arvosteluja.</Typography>
				</Box>}
		</List>
	)
}

export default ListReviews