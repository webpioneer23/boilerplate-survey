import { ActionType } from 'typesafe-actions';
import { RouteProps } from 'react-router';
import * as H from "history";


/* --- EXPORTS --- */
export interface match<P> {
    params: P;
    isExact: boolean;
    path: string;
    url: string;
}


type ItemType = {
    brandName?: string
    productName?: string
    productNameOther?: boolean
    shadeName?: string
}

type ProductItem = {
    name: string
    shades: Array<{ name: string }>
}

type Product = {
    brand: string
    product: Array<ProductItem>
}

type FoundationState = {
    brand: Array<string>,
    productOptions: Array<Array<string>>,
    products: Array<Product>,
    selectedItems: Array<ItemType>,
    shadeOptions: Array<Array<string>>
    suggestions: Array<Product>
};

interface FoundationProp<P> {
    foundationList: Array<ItemType>,
    history: H.History,
    location: RouteProps["location"],
    match: match<P>,
    referrer: null | string,
    setFoundation: (val: Array<ItemType>) => void
};

export { FoundationProp, FoundationState };
