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
            <div className="flex gap-4 mt-1">
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
                            className={`block w-[25px] h-[25px] rounded-full border-2 cursor-pointer ${
                                value === color.value ? "border-black" : "border-gray-400"
                            }`}
                            style={{ backgroundColor: color.background }}
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}