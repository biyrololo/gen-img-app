import Form from "components/MainPage/Form";
import { createContext, useState } from "react";
import Images from "components/MainPage/Images";
import UpdateContext from "components/MainPage/UpdaterContext";

export default function MainPage(){

    const [update, setUpdate] = useState(0);

    return (
        <UpdateContext.Provider 
        value={
            {
                update, 
                setUpdate: (change: number) => setUpdate((prev) => prev + change)
            }
        }
        >
            <div className="d-flex jc-space-between ai-flex-start">
                <Images/>
                <Form/>
            </div>
        </UpdateContext.Provider>
    )
}