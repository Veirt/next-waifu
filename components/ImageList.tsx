import { AspectRatio, SimpleGrid, Skeleton, Image } from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import type { ImageContextInterface, Images } from "../@types";
import { ImageContext } from "../contexts/ImageContext";
import { API_ENDPOINT } from "../lib/constants";
import Loading from "./Loading";

const ImageList = () => {
    const [images, setImages] = useState<Images>([]);
    const { currentCategory } = useContext<ImageContextInterface>(ImageContext);

    // get categories
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
    );
};

export default ImageList;
