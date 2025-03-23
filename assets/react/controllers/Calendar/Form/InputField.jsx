import React from "react";

/**
 * Composant pour la création d'un input
 * @param {string} label - Valeur du label
 * @param {string} type - Type d'input
 * @param {string} name - attr id de l'input
 * @param {string} value - Valeur de l'input
 * @param {Function} onChange - Fonction appelée lors du changement du champ
 * @param {object|null} error - Object contenant les erreurs du champ
 */
export default function InputField(
    {
        label,
        type = 'text',
        name,
        value,
        onChange,
        error
    }
) {
    return (
        <div className="mb-4">
            <label className="text-sm font-medium text-gray-700" htmlFor={name}>{label}</label>
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                className="mt-1 p-2 w-full border rounded focus:outline-none focus:border-blue-500"
            />
            {error && error.isUpdated && !error.isValid && (
                <p className="mt-1 text-red-500 text-sm">{error.message}</p>
            )}
        </div>
    );
}