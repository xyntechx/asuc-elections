"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function FileList({ trigger }: { trigger: boolean }) {
    const supabase = createClient();

    const [storedFiles, setStoredFiles] = useState<any[] | null>(null);

    useEffect(() => {
        const handleListFile = async () => {
            const { data, error } = await supabase.storage
                .from("electionResults")
                .list("", {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: "name", order: "asc" },
                });

            setStoredFiles(data);
        };

        handleListFile();
    }, [trigger]);

    return (
        <div className="w-fit flex flex-col items-center justify-center gap-y-1 text-gray-300 text-center text-sm">
            <p className="underline">Saved Files</p>
            <div className="w-full grid grid-cols-3 gap-x-4 gap-y-1">
                {storedFiles &&
                    storedFiles.map((f) => <p key={f.id}>{f.name}</p>)}
            </div>
            {!storedFiles && <p>Loading...</p>}
        </div>
    );
}
