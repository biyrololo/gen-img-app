import { TextField, Button, Skeleton, CircularProgress, Select, Autocomplete, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import './Form.css';

import DownloadIcon from '@mui/icons-material/Download';
import { useLocation, useNavigate } from "react-router-dom";
import CircularProgressWithLabel from "components/CircularProgressWithValue";

import UpdaterContext from "components/MainPage/UpdaterContext";

type GenerateImagePayload = {
    prompt: string;
    negative_prompt: string;
    model: string;
}

export default function Form(){

    const {setUpdate} = useContext(UpdaterContext);

    const location = useLocation();

    const state = location.state;

    const [prompt, setPrompt] = useState<string>('');
    const [negPrompt, setNegPrompt] = useState<string>('');

    const [resultImage, setResultImage] = useState<string>('');

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [loadingTimer, setLoadingTimer] = useState<number>(0);

    const [models, setModels] = useState<string[]>([]);

    const [selectedModel, setSelectedModel] = useState<string>('SD V1.4');

    useEffect(
        ()=>{
            if(state){
                if(state.prompt !== undefined&& state.negative_prompt !== undefined && state.model !== undefined){
                    setPrompt(state.prompt);
                    setNegPrompt(state.negative_prompt);
                    setSelectedModel(state.model);
                }
            }
        },
        [location.state?.prompt, location.state?.negative_prompt, location.state?.model]
    )

    useEffect(
        ()=>{

            const cancelToken = axios.CancelToken.source();

            axios.get('get-models', {cancelToken: cancelToken.token})
            .then((res)=>{
                setModels(res.data);
            })
            .catch((err)=>{
                console.log(err);
            })

            return ()=>cancelToken.cancel();
        },
        []
    )

    function generate_image(){

        if(isLoading){
            toast.error('Please wait for image to be generated');
            return;
        }

        if(!selectedModel){
            toast.error('Select model');
            return;
        }

        if(!prompt){
            toast.error('Enter prompt');
            return;
        }

        if(models.indexOf(selectedModel) === -1){
            setSelectedModel('');
            toast.error('Model not found');
            return;
        }

        setLoadingTimer(0);

        const payload : GenerateImagePayload = {
            prompt,
            negative_prompt: negPrompt,
            model: selectedModel
        }

        setIsLoading(true);

        const interval = setInterval(()=>{
            setLoadingTimer((prev)=>{
                return prev + 1;
            })
        }, 120)

        axios.post('generate-image', 
            payload, {}
        )
        .then((res)=>{
            setResultImage(`data:image/png;base64,${res.data}`);
            setUpdate(1);
        })
        .catch((err)=>{
            toast.error('Something went wrong');
            console.log(err);
        })
        .finally(()=>{
            setIsLoading(false);

            clearInterval(interval);
        })
    }

    function download_image(){
        if(!resultImage){
            toast.error('Generate image first');
        }

        const link = document.createElement('a');

        link.href = resultImage;

        link.download = 'image.png';

        link.click();

        link.remove();
    }

    return (
        <div className="d-flex fd-column g-20" id="generate-image-form">
            <Typography variant="h6">Generate Image</Typography>
            <Autocomplete
            id="model-select"
            options={models}
            value={selectedModel}
            onChange={
                (e, value)=>{
                    setSelectedModel(value || '');
                }
            }
            renderInput={
                (params)=>(
                    <TextField
                    {...params}
                    label="Model"
                    color="secondary"
                    />
                )
            }
            />
            <TextField
            id="prompt-input"
            label="Prompt"
            placeholder="write a prompt"
            value={prompt}
            color="secondary"
            onChange={
                (e)=>{
                    setPrompt(e.target.value || '');
                }
            }
            fullWidth
            multiline
            rows={5}
            // inputProps={
            //     {
            //         style: {
            //             maxHeight: 90,
            //             overflowY: 'scroll'
            //         },
            //     }
            // }
            />
            <TextField
            id="negative-prompt-input"
            label="Negative prompt"
            placeholder="write a negative prompt"
            value={negPrompt}
            color="secondary"
            onChange={
                (e)=>{
                    setNegPrompt(e.target.value || '');
                }
            }
            fullWidth
            multiline
            rows={3}
            // inputProps={
            //     {
            //         style: {
            //             maxHeight: 100,
            //             overflowY: 'scroll'
            //         }
            //     }
            // }
            />
            <Button variant="contained" onClick={generate_image} className="main-gradient">
                Generate
            </Button>
            <section id="result-image">
                {
                    isLoading ? 
                    <div id="loader">
                        <Skeleton variant="rounded" width={400} height={400} 
                        // animation="wave"
                        />
                        {/* <CircularProgress id="progress" variant="determinate" value={-loadingTimer * 100 / 40}/> */}
                        <div id="progress">
                            {
                                loadingTimer <= 100 ?
                                <CircularProgressWithLabel value={Math.min(loadingTimer, 100)} variant="determinate"/> :
                                <p>Waiting...</p>
                            }
                        </div>
                    </div> :
                    <>
                        {
                            resultImage ? 
                            <>
                            <img src={resultImage} alt="result-image" />
                            <Button variant="contained" className="w-100 main-gradient" onClick={download_image}>
                                Download 
                                <DownloadIcon/>
                            </Button>
                            </> :
                            <p>No image generated yet</p>
                        }
                    </>
                }
            </section>
        </div>
    )
}