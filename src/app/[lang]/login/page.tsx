'use client';

import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const LoginPage = () => {
    const [email, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            console.log("Sending login request...");
            const response = await axios.post("/api/user/login", {
                email,
                password,
            });
            console.log("Response received:", response);

            // Save the token in cookies
            const token = response.data.token;
            Cookies.set("token", token, { expires: 1 }); // Expires in 1 day

            alert("Login successful");
        } catch (err) {
            console.error("Error during login:", err);
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen"
        >
            <div
                className="p-8 rounded-lg shadow-lg w-full max-w-md bg-(--glacier-50)"
                style={{
                    backgroundColor: "var(--color-glacier-50)",
                    color: "var(--color-glacier-900)",
                }}
            >
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium mb-1"
                        >
                            Username:
                        </label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-2 rounded border"
                            style={{
                                backgroundColor: "var(--color-glacier-100)",
                                color: "var(--color-glacier-900)",
                                borderColor: "var(--color-glacier-300)",
                            }}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium mb-1"
                        >
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 rounded border"
                            style={{
                                backgroundColor: "var(--color-glacier-100)",
                                color: "var(--color-glacier-900)",
                                borderColor: "var(--color-glacier-300)",
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 font-semibold rounded transition"
                        style={{
                            backgroundColor: "var(--color-glacier-500)",
                            color: "var(--color-glacier-50)",
                        }}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor =
                                "var(--color-glacier-600)")
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor =
                                "var(--color-glacier-500)")
                        }
                    >
                        Login
                    </button>
                </form>
                {error && (
                    <p
                        className="mt-4 text-sm text-center"
                        style={{ color: "var(--color-glacier-400)" }}
                    >
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default LoginPage;