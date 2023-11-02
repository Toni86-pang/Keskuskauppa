import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import { Button, Grid, Rating, Box } from "@mui/material"
import { useEffect, useState } from "react"
import CommentCard from "./CommentCard"
import LeaveComment from "./LeaveComment"
import { ReviewCardProps, ReviewComment, User } from "../../../Services-types/types"
import { fetchReviewComment, fetchUserDetailsByUserId, fetchUsernameByUserId } from "../../../Services-types/services"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"

const cardStyle = {
	marginTop: "10px",
	marginBottom: "10px"
}

const gridContainerStyle = {
	alignItems: "center"
}

function ReviewCard({ review, isOwn, user }: ReviewCardProps) {

	const [reviewer, setReviewer] = useState("")
	const [seller, setSeller] = useState<User>()
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
			if(review.seller_id){
				const fetchedSeller = await fetchUserDetailsByUserId(review.seller_id)
				if (fetchedSeller) {
					setSeller(fetchedSeller)
				}
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
					{/* {!review.seen &&<Typography>Uusi arvostelu! </Typography>} */}
					<Grid container spacing={2} style={gridContainerStyle} >
						<Typography ml={2} mt={2} component="span">
							<Avatar src={typeof user?.user_image === "string" ? user.user_image : undefined}
								alt={user?.name}
								sx={{
									width: "25",
									height: "25",
									m: 1

								}} />
						</Typography>
						<Grid item xs={6}>
							<Typography>
								{reviewer}
							</Typography>
						</Grid>
						<Grid item xs={4}>
							<Box display="flex" justifyContent="flex-end">
								<Typography>
									{formattedReviewDate}
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={10}>
							<Typography ml={9} >
								{review.description}
							</Typography>
						</Grid>
						<Grid item xs={4}>
							<Typography ml={8.2} mb={3}>
								<Rating value={review.stars} />
							</Typography>
						</Grid>
						<Grid item xs={7.75}>
							<Box display="flex" justifyContent="flex-end">
								<Typography>
									{isOwn && !reviewComment && <Button variant="contained" color="primary" onClick={()=>setLeaveCommentOpen(true)}>Jätä kommentti</Button>}
								</Typography>
							</Box>
						</Grid>
					</Grid>
					{reviewComment && <CommentCard reviewComment={reviewComment} seller={seller}/>}
				</CardContent>
			</Card>
			<LeaveComment reviewId={review.review_id??0} isOpen={leaveCommentOpen} close={onCloseLeaveComment} />
		</>
	)
}

export default ReviewCard
