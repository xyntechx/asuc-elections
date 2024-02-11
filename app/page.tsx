"use client";

import { useState } from "react";
import DashboardScreen from "@/components/DashboardScreen";
import LockScreen from "@/components/LockScreen";

const Home = () => {
    const [password, setPassword] = useState("");
    const [isCorrectPassword, setIsCorrectPassword] = useState(false);

    const handlePasswordSubmit = () => {
        if (password === process.env.NEXT_PUBLIC_PASSWORD)
            setIsCorrectPassword(true);
        else setIsCorrectPassword(false);
    };

    return (
        <main className="w-full min-h-screen flex flex-col items-center justify-start gap-y-2">
            {isCorrectPassword ? (
                <DashboardScreen />
            ) : (
                <LockScreen {...{ setPassword, handlePasswordSubmit }} />
            )}
        </main>
    );
};

export default Home;
