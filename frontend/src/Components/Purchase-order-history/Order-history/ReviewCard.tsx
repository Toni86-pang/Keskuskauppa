import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import { Button, Grid, Rating } from "@mui/material"
import { useEffect, useState } from "react"
import CommentCard from "./CommentCard"
import LeaveComment from "./LeaveComment"
import { ReviewCardProps, ReviewComment } from "../../../Services-types/types"
import { fetchReviewComment, fetchUsernameByUserId } from "../../../Services-types/services"

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
	const [reload, setReload] = useState(false)
	const reviewDate: string = review.review_date ?? ""
	const year: string = reviewDate.substring(0, 4)
	const month: string = reviewDate.substring(5, 7)
	const day: string = reviewDate.substring(8, 10)
	const formattedReviewDate = `${day}.${month}.${year}`

	const [leaveCommentOpen, setLeaveCommentOpen] = useState(false)

	useEffect(() => {
		const fetchCommentAndReviewerUsername = async () => {
			if(!review.review_id || !review.buyer_id) return
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

	},[review, reload])

	const onCloseLeaveComment = () => {
		setLeaveCommentOpen(false)
		setReload(!reload)
	}

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
							{isOwn && !reviewComment && <Button variant="contained" color="primary" onClick={()=>setLeaveCommentOpen(true)}>Jätä kommentti</Button>}
						</Grid>
					</Grid>
					{reviewComment && <CommentCard reviewComment={reviewComment} />}
				</CardContent>
			</Card>
			<LeaveComment reviewId={review.review_id??0} isOpen={leaveCommentOpen} close={onCloseLeaveComment} />
		</>
	)
}

export default ReviewCard
