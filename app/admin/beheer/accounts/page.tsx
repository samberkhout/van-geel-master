"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProtectedLayout from "@/components/ProtectedLayout";
import { getUsers, addUser, deleteUser, updateUser } from "@/app/actions/actions";

interface User {
    id: string;
    name: string | null;
    email: string;
    rol: "USER" | "ADMIN";
}

export default function AccountsPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("Werknemer");

    useEffect(() => {
        async function fetchData() {
            const usersData = await getUsers();
            setUsers(usersData);
        }
        fetchData();
    }, []);

    function getFormattedRole(role: "USER" | "ADMIN"): string {
        return role === "ADMIN" ? "Beheerder" : "Werknemer";
    }

    async function handleSaveUser(e: React.FormEvent) {

        e.preventDefault();
        if (!email.trim()) {
            alert("E-mail is verplicht.");
            return;
        }

        try {
            if (editMode && selectedUser) {
                await updateUser(selectedUser.id, name, email, rol, password);
                alert("Gebruiker bijgewerkt!");
            } else {
                await addUser(name, email, password, rol);
                alert("Gebruiker toegevoegd!");
            }

            setModalOpen(false);
            setUsers(await getUsers());
            setEditMode(false);
            setPassword("");
        } catch (error) {
            alert(error);
        }
    }

    function handleEditUser(user: User) {
        setSelectedUser(user);
        setName(user.name || "");
        setEmail(user.email);
        setRol(getFormattedRole(user.rol));
        setPassword("");
        setEditMode(true);
        setModalOpen(true);
    }

    async function handleDeleteUser(id: string) {
        const confirmDelete = window.confirm("Weet je zeker dat je deze gebruiker wilt verwijderen?");
        if (confirmDelete) {
            try {
                await deleteUser(id);
                setUsers(prev => prev.filter(u => u.id !== id));
                alert("Gebruiker verwijderd!");
            } catch (error) {
                alert(error);
            }
        }
    }

    return (
        <ProtectedLayout>
            <div className="min-h-screen bg-green-100 text-black">
                <Header />
                <div className="container mx-auto px-6 py-10">
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h1 className="text-3xl font-bold mb-6 text-center">Accounts Beheer</h1>

                        <div className="flex justify-between mb-4">
                            <input
                                type="text"
                                placeholder="Zoek op naam of e-mail..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                            />
                            <button
                                onClick={() => {
                                    setEditMode(false);
                                    setModalOpen(true);
                                    setSelectedUser(null);
                                    setName("");
                                    setEmail("");
                                    setPassword("");
                                    setRol("Werknemer");
                                }}
                                className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                + Toevoegen
                            </button>
                        </div>

                        <ul className="mt-4">
                            {users
                                .filter((u) =>
                                    u.name?.toLowerCase().includes(search.toLowerCase()) ||
                                    u.email.toLowerCase().includes(search.toLowerCase())
                                )
                                .map((u) => (
                                    <li key={u.id} className="flex justify-between items-center border-b border-gray-300 p-3">
                                        <div>
                                            <span className="text-lg font-bold">{u.name || "Geen naam"}</span>
                                            <p className="text-sm">{u.email}</p>
                                            <p className="text-xs font-semibold">Rol: {getFormattedRole(u.rol)}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditUser(u)}
                                                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                                            >
                                                Bewerken
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(u.id)}
                                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                            >
                                                Verwijderen
                                            </button>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>

                {modalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">{editMode ? "Gebruiker bewerken" : "Account toevoegen"}</h2>
                            <form onSubmit={handleSaveUser}>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Naam (optioneel)"
                                    className="border p-2 rounded w-full text-black focus:ring-1 focus:ring-green-500"
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="E-mail"
                                    required
                                    className="border p-2 rounded w-full mt-2 text-black focus:ring-1 focus:ring-green-500"
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={editMode ? "Nieuw wachtwoord (optioneel)" : "Wachtwoord"}
                                    className="border p-2 rounded w-full mt-2 text-black focus:ring-1 focus:ring-green-500"
                                />
                                <select
                                    value={rol}
                                    onChange={(e) => setRol(e.target.value)}
                                    className="border p-2 rounded w-full mt-2 text-black focus:ring-1 focus:ring-green-500"
                                >
                                    <option value="Werknemer">Werknemer</option>
                                    <option value="Beheerder">Beheerder</option>
                                </select>
                                <div className="mt-4 flex justify-between">
                                    <button type="button" onClick={() => setModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Annuleren</button>
                                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Opslaan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedLayout>
    );
}
