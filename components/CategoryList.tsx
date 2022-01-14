import { Button, Flex, Skeleton } from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Categories, ImageContextInterface } from "../@types";
import { ImageContext } from "../contexts/ImageContext";
import { API_ENDPOINT } from "../lib/constants";

const CategoryList = () => {
    const [categories, setCategories] = useState<Categories>([]);

    const { currentCategory, handleClick } = useContext<ImageContextInterface>(ImageContext);

    useEffect(() => {
        async function getCategories() {
            try {
                const res = await axios.get(`${API_ENDPOINT}/endpoints`);
                setCategories(res.data.sfw);
            } catch (err) {
                alert("Something went wrong when fetching categories.");
                console.error(err);
            }
        }

        getCategories();
    }, []);

    return (
        <>
            <Flex wrap="wrap" justifyContent="center">
                {categories.length === 0 ? (
                    <Skeleton>
                        <Skeleton width="20px" />
                    </Skeleton>
                ) : (
                    categories.map((category) => {
                        return (
                            <Button
                                key={category}
                                borderRadius={0}
                                colorScheme="teal"
                                variant={category === currentCategory ? "solid" : "outline"}
                                onClick={() => handleClick(category)}
                            >
                                {category}
                            </Button>
                        );
                    })
                )}
            </Flex>
        </>
    );
};

export default CategoryList;
