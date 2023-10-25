import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
// import Typography from "@mui/material/Typography"
import { Button, Grid, Rating } from "@mui/material"
import { fetchReviewComment, fetchUsernameByUserId } from "../services"
import { useEffect, useState } from "react"
import { ReviewCardProps, ReviewComment } from "../types"
import CommentCard from "./CommentCard"

const cardStyle = {
	marginTop: "10px",
	marginBottom: "10px"
}

const gridContainerStyle = {
	alignItems: "center"
}

function ReviewCard({ review, isOwn }: ReviewCardProps) {

	const [reviewer, setReviewer] = useState("")
	const [reviewComment, setReviewComment] = useState<ReviewComment | null>(null)
	const reviewDate: string = review.review_date ?? ""
	const year: string = reviewDate.substring(0, 4)
	const month: string = reviewDate.substring(5, 7)
	const day: string = reviewDate.substring(8, 10)
	const formattedReviewDate = `${day}.${month}.${year}`

	useEffect(() => {
		const fetchCommentAndReviewerUsername = async () => {
			if(!review.review_id) return
			const comment: ReviewComment | null = await fetchReviewComment(review.review_id)
			if (comment) {
				setReviewComment(comment)
			}

			const fetchedReviewer = await fetchUsernameByUserId(review.buyer_id)
			if (fetchedReviewer) {
				setReviewer(fetchedReviewer)
			}
		}
		fetchCommentAndReviewerUsername()

	},[review])

	return (
		<>
			<Card style={cardStyle}>
				<CardContent>
					<div>{review.description}</div>
					<Grid container spacing={2} style={gridContainerStyle} >
						<Grid item xs={2} >{reviewer}</Grid>
						<Grid item xs={2} >{formattedReviewDate}</Grid>
						<Grid item xs={5} ><Rating value={review.stars} /></Grid>
						<Grid item xs={3} >
							{isOwn && !reviewComment && <Button variant="contained" color="primary" >Jätä kommentti</Button>}
						</Grid>
					</Grid>
					{reviewComment && <CommentCard reviewComment={reviewComment} />}
				</CardContent>
			</Card>
			
		</>
	)
}

export default ReviewCard
