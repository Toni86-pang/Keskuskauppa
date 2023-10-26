import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import { CommentCardProps } from "../../../Services-types/types"

const cardStyle = {
	marginTop: "10px",
	marginBottom: "10px"
}

function CommentCard({ reviewComment }: CommentCardProps) {

	return (
		<Card style={cardStyle}>
			<CardContent>				
				<p>Myyjän kommentti:</p>
				<p>{reviewComment.comment}</p>
			</CardContent>
		</Card>
	)
}

export default CommentCard
