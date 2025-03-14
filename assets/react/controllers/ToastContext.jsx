import {createContext, useCallback, useContext, useState} from "react";
import {Toast} from "./Toast";

const defaultValue = {
    toasts: [],
    setToasts: () => {}
};
const ToastContext = createContext(defaultValue)

export function ToastContextProvider({children}) {
    const [toasts, setToasts] = useState([])

    return <ToastContext.Provider value={{toasts, setToasts}}>
        <Toasts />
        {children}
    </ToastContext.Provider>
}

export function useToasts() {
    const {setToasts} = useContext(ToastContext)

    return {
        pushToast: useCallback((toast) => {
            setToasts(v => [...v, toast])
        }, [setToasts])
    }
}

function Toasts () {
    const {toasts} = useContext(ToastContext)

    return <div className="toast-container">
        {toasts.map((toast, k) => <Toast {...toast} key={k} /> )}
    </div>
}