// BadgeContext.ts
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react"

interface NewSaleAndReviewContextType {
	saleCount: number
	setSaleCount: Dispatch<SetStateAction<number>>
	reviewCount: number
	setReviewCount: Dispatch<SetStateAction<number>>
}

const SaleContext = createContext<NewSaleAndReviewContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export function useNewSaleAndReviewContext() {
	const context = useContext(SaleContext)
	if (context === undefined) {
		throw new Error("useBadgeContext must be used within a NewSaleAndReviewProvider")
	}
	return context
}

interface NewSaleAndReviewProviderProps {
	children: ReactNode;
}

export function NewSaleAndReviewProvider({ children }: NewSaleAndReviewProviderProps) {
	const [saleCount, setSaleCount] = useState<number>(0)
	const [reviewCount, setReviewCount] = useState<number>(0)

	return (
		<SaleContext.Provider value={{ saleCount, setSaleCount, reviewCount, setReviewCount }}>
			{children}
		</SaleContext.Provider>
	)
}