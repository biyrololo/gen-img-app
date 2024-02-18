import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import './Images.css';
import UpdateContext from "components/MainPage/UpdaterContext";

import Image from "./Image";
import { SkeletonImage } from "components/MainPage/Image";
import getColumsCount from "components/MainPage/GetColumnsCount";
import useWindowSize from "hooks/useWindowSize";

type ResponseImage = {
    id: number;
    image: string;
    prompt: string;
    negative_prompt: string;
    model: string;
}

export type { ResponseImage };

export default function Images(){

    const windowSize = useWindowSize();
    
    const COLUMNS_COUNT = getColumsCount(windowSize[0]*1.4);

    const NEEDED_IMAGES = COLUMNS_COUNT * 5;

    // const COLUMNS_COUNT = 2;

    const {update} = useContext(UpdateContext);

    const [images, setImages] = useState<ResponseImage[]>([]);
    const [isRequesting, setRQ] = useState(false);
    const [hasMoreImages, setHMI] = useState(true);

    function loadMoreImages(){
        axios.get(`images?start=${images.length}&length=${NEEDED_IMAGES}`)
        .then((res)=>{
            setImages([...images, ...res.data as ResponseImage[]]);
        })
        .catch((err)=>{
            console.log(err);
            setHMI(false);
        })
        .finally(()=>{setRQ(false)})
    }

    useEffect(
        ()=>{
            setRQ(true);
            const cancelToken = axios.CancelToken.source();

            axios.get(`images?start=0&length=${NEEDED_IMAGES}`, {cancelToken: cancelToken.token})
            .then((res)=>{
                setImages(res.data as ResponseImage[]);
            })
            .catch((err)=>{
                console.log(err);
            })
            .finally(()=>{setRQ(false)})

            return ()=>cancelToken.cancel();
        },
        [update]
    )

    return (
        <section id="images"
        onScroll={(e)=>{

            // console.log(e);

            if(!hasMoreImages || isRequesting){
                return;
            }
            const {scrollTop, clientHeight, scrollHeight} = e.target as HTMLDivElement;

            // console.log(scrollTop, clientHeight, scrollHeight);

            if(scrollTop + clientHeight + 500 >= scrollHeight){
                setRQ(true);
                loadMoreImages();
            }
        }}
        >
            {
                new Array(COLUMNS_COUNT).fill(0).map((_, index)=>{
                    return (
                        <div key={`column-${index}`} className={`column`}>
                            {
                                images.filter((_, imageIndex) => imageIndex % COLUMNS_COUNT === index).map((image, imageIndex)=>{
                                    return (
                                        <Image key={`image-${imageIndex}`} {...image} />
                                    )
                                })
                            }
                            {
                                isRequesting && <SkeletonImage />
                            }
                            <span className="empty-image"></span>
                        </div>
                    )
                })
            }
        </section>
    )
}