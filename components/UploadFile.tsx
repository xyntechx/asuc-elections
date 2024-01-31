"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import FileList from "./FileList";

export default function UploadFile() {
    const supabase = createClient();

    const [filename, setFilename] = useState("");
    const [filebody, setFilebody] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleUploadFile = async () => {
        setIsLoading(true);

        if (filename.length === 0) {
            alert("Please enter filename!");
            return;
        }

        if (!filebody || filebody.type !== "text/csv") {
            alert("Please select a CSV file!");
            return;
        }

        const { data, error } = await supabase.storage
            .from("electionResults")
            .upload(`${filename}`, filebody, {
                cacheControl: "3600",
                upsert: false,
            });

        setIsLoading(false);
    };

    return (
        <div className="w-1/2 flex flex-col items-center justify-center gap-y-4 p-4 border border-gray-200 rounded-md">
            <p>Upload election results</p>
            <div className="w-[300px] flex flex-col items-center justify-center gap-y-2">
                <Input
                    type="text"
                    placeholder="Enter filename..."
                    onChange={(e) => setFilename(e.currentTarget.value)}
                />
                <Input
                    type="file"
                    onChange={(e) =>
                        e.target.files && setFilebody(e.target.files[0])
                    }
                />
                <Button onClick={() => handleUploadFile()} disabled={isLoading}>
                    {!isLoading ? "Upload" : "Uploading..."}
                </Button>
            </div>
            <FileList trigger={isLoading} />
        </div>
    );
}
