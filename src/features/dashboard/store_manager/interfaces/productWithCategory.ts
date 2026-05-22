export interface ProductWithCategory {
    id: number;
    name: string;
    image_url: string;
    price: number;
    premium: boolean;
    category_id: number;
    categories: {
        name: string;
    };
}