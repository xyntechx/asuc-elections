import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { login } from "./actions";
import { Input } from "@/components/ui/input";

export default async function Login() {
    const supabase = createClient();

    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user) {
        redirect("/dashboard");
    }

    return (
        <form className="w-full min-h-screen flex flex-col items-center justify-center gap-y-2 p-4">
            <h1 className="text-lg font-bold">Admin Login</h1>
            <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                className="w-[300px]"
                required
            />
            <Button formAction={login}>Log In</Button>
        </form>
    );
}
