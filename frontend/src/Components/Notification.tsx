import { useState, useEffect } from "react"

interface NotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

function Notification({ message, type, onClose }: NotificationProps) {
	const [isVisible, setIsVisible] = useState(true)

	// Debugging: Log the message and type
	console.log("Message:", message)
	console.log("Type:", type)

	useEffect(() => {
		const timeout = setTimeout(() => {
			setIsVisible(false)
			onClose()
		}, 5000) 

		return () => clearTimeout(timeout)
	}, [onClose])

	return (
		<div
			className={`notification ${isVisible ? "show" : "hide"} ${type}`}
		>
			<p>{message}</p>
		</div>
	)
}

export default Notification
