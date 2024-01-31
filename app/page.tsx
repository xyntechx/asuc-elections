import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
    return (
        <main className="w-full flex flex-col items-center justify-start">
            <h1 className="text-lg">ASUC Tabulator</h1>
            <Link
                href="/votes"
                className={buttonVariants({ variant: "default" })}
            >
                View Votes
            </Link>
        </main>
    );
}
