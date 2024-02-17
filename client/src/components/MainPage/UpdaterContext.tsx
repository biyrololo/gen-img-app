import { createContext, useState } from "react";

type Updater = {
    update: number;
    setUpdate: (value: number) => void;
}

const UpdateContext = createContext<Updater>({
    update: 0,
    setUpdate: () => {}
})

export default UpdateContext;