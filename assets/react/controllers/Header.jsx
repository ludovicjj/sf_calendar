import React from 'react';

export default function Header({ title }) {
    return (
        <header>
            <h1 className="text-3xl font-medium pb-4">{title}</h1>
            <hr />
        </header>
    );
}