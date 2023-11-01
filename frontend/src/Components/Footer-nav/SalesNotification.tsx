import { useContext, useEffect } from "react"
import { BoughtProps, SoldProps } from "../../Services-types/types"
import { fetchOwnBought, fetchOwnSold } from "../../Services-types/services"
import { useBadgeContext } from "../../BadgeContext"
import { UserTokenContext } from "../../App"

const CHECK_NEW_SALES_TIME_INTERVAL_IN_MINUTES = 5

function SalesNotification() {
	const { setBadgeCount } = useBadgeContext()
	const [token] = useContext(UserTokenContext)

	useEffect(() => {
		let newSaleTimeout: NodeJS.Timeout
		const getSalesNeedingAttention = async () => {
			if (!token) return
			try {
				const sold: SoldProps[] = await fetchOwnSold(token)
				const needSending = sold.filter((sale) => sale.sales_status === "Odottaa lähetystä").length

				const bought: BoughtProps[] = await fetchOwnBought(token)
				const waitingReceiving = bought.filter((sale) => sale.sales_status === "Lähetetty").length

				setBadgeCount(needSending + waitingReceiving)
			} catch (error) {
				console.error("Failed to get sales for notification badge: ", error)
			}
			newSaleTimeout = setTimeout(getSalesNeedingAttention, CHECK_NEW_SALES_TIME_INTERVAL_IN_MINUTES * 60 * 1000)
		}
		getSalesNeedingAttention()

		return () => {
			clearTimeout(newSaleTimeout)
		}

	}, [token, setBadgeCount])


	return (
		// Render sales notifications or UI updates here
		<div>
			{/* Your UI components for displaying sales notifications */}
		</div>
	)
}

export default SalesNotification
