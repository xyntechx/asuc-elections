"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import UploadDrawer from "./UploadDrawer";
import FileSelector from "./FileSelector";

interface IProps {
    setFilename: (f: string) => void;
    setSelectedPosition: (p: string) => void;
    setWinner: (w: string | null) => void;
    setSenateWinners: (w: string[]) => void;
    setCandidateToCount: (obj: { [key: string]: number }) => void;
    setVotingRounds: (
        round: {
            [key: string]: number;
        }[]
    ) => void;
}

export default function Setup({
    setFilename,
    setSelectedPosition,
    setWinner,
    setSenateWinners,
    setCandidateToCount,
    setVotingRounds,
}: IProps) {
    const supabase = createClient();
    const [filelist, setFilelist] = useState<any[] | null>(null);

    useEffect(() => {
        const getData = async () => {
            const { data, error } = await supabase.storage
                .from("electionResults")
                .list("", {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: "name", order: "asc" },
                });

            setFilelist(data);
        };
        getData();
    }, []);

    return (
        <Card className="md:w-1/2 w-full">
            <CardHeader>
                <CardTitle>Step 1</CardTitle>
                <CardDescription>
                    Please upload the results of an election or select an
                    election to analyze.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex md:flex-row flex-col items-center justify-center md:gap-x-4 gap-y-2">
                <UploadDrawer />
                <b>OR</b>
                <FileSelector
                    {...{
                        filelist,
                        setFilename,
                        setSelectedPosition,
                        setWinner,
                        setSenateWinners,
                        setCandidateToCount,
                        setVotingRounds,
                    }}
                />
            </CardContent>
        </Card>
    );
}
