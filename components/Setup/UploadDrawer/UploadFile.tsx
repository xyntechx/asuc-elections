"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

export default function UploadFile() {
    const supabase = createClient();

    const [filename, setFilename] = useState("");
    const [filebody, setFilebody] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadSuccess, setIsUploadSuccess] = useState(0); // 1: success; 2: error

    const handleUploadFile = async () => {
        setIsLoading(true);

        if (filename.length === 0) {
            setIsLoading(false);
            alert("Please enter filename!");
            return;
        }

        if (!filebody || filebody.type !== "text/csv") {
            setIsLoading(false);
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

        if (error) setIsUploadSuccess(2);
        else setIsUploadSuccess(1);
    };

    return (
        <div className="w-full flex flex-col items-center justify-center gap-y-4">
            <div className="w-1/2 flex flex-col items-center justify-center gap-y-2">
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
                {isUploadSuccess === 1 && (
                    <p className="text-green-300">
                        {filename} successfully uploaded!
                    </p>
                )}
                {isUploadSuccess === 2 && (
                    <p className="text-red-300">Upload failed...</p>
                )}
                <Button onClick={() => handleUploadFile()} disabled={isLoading}>
                    {!isLoading ? "Upload" : "Uploading..."}
                </Button>
            </div>
        </div>
    );
}
