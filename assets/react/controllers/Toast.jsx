export function Toast({ title, content}) {
    return (
        <div className="w-full p-4 text-gray-900 bg-white rounded-lg shadow-md mb-4" role="alert">
            <div className="ms-3 text-sm font-normal">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{title}</div>
                <div className="text-sm font-normal">{content}</div>
            </div>
        </div>
    );
}