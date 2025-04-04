"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";

interface IProps {
    setFilelist: (f: any[] | null) => void;
}

const UploadFile = ({ setFilelist }: IProps) => {
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

        // Upload to bucket
        const { data, error } = await supabase.storage
            .from("electionresults")
            .upload(`${filename}`, filebody, {
                cacheControl: "3600",
                upsert: false,
            });

        // Insert to table
        const { error: err } = await supabase
            .from("permissions")
            .insert({ filename: filename });

        setIsLoading(false);

        if (error || err) setIsUploadSuccess(2);
        else {
            setIsUploadSuccess(1);
            getFiles();
        }
    };

    const getFiles = async () => {
        const { data, error } = await supabase.storage
            .from("electionresults")
            .list("", {
                limit: 100,
                offset: 0,
                sortBy: { column: "name", order: "asc" },
            });

        setFilelist(data);
    };

    return (
        <div className="w-full flex flex-col items-center justify-center gap-y-4">
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center gap-y-2">
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
                    <p className="text-green-400">
                        {filename} successfully uploaded!
                    </p>
                )}
                {isUploadSuccess === 2 && (
                    <p className="text-red-400">
                        Upload failed... Perhaps you've uploaded a file named{" "}
                        {filename} before.
                    </p>
                )}
                <Button
                    onClick={() => handleUploadFile()}
                    disabled={isLoading}
                    className="w-[200px]"
                >
                    {!isLoading ? "Upload" : "Uploading..."}
                </Button>
            </div>
        </div>
    );
};

export default UploadFile;
