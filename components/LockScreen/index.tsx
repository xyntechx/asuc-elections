"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface IProps {
    setPassword: (p: string) => void;
    handlePasswordSubmit: () => void;
}

const LockScreen = ({ setPassword, handlePasswordSubmit }: IProps) => {
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center gap-y-4">
            <h1 className="text-lg font-bold">ASUC Elections Tabulator</h1>
            <Input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.currentTarget.value)}
                className="md:w-1/5 w-full"
            />
            <Button onClick={() => handlePasswordSubmit()}>Unlock</Button>
        </div>
    );
};

export default LockScreen;
