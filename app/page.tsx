import Link from "next/link";
import UploadDrawer from "@/components/UploadDrawer";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
    return (
        <main className="w-full min-h-screen flex flex-col items-center justify-center gap-y-2">
            <h1 className="text-lg font-bold">ASUC Tabulator</h1>
            <div className="flex flex-row items-center justify-center gap-x-4">
                <Link
                    href="/analyze"
                    className={buttonVariants({ variant: "default" })}
                >
                    Analyze
                </Link>
            </div>
            <div className="w-full z-10 flex items-center justify-center fixed bottom-[20px]">
                <UploadDrawer />
            </div>
        </main>
    );
}
