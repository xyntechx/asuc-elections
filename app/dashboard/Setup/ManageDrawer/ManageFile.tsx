"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "../../../../components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";

interface IProps {
    filelist: any[] | null;
    setFilelist: (f: any[] | null) => void;
}

interface IFiles {
    id: string;
    filename: string;
    isPublic: boolean;
}

const ManageFile = ({ filelist, setFilelist }: IProps) => {
    const supabase = createClient();

    const [files, setFiles] = useState<IFiles[]>([]);

    useEffect(() => {
        getFilePermissions();
    }, []);

    const handleDelete = async (filename: string) => {
        // Delete from bucket
        const { data, error } = await supabase.storage
            .from("electionResults")
            .remove([`${filename}`]);

        // Delete from table
        const { error: err } = await supabase
            .from("permissions")
            .delete()
            .eq("filename", filename);

        if (!error && !err) {
            setFilelist(
                filelist ? filelist.filter((f) => f.name !== filename) : []
            );
            setFiles(files.filter((f) => f.filename !== filename));
        }
    };

    const getFilePermissions = async () => {
        const { data, error } = await supabase
            .from("permissions")
            .select()
            .order("filename", { ascending: true });

        if (!error) setFiles(data);
    };

    const handleUpdatePermissions = async (
        id: string,
        currIsPublic: boolean
    ) => {
        const { error } = await supabase
            .from("permissions")
            .update({ isPublic: !currIsPublic })
            .eq("id", id);

        getFilePermissions();
    };

    return (
        <div className="w-full flex flex-col items-center justify-center gap-y-4">
            <div className="w-1/2 flex flex-col items-center justify-center gap-y-2">
                {files.map((f) => (
                    <div
                        key={f.filename}
                        className="w-full flex items-center justify-between gap-x-4"
                    >
                        <p>{f.filename}</p>
                        <div className="flex items-center justify-center gap-x-4">
                            <Button
                                onClick={() =>
                                    handleUpdatePermissions(f.id, f.isPublic)
                                }
                                variant={f.isPublic ? "default" : "outline"}
                                className="w-[200px]"
                            >
                                Access: {f.isPublic ? "Public" : "Admin Only"}
                            </Button>
                            <TrashIcon
                                onClick={() => handleDelete(f.filename)}
                                cursor="pointer"
                                color="hsl(0 84.2% 60.2%)"
                                width={20}
                                height={20}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageFile;
