import {createContext, useCallback, useContext, useRef, useState} from "react";
import {Toast} from "./Toast";
import { v4 as uuidv4 } from 'uuid';

// Le composant Toasts remplace la fonction stockée dans la référence par sa propre fonction qui accède à son état local
// Les autres composants, via useToasts(), obtiennent une fonction qui appelle cette fonction remplacée
// Ainsi, quand n'importe quel composant appelle pushToast(), il déclenche indirectement la mise à jour de l'état dans Toasts
//
// Cette technique est parfois appelée "Ref Modèle" ou "callback injection" et elle est très utile pour :
// - Éviter les re-rendus en cascade
// - Créer des canaux de communication entre composants sans les coupler étroitement
// - Séparer "qui déclenche une action" de "qui réagit à cette action"

const ANIMATION_DURATION = 300; // en ms

// Un callback vide par défaut
const defaultCurrent = () => {}

// Valeur initiale du contexte avec une ref vide
const defaultValue = {
    pushToastRef: {current: defaultCurrent}
};

// Initialisation du contexte avec la valeur par défaut
const ToastContext = createContext(defaultValue)

export function ToastContextProvider({children}) {
    // Initialisation de la ref avec le callback vide
    const pushToastRef = useRef(defaultCurrent)

    return <ToastContext.Provider value={{ pushToastRef }}>
        <Toasts />
        {children}
    </ToastContext.Provider>
}

export function useToasts() {
    // Récupération de la ref depuis le contexte (même objet partagé partout)
    const { pushToastRef} =  useContext(ToastContext)

    return {
        pushToast: useCallback((toast) => {
            // Exécute le callback stocké dans la ref
            // À ce stade, ce callback a déjà été remplacé par Toasts
            pushToastRef.current(toast)
        }, [pushToastRef])
    }
}

function Toasts () {
    // État local pour stocker les toasts uniquement dans ce composant
    const [toasts, setToasts] = useState([])
    // Map pour stocker les états d'animation de sortie
    const [exiting, setExiting] = useState({});

    // Récupère la même ref partagée via le contexte
    const {pushToastRef} = useContext(ToastContext)

    // Remplace le callback vide par un callback qui met à jour l'état
    pushToastRef.current = (toast) => {
        const id = uuidv4();
        const newToast = { ...toast, id };

        setToasts(prevToasts  => [...prevToasts , newToast])

        // Auto-suppression après délai
        setTimeout(() => {
            // animation de sortie
            setExiting(prev => ({ ...prev, [id]: true }));

            // update state
            setTimeout(() => {
                removeToast(id);
            }, ANIMATION_DURATION);
        }, toast.duration || 5000);
    }

    const removeToast = (id) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));

        // Nettoyer l'état d'animation
        setExiting(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });
    };

    return <div className="toast-container">
        {toasts.map((toast) => (
            <Toast
                key={toast.id}
                {...toast}
                startExitAnimation={exiting[toast.id]}
                onClose={() => removeToast(toast.id)}
            />
        ))}
    </div>
}