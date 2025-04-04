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
import ManageDrawer from "./ManageDrawer";

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
    isAdmin: boolean;
    setShowTable: (showTable: boolean) => void;
}

export default function Setup({
    setFilename,
    setSelectedPosition,
    setWinner,
    setSenateWinners,
    setCandidateToCount,
    setVotingRounds,
    isAdmin,
    setShowTable,
}: IProps) {
    const supabase = createClient();
    const [filelist, setFilelist] = useState<any[] | null>(null);

    useEffect(() => {
        const getData = async () => {
            const { data, error } = await supabase.storage
                .from("electionresults")
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
        <Card className="md:w-4/5 w-full">
            <CardHeader>
                <CardTitle>Step 1</CardTitle>
                {isAdmin ? (
                    <CardDescription>
                        Please upload the results of an election or select an
                        election to analyze.
                    </CardDescription>
                ) : (
                    <CardDescription>
                        Please select an election to analyze.
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="flex lg:flex-row flex-col items-center justify-center lg:gap-x-4 gap-y-2">
                {isAdmin ? (
                    <>
                        <UploadDrawer {...{ setFilelist }} />
                        <b>OR</b>
                        <ManageDrawer {...{ filelist, setFilelist }} />
                        <b>OR</b>
                        <FileSelector
                            {...{
                                setFilename,
                                setSelectedPosition,
                                setWinner,
                                setSenateWinners,
                                setCandidateToCount,
                                setVotingRounds,
                                isAdmin,
                                setShowTable,
                            }}
                        />
                    </>
                ) : (
                    <FileSelector
                        {...{
                            setFilename,
                            setSelectedPosition,
                            setWinner,
                            setSenateWinners,
                            setCandidateToCount,
                            setVotingRounds,
                            isAdmin,
                            setShowTable,
                        }}
                    />
                )}
            </CardContent>
        </Card>
    );
}
