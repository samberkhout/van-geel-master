"use client";

interface SearchAndAddButtonProps {
    search: string;
    setSearch: (value: string) => void;
    onAdd: () => void;
    placeholder?: string;
    addButtonLabel?: string;
}

export default function SearchAndAddButton({
                                               search,
                                               setSearch,
                                               onAdd,
                                               placeholder = "Zoek...",
                                               addButtonLabel = "+ Toevoegen"
                                           }: SearchAndAddButtonProps) {
    return (
        <div className="flex justify-between mb-4">
            <input
                type="text"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button
                onClick={onAdd}
                className="ml-4 w-36 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
                {addButtonLabel}
            </button>
        </div>
    );
}
