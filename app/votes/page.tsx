import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { positionTypes } from "@/utils";

const Tables = () => {
    return (
        <main className="w-full flex flex-col items-center justify-start gap-y-4">
            <div className="w-full flex items-center justify-start pb-2">
                <Link
                    href="/"
                    className={buttonVariants({
                        variant: "outline",
                    })}
                >
                    &lt; Back
                </Link>
            </div>
            <h1 className="text-lg">Choose position to view</h1>
            {positionTypes.map((p) => (
                <Link
                    key={p}
                    href={`/votes/${p.toLowerCase().split(" ").join("-")}`}
                    className={buttonVariants({
                        variant: "default",
                        width: 300,
                    })}
                >
                    {p}
                </Link>
            ))}
        </main>
    );
};

export default Tables;
