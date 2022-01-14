import { Container } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useState } from "react";
import type { Category } from "../@types";
import CategoryList from "../components/CategoryList";
import ImageList from "../components/ImageList";
import { ImageContext } from "../contexts/ImageContext";

const Home: NextPage = () => {
    const [currentCategory, setCurrentCategory] = useState<Category>("waifu");
    const handleClick = (category: Category) => {
        setCurrentCategory(category);
    };

    return (
        <ImageContext.Provider value={{ currentCategory, handleClick }}>
            <Container my="10" maxW="container.xl">
                <CategoryList />
            </Container>
            <Container my="10" maxW="container.xl">
                <ImageList />
            </Container>
        </ImageContext.Provider>
    );
};

export default Home;
