"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface IProps {
    setFilename: (newName: string) => void;
    setSelectedPosition: (p: string) => void;
    setWinner: (w: string | null) => void;
    setVotingRounds: (
        round: {
            [key: string]: number;
        }[]
    ) => void;
    setSenateWinners: (w: string[]) => void;
    setCandidateToCount: (obj: { [key: string]: number }) => void;
    isAdmin: boolean;
}

const FileSelector = ({
    setFilename,
    setSelectedPosition,
    setWinner,
    setVotingRounds,
    setSenateWinners,
    setCandidateToCount,
    isAdmin,
}: IProps) => {
    const supabase = createClient();

    const [files, setFiles] = useState<string[]>([]);

    useEffect(() => {
        const getPublicFiles = async () => {
            const { data, error } = await supabase
                .from("permissions")
                .select("filename")
                .eq("isPublic", true)
                .order("filename", { ascending: true });

            if (!error) setFiles(data.map((f) => f.filename));
        };

        const getAllFiles = async () => {
            const { data, error } = await supabase
                .from("permissions")
                .select("filename")
                .order("filename", { ascending: true });

            if (!error) setFiles(data.map((f) => f.filename));
        };

        if (isAdmin) getAllFiles();
        else getPublicFiles();
    }, []);

    return (
        <Select
            onValueChange={(filename) => {
                setFilename(filename);
                setSelectedPosition("");
                setWinner(null);
                setVotingRounds([]);
                setSenateWinners([]);
                setCandidateToCount({});
            }}
        >
            <SelectTrigger
                className="w-[300px]"
                aria-label="Select election to analyze"
            >
                <SelectValue placeholder="Select election to analyze" />
            </SelectTrigger>
            <SelectContent>
                {files.map((f) => (
                    <SelectItem key={f} value={f}>
                        {f}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default FileSelector;
