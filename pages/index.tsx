import { AspectRatio, Button, Container, Flex, Image, SimpleGrid, Skeleton } from "@chakra-ui/react";
import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

// TODO: split all files to individual components
const Home: NextPage = () => {
    const [images, setImages] = useState<string[]>([]);
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

    // TODO: handle error when response code is not 200
    async function getMoreImages() {
        const res = await axios.post(`${API_ENDPOINT}/many/sfw/${currentCategory}`, {
            excludes: [],
        });

        const incomingImages: string[] = res.data.files;

        const filteredIncomingImages = incomingImages.filter((image) => !images.includes(image));

        setImages([...images, ...filteredIncomingImages]);
    }

    useEffect(() => {
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
                <InfiniteScroll
                    dataLength={images.length}
                    next={getMoreImages}
                    hasMore={true}
                    loader={<h3> Loading...</h3>}
                    endMessage={<h4>Nothing more to show</h4>}
                >
                    <SimpleGrid minChildWidth="300px" spacing="40px">
                        {"Loading..." &&
                            images.map((image) => {
                                return (
                                    <AspectRatio key={image} maxW="400px" ratio={1}>
                                        <Image src={image} alt="" objectPosition="top" />
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
