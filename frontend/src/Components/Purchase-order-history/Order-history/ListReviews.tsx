import { List } from "@mui/material"
import ReviewCard from "./ReviewCard"
import { useEffect, useState } from "react"
import { Review, User } from "../../../Services-types/types"
import { fetchReviewsForSeller } from "../../../Services-types/services"

interface ListReviewsProps {
	sellerId: number
	isOwn: boolean
	user: User
}

const ListReviews = ({ sellerId, isOwn, user }: ListReviewsProps) => {

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