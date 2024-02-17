import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import './Images.css';
import UpdateContext from "./UpdaterContext";

import Image from "./Image";
import getColumsCount from "./GetColumnsCount";
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
    
    const COLUMNS_COUNT = getColumsCount(windowSize[0]);

    const {update} = useContext(UpdateContext);

    const [images, setImages] = useState<ResponseImage[]>([]);
    const [hasMoreImages, setHMI] = useState(true);

    function loadMoreImages(){
        axios.get(`images?start=${images.length}&length=8`)
        .then((res)=>{
            setImages([...images, ...res.data as ResponseImage[]]);
        })
        .catch((err)=>{
            console.log(err);
            setHMI(false);
        })
    }

    useEffect(
        ()=>{
            const cancelToken = axios.CancelToken.source();

            axios.get('images?start=0&length=16', {cancelToken: cancelToken.token})
            .then((res)=>{
                setImages(res.data as ResponseImage[]);
            })
            .catch((err)=>{
                console.log(err);
            })

            return ()=>cancelToken.cancel();
        },
        [update]
    )

    return (
        <section id="images"
        onScroll={(e)=>{

            // console.log(e);

            if(!hasMoreImages){
                return;
            }
            const {scrollTop, clientHeight, scrollHeight} = e.target as HTMLDivElement;

            // console.log(scrollTop, clientHeight, scrollHeight);

            if(scrollTop + clientHeight + 70 >= scrollHeight){
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
                            <span className="empty-image"></span>
                        </div>
                    )
                })
            }
        </section>
    )
}