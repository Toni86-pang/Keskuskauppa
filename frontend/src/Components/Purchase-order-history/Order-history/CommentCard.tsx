// import Card from "@mui/material/Card"
// import CardContent from "@mui/material/CardContent"
import { CommentCardProps } from "../../../Services-types/types"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Avatar from "@mui/material/Avatar"


const gridContainerStyle = {
	alignItems: "center"
}
function CommentCard({ reviewComment, seller }: CommentCardProps) {

	return (
		<Paper elevation={3}>	
			<Box p={2}>		
				<Grid container spacing={2} style={gridContainerStyle} >
					<Grid item xs={0}>
						<Avatar src={typeof seller?.user_image === "string" ? seller.user_image : undefined}
							alt={seller?.name}
							sx={{
								width: "25",
								height: "25",
								m: 1

							}} />
					</Grid>
					<Grid item xs={6}>
						<Typography sx={{fontSize: "0.9rem"}}>{seller?.username} vastaa:</Typography><br/>
					</Grid>
					<Grid item xs={6}>
						<Typography ml={9} mb={1} sx={{fontSize: "0.9rem"}}>{reviewComment.comment}</Typography>
					</Grid>
				</Grid>
			</Box>	
		</Paper>
	)
}

export default CommentCard
