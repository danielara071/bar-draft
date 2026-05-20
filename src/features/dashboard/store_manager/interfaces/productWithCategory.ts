export interface ProductWithCategory {
    id: number;
    name: string;
    image_url: string;
    price: number;
    premium: boolean;
    categories: {
        name: string;
    };
}