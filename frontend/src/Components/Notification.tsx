import { useState, useEffect } from "react"

// Define the props interface
interface NotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

// Create the Notification component
function Notification({ message, type, onClose }: NotificationProps) {
	const [isVisible, setIsVisible] = useState(true)

	useEffect(() => {
		const timeout = setTimeout(() => {
			setIsVisible(false)
			onClose()
		}, 5000)

		return () => clearTimeout(timeout)
	}, [onClose])

	return (
		<div className={`notification ${isVisible ? "show" : "hide"} ${type}`}>
			<p>{message}</p>
		</div>
	)
}

export default Notification
