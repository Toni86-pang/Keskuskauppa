// BadgeContext.ts
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react"

interface BadgeContextType {
	badgeCount: number;
	setBadgeCount: Dispatch<SetStateAction<number>>;
}

const BadgeContext = createContext<BadgeContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export function useBadgeContext() {
	const context = useContext(BadgeContext)
	if (context === undefined) {
		throw new Error("useBadgeContext must be used within a BadgeProvider")
	}
	return context
}

interface BadgeProviderProps {
	children: ReactNode;
}

export function BadgeProvider({ children }: BadgeProviderProps) {
	const [badgeCount, setBadgeCount] = useState<number>(0)

	return (
		<BadgeContext.Provider value={{ badgeCount, setBadgeCount }}>
			{children}
		</BadgeContext.Provider>
	)
}