import { AspectRatio, Button, Container, Flex, Image, SimpleGrid, Skeleton } from "@chakra-ui/react";
import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

// TODO: split all files to individual components
const Home: NextPage = () => {
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState("waifu");
    const API_ENDPOINT = "https://api.waifu.pics";

    const handleClick = (category: string) => {
        setCurrentCategory(category);
    };

    // get categories
    useEffect(() => {
        // TODO: handle error when response code is not 200
        async function getCategories() {
            const res = await axios.get(`${API_ENDPOINT}/endpoints`);
            setCategories(res.data.sfw);
        }

        getCategories();
    }, []);

    useEffect(() => {
        // TODO: handle error when response code is not 200
        async function getImages() {
            const res = await axios.post(`${API_ENDPOINT}/many/sfw/${currentCategory}`, {
                excludes: [],
            });

            setImages(res.data.files);
        }

        getImages();
    }, [currentCategory]);

    return (
        <>
            <Container my="10" maxW="container.xl">
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
            </Container>

            <Container my="10" maxW="container.xl">
                <SimpleGrid minChildWidth="300px" spacing="40px">
                    {"Loading..." &&
                        images.map((image) => {
                            return (
                                <AspectRatio maxW="400px" ratio={1}>
                                    <Image key={image} src={image} objectPosition="top" />
                                </AspectRatio>
                            );
                        })}
                </SimpleGrid>
            </Container>
        </>
    );
};

export default Home;
