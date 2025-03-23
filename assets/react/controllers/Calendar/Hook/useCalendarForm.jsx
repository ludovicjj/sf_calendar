import {useCallback, useState} from "react";
import {isStartBeforeEnd} from "../../../utils/eventUtils";

/**
 * Hook personnalisé pour gérer un formulaire d'événement du calendrier
 * @param {Object} options - Options du hook
 * @param {Object} options.initialData - Valeurs initiales du formulaire
 * @param {Object} options.initialErrors - Règles de validation pour chaque champ
 * @returns {Object} - États et fonctions pour gérer le formulaire
 */
export default function useCalendarForm({ initialData, initialErrors }) {
    // State
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState(initialErrors);

    // Constraints
    const notBlank = value => value.trim() !== "";
    const isValidDate = value => value.trim() === "" || validateAndFormatDate(value).isValid
    const isAfterStart = (end, formData) => {
        if (!end.trim() || !formData.start.trim()) return true;
        if (!validateAndFormatDate(end).isValid || !validateAndFormatDate(formData.start).isValid) return true;
        return isStartBeforeEnd(formData.start, end);
    };

    // Helper
    const rule = (callback, message) => ({ test: callback, message });

    // Constraints by field
    const validationRules = {
        title: [
            rule(notBlank, "Cette valeur ne peut pas être vide.")
        ],
        start: [
            rule(notBlank, "Cette valeur ne peut pas être vide."),
            rule(isValidDate, "La date saisie est invalide.")
        ],
        end: [
            rule(notBlank, "Cette valeur ne peut pas être vide."),
            rule(isValidDate, "La date saisie est invalide."),
            rule(isAfterStart, "La date de fin doit être supérieure à la date de début.")
        ]
    };


    /**
     * Valide et formate une date saisie
     * @param {string} inputValue - Valeur saisie par l'utilisateur
     * @returns {Object} - Valeur formatée et état de validité
     */
    const validateAndFormatDate = (inputValue) => {
        // Seuls les chiffres sont autorisés
        let value = inputValue.replace(/[^0-9]/g, "");

        let day = value.slice(0, 2);
        let month = value.slice(2, 4);
        let year = value.slice(4, 8);
        let hours = value.slice(8, 10);
        let minutes = value.slice(10, 12);

        // Limiter les valeurs aux plages valides
        if (day > 31) day = "31";
        if (month > 12) month = "12";
        if (hours > 23) hours = "23";
        if (minutes > 59) minutes = "59";

        // Construire la valeur formatée
        let formattedValue = "";
        if (day) formattedValue += day;
        if (month) formattedValue += `-${month}`;
        if (year) formattedValue += `-${year}`;
        if (hours) formattedValue += ` ${hours}`;
        if (minutes) formattedValue += `:${minutes}`;

        // Vérifier si la date est valide
        const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
        const isValid =
            date?.getDate() === parseInt(day, 10) &&
            date?.getMonth() + 1 === parseInt(month, 10) &&
            date?.getFullYear() === parseInt(year, 10);

        return { formattedValue, isValid };
    };

    /**
     * Gère les changements dans les champs du formulaire
     * @param {Event} e - Événement de changement
     */
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        let updatedValue = value;

        // Traitement spécial pour les champs de date
        if (["start", "end"].includes(name)) {
            const result = validateAndFormatDate(value);
            updatedValue = result.formattedValue;
        }

        // Mise à jour des données du formulaire
        const updatedFormData = {
            ...formData,
            [name]: updatedValue,
        };

        setFormData(updatedFormData);

        // Mise à jour des erreurs pour le champ
        if (name in validationRules) {
            const result = validateField(name, updatedValue, updatedFormData)
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: {
                    isValid: result.isValid,
                    isUpdated: true,
                    message: result.isValid ? prevErrors[name].message : result.message
                }
            }));
        }
    }, [formData, validationRules]);

    /**
     * Valide un champ donnée du formulaire
     * @param {string} fieldName - Nom du champ à valider
     * @param {string} value - Valeur à valider
     * @param {Object} formData - Données du formulaire à valider
     * @return {{isValid: boolean, message: string}|{isValid: boolean, message}}
     */
    const validateField = (fieldName, value, formData) => {
        const rules = validationRules[fieldName] || [];
        for (const rule of rules) {
            if (!rule.test(value, formData)) {
                return {
                    isValid: false,
                    message: rule.message,
                };
            }
        }

        return { isValid: true, message: "" };
    };

    /**
     * Valide le formulaire complet
     * @param {Object} formData - Données du formulaire à valider
     * @returns {boolean} - true si le formulaire est valide
     */
    const validateForm = (formData) => {
        let formIsValid = true;
        const newErrors = { ...errors };

        Object.keys(validationRules).forEach(fieldName => {
            const result = validateField(fieldName, formData[fieldName], formData);
            newErrors[fieldName] = {
                isValid: result.isValid,
                isUpdated: true,
                message: result.isValid ? errors[fieldName].message : result.message
            };

            if (!result.isValid) {
                formIsValid = false;
            }
        });

        setErrors(newErrors);

        return formIsValid
    };

    return {
        formData,
        errors,
        handleChange,
        validateForm,
        setFormData,
        setErrors,
        validateAndFormatDate
    };
}