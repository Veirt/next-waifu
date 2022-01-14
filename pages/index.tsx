import { AspectRatio, Button, Container, Flex, Image, SimpleGrid, Skeleton } from "@chakra-ui/react";
import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import type { Categories, Category, Images } from "../@types";
import Loading from "../components/Loading";
import { API_ENDPOINT } from "../lib/constants";

const Home: NextPage = () => {
    const [images, setImages] = useState<Images>([]);
    const [categories, setCategories] = useState<Categories>([]);
    const [currentCategory, setCurrentCategory] = useState<Category>("waifu");

    // get categories
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

    useEffect(() => {
        async function getImages() {
            try {
                const res = await axios.post(`${API_ENDPOINT}/many/sfw/${currentCategory}`, {
                    excludes: [],
                });

                setImages(res.data.files);
            } catch (err) {
                alert("Something went wrong when fetching images.");
                console.error(err);
            }
        }

        getImages();
    }, [currentCategory]);

    const handleClick = (category: Category) => {
        setCurrentCategory(category);
    };

    async function getMoreImages() {
        try {
            const res = await axios.post(`${API_ENDPOINT}/many/sfw/${currentCategory}`, {
                excludes: [],
            });

            const incomingImages: Images = res.data.files;

            const filteredIncomingImages = incomingImages.filter((image) => !images.includes(image));

            setImages([...images, ...filteredIncomingImages]);
        } catch (err) {
            alert("Something went wrong when fetching more images.");
            console.error(err);
        }
    }

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
            </Container>

            <Container my="10" maxW="container.xl">
                <InfiniteScroll dataLength={images.length} next={getMoreImages} hasMore={true} loader={<Loading />}>
                    <SimpleGrid minChildWidth="300px" spacing="40px">
                        {images.map((image) => {
                            return (
                                <AspectRatio key={image} maxW="400px" ratio={1}>
                                    <Image src={image} alt="" objectPosition="top" fallback={<Skeleton />} />
                                </AspectRatio>
                            );
                        })}
                    </SimpleGrid>
                </InfiniteScroll>
            </Container>
        </>
    );
};

export default Home;
