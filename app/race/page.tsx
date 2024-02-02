"use client";

import { useEffect, useState } from "react";
import { parse } from "csv-parse";
import { createClient } from "@/utils/supabase/client";
import FileSelect from "@/components/FileSelect";
import { Button } from "@/components/ui/button";

export default function Race() {
    const supabase = createClient();

    const [filename, setFilename] = useState("");
    const [fileblob, setFileblob] = useState<Blob | null>(null);
    const [csvColumns, setCSVColumns] = useState<string[]>([]);
    const [positions, setPositions] = useState<string[]>([]);

    useEffect(() => {
        const downloadCSV = async () => {
            const { data, error } = await supabase.storage
                .from("electionResults")
                .download(`${filename}`);

            setFileblob(data);
        };

        if (filename.length > 0) downloadCSV();
    }, [filename]);

    useEffect(() => {
        const parseCSV = async () => {
            parse(
                Buffer.from(await fileblob!.arrayBuffer()),
                {
                    delimiter: ",",
                    toLine: 1,
                },
                (error, result) => {
                    if (error) {
                        console.error(error);
                        return;
                    }

                    setCSVColumns(result[0]);
                }
            );
        };

        if (fileblob) parseCSV();
    }, [fileblob]);

    useEffect(() => {
        const getPositionsFromColumns = () => {
            const uniquePositions = new Set<string>();

            for (const col of csvColumns) {
                const splitCol = col.split(" - ");
                if (!Number.isNaN(Number(splitCol[1]))) {
                    uniquePositions.add(splitCol[0]);
                }
            }

            setPositions(Array.from(uniquePositions));
        };

        if (csvColumns) getPositionsFromColumns();
    }, [csvColumns]);

    return (
        <main className="w-full min-h-screen flex flex-col items-center justify-start gap-y-2">
            <div className="w-full h-fit flex flex-row items-center justify-center gap-x-4">
                <FileSelect setSelectedFilename={setFilename} />
            </div>
            {positions.length > 0 && (
                <>
                    <p>Choose position to analyze</p>
                    {positions.map((pos) => (
                        <Button key={pos}>{pos}</Button>
                    ))}
                </>
            )}
        </main>
    );
}
