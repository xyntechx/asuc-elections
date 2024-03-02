import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const Home = () => {
    return (
        <main className="w-full min-h-screen flex flex-col items-center justify-center gap-y-2 p-4">
            <h1 className="text-lg font-bold">ASUC Elections Dashboard</h1>
            <Link
                href="/login"
                className={buttonVariants({ variant: "default", width: 200 })}
            >
                Log in as admin
            </Link>
            <Link
                href="/dashboard"
                className={buttonVariants({ variant: "outline", width: 200 })}
            >
                Continue as guest
            </Link>
        </main>
    );
};

export default Home;
