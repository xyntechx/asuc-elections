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
        <div className="w-1/2 flex flex-col items-center justify-center gap-y-4 p-4">
            <p className="underline">Saved Files</p>
            {storedFiles ? (
                storedFiles.map((f) => <p key={f.id}>{f.name}</p>)
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
