import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const Error = () => {
    return (
        <main className="w-full min-h-screen flex flex-col items-center justify-center gap-y-2 p-4">
            <p>Oops! Something went wrong...</p>
            <Link
                href="/"
                className={buttonVariants({ variant: "outline", width: 200 })}
            >
                Back to home
            </Link>
        </main>
    );
};

export default Error;
