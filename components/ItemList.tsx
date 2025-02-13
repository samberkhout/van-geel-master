import React from "react";

interface Item {
    id: number | string;
}

interface ItemListProps<T extends Item> {
    items: T[];
    getTitle: (item: T) => string;
    getSubtitle?: (item: T) => string;
    onEdit: (item: T) => void;
    onDelete: (id: number | string) => Promise<void> | void;
}


export default function ItemList<T extends Item>({
                                                     items,
                                                     getTitle,
                                                     getSubtitle,
                                                     onEdit,
                                                     onDelete,
                                                 }: ItemListProps<T>) {
    return (
        <ul className="mt-4">
            {items.map((item) => (
                <li
                    key={item.id}
                    className="flex justify-between items-center border-b border-gray-300 p-3"
                >
                    <div>
                        <span className="text-lg font-bold">{getTitle(item)}</span>
                        {getSubtitle && <p className="text-sm">{getSubtitle(item)}</p>}
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(item)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                        >
                            Bewerken
                        </button>
                        <button
                            onClick={() => onDelete(item.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                            Verwijderen
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
