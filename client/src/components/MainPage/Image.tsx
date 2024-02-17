import { Button, Divider, IconButton, Skeleton } from "@mui/material";
import { ResponseImage } from "./Images";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useNavigate } from "react-router-dom";
import DownloadIcon from '@mui/icons-material/Download';

export default function Image(props: ResponseImage) {

    const navigate = useNavigate();

    const handleRemix = () => {
        const state = {
            prompt: props.prompt,
            negative_prompt: props.negative_prompt,
            model: props.model
        }

        navigate('/', {state: state});
    }

    function handleDownload() {
        const link = document.createElement('a');

        link.href = `data:image/png;base64,${props.image}`;

        link.download = 'image.png';

        link.click();

        link.remove();
    }

    return(
        <div className="image">
            <div>
                <img src={`data:image/png;base64,${props.image}`} alt={props.prompt} />
            </div>
            <section>
                <IconButton className="download" onClick={handleDownload}
                style={{borderRadius: 0}}
                
                >
                    <DownloadIcon sx={{borderRadius: 0}}/>
                </IconButton>
                <Divider variant="middle" orientation="vertical" flexItem/>
                <Button
                variant="contained"
                className="remix"
                onClick={handleRemix}
                >
                    <AutorenewIcon className="icon"/>
                    Remix
                </Button>
            </section>
            <p>{props.prompt.slice(0, 50)}{props.prompt.length > 50 ? '...' : ''}</p>
        </div>
    )
}