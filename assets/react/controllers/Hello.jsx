import React, { useState, useEffect } from 'react';


export default function (props) {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 5000);
        return () => clearTimeout(timer); // Nettoyage du timer si le composant est démonté
    }, []);

    return (
        <div>
            {showContent ? (
                <h1 className="text-2xl font-bold text-blue-500">Hello, {props.fullName}!</h1>
            ) : (
                <div>
                    Loading... <i className="fas fa-cog fa-spin fa-3x"></i>
                </div>
            )}
        </div>
    );
}
