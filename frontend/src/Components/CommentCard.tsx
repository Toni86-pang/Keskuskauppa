import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import { CommentCardProps } from "../types"

const cardStyle = {
	marginTop: "10px",
	marginBottom: "10px"
}

function CommentCard({ reviewComment }: CommentCardProps) {

	return (
		<Card raised style={cardStyle}>
			<CardContent>
				<div>Myyjän kommentti:</div>
				<div >{reviewComment.comment}</div>
			</CardContent>
		</Card>
	)
}

export default CommentCard
