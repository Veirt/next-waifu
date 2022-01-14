type Image = string;
export type Images = Array<Image>;

export type Category = string;
export type Categories = Array<Category>;

export interface ImageContextInterface {
    currentCategory: Category;
    handleClick: (category: Category) => void;
}
