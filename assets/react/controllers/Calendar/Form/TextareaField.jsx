import React from "react";

/**
 * Composant pour la création d'un textarea
 * @param {string} label - Valeur du label
 * @param {string} name - attribut : id, name du textarea et htmlFor du label
 * @param {string} value - Valeur du textarea
 * @param {Function} onChange - Fonction appelée lors du changement du champ
 * @param {object|null} error - Object contenant les erreurs du champ
 */
export default function TextareaField(
    {
        label,
        name,
        value,
        onChange,
        error
    }
) {
    return (
        <div className="mb-4">
            <label className="text-sm font-medium text-gray-700" htmlFor={name}>{label}</label>
            <textarea
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                className="mt-1 p-2 w-full border rounded focus:outline-none focus:border-blue-500 h-36"
            />
            {error && error.isUpdated && !error.isValid && (
                <p className="mt-1 text-red-500 text-sm">{error.message}</p>
            )}
        </div>
    );
}