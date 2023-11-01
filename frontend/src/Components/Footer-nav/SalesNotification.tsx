import { useContext, useEffect } from "react"
import { BoughtProps, Review, SoldProps } from "../../Services-types/types"
import { fetchOwnBought, fetchOwnSold, fetchOwnReviews } from "../../Services-types/services"
import { useNewSaleAndReviewContext } from "../../NewSaleAndReviewContext"
import { UserTokenContext } from "../../App"

const CHECK_NEW_SALES_TIME_INTERVAL_IN_MINUTES = 5

function SalesNotification() {
	const { setReviewCount, setSaleCount } = useNewSaleAndReviewContext()
	
	const [token] = useContext(UserTokenContext)

	useEffect(() => {
		let newSaleTimeout: NodeJS.Timeout
		const getSalesAndReviewsNeedingAttention = async () => {
			if (!token) return
			try {
				const sold: SoldProps[] = await fetchOwnSold(token)
				const needSending = sold.filter((sale) => sale.sales_status === "Odottaa lähetystä").length

				const bought: BoughtProps[] = await fetchOwnBought(token)
				const waitingReceiving = bought.filter((sale) => sale.sales_status === "Lähetetty").length

				const ownReviews: Review[] = await fetchOwnReviews(token)
				const unseenReviews = ownReviews.filter((review) => review.seen === false).length				

				setSaleCount(needSending + waitingReceiving)
				setReviewCount(unseenReviews)
			} catch (error) {
				console.error("Failed to get sales and reviews for notification badge: ", error)
			}
			newSaleTimeout = setTimeout(getSalesAndReviewsNeedingAttention, CHECK_NEW_SALES_TIME_INTERVAL_IN_MINUTES * 60 * 1000)
		}
		getSalesAndReviewsNeedingAttention()

		return () => {
			clearTimeout(newSaleTimeout)
		}

	}, [token, setSaleCount, setReviewCount])


	return (
		// Render sales notifications or UI updates here
		<div>
			{/* Your UI components for displaying sales notifications */}
		</div>
	)
}

export default SalesNotification
