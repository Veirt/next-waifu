import { createContext } from "react";
import { ImageContextInterface } from "../@types";

export const ImageContext = createContext<ImageContextInterface>({
    currentCategory: "waifu",
    handleClick: () => {},
});
