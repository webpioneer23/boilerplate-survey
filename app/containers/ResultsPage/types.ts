import { history } from 'history'

interface ResultsPageProps {
    sku: string,
    productId: string,
    groupId: string,
    affId: string,
    pbId: string,
    referrer: string,
    showBrand: string[],
    coverage: string[],
    userId: number,
    match: {
        isExact: boolean
        params: { smartId: string }
        path: string
        url: string
    },
    location: history['history'],
    selectBrand: (val: string) => void,
    progressItems: string[],
    jwtToken: string,
    mimecid: string,
    imageId: number,
    primaryTone: string[],
    undertoneChoice: string[]
    acceptedBiometrics: boolean
}

type PrincingType = {
    currency: string
    isOnSale: boolean
    priceFormatted: string
    regularPriceFormatted: string
    salePriceFormatted: string
}

type Product = {
    id?: number
    isLiked?: boolean
    regularPrice?: string
    out_of_stock?: boolean
    imageUrl?: string
    name?: string
    color?: string
    pricing?: PrincingType
    productUrl?: string
    purchaseUrl?: string
}

type ProductProps = {
    item: Product
    jwtToken: string
    mimecid: string
    isFeatured: boolean
}

type ProductState = {
    id: number
    isLiked: boolean
    title: string,
    brand: string,
    shadeName: string,
    price: string,
    currency: string,
}

interface ProducListProps {
    products: Array<Product>,
    firstLoad: boolean,
    isFeatured: boolean,
    handleItemLike: (val?: Product) => void,
}

interface ResultsPageState {
    filterReset: boolean,
    smartId,
    firstLoad: boolean,
    page: 1,
    minPrice: number,
    maxPrice: number,
    filterMenuVisible: boolean,
    products: Array<Product>,
    filters: {
        coverage?: string[],
        undertone?: [],
        brands?: string[],
    },
    selectedFilters: {
        coverage?: string[],
        undertone?: [],
        brands?: string[],
    },
    complexionType: string,
    undertone: string,
    undertoneAPI: string,
    message: string,
    photoIssue: boolean,
    totalResultApiHitCount: number,
    currentResultAPiHitCount: number,
}

export {
    ResultsPageProps, ResultsPageState, ProductProps, ProductState, ProducListProps, Product
}