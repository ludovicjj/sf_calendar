import React from "react";

/**
 * Composant pour sélectionner la couleur d'un événement
 * @param {Array} colors - Tableau d'objets {background, value} représentant les couleurs disponibles
 * @param {string} value - Valeur de la couleur sélectionnée
 * @param {string} label - Label
 * @param {Function} onChange - Fonction appelée lors du changement de couleur
 */
export default function ColorField({ colors, value, label, onChange }) {
    return (
        <div className="mb-4">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <div className="flex gap-3 mt-2">
                {colors.map((color) => (
                    <label key={color.value} className="flex items-center color-item">
                        <input
                            type="radio"
                            name="color"
                            value={color.value}
                            className="p-2 rounded-full hidden"
                            checked={value === color.value}
                            onChange={onChange}
                        />
                        <span
                            className={`
                                w-[30px] h-[30px] rounded cursor-pointer
                                hover:scale-110 transition-transform
                                flex items-center justify-center shadow
                                ${color.class} 
                            `}
                        >
                             {value === color.value && (
                                 <svg
                                     xmlns="http://www.w3.org/2000/svg"
                                     className="h-5 w-5 text-white"
                                     fill="none"
                                     viewBox="0 0 24 24"
                                     stroke="currentColor"
                                 >
                                     <path
                                         strokeLinecap="round"
                                         strokeLinejoin="round"
                                         strokeWidth={2}
                                         d="M5 11l6 6l10 -10"
                                     />
                                 </svg>
                             )}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}