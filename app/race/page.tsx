"use client";

import { useEffect, useState } from "react";
import { parse } from "csv-parse";
import { createClient } from "@/utils/supabase/client";
import FileSelect from "@/components/FileSelect";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function Race() {
    const supabase = createClient();

    const [filename, setFilename] = useState("");
    const [fileblob, setFileblob] = useState<Blob | null>(null);
    const [csvColumns, setCSVColumns] = useState<string[]>([]);
    const [positions, setPositions] = useState<string[]>([]);

    const [selectedPosition, setSelectedPosition] = useState<string>("");
    const [votes, setVotes] = useState<string[][]>([]);
    const [candidateToCount, setCandidateToCount] = useState<{
        [key: string]: number;
    }>({});
    const [totalVoteCount, setTotalVoteCount] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

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

    useEffect(() => {
        const getVotesForPosition = async () => {
            setIsLoading(true);

            parse(
                Buffer.from(await fileblob!.arrayBuffer()),
                {
                    delimiter: ",",
                    columns: csvColumns,
                    fromLine: 2, // exclude first line (headers)
                    cast: (columnValue, context) => {
                        if (
                            context.column.toString().split(" - ")[0] ===
                            selectedPosition
                        ) {
                            return columnValue.split("|")[0].trim();
                        }

                        return null;
                    },
                },
                (error, result) => {
                    if (error) {
                        console.error(error);
                        return;
                    }

                    const relevantVotes = [];

                    for (const line of result) {
                        const names = [];
                        for (const col in line) {
                            if (line[col]) {
                                names.push(line[col]);
                            }
                        }
                        relevantVotes.push(names);
                    }

                    setVotes(relevantVotes);
                    // setTotalVoteCount(relevantVotes.length);
                }
            );

            setIsLoading(false);
        };

        if (selectedPosition && csvColumns && fileblob) getVotesForPosition();
    }, [selectedPosition, csvColumns, fileblob]);

    useEffect(() => {
        const currCandidateToCount: { [key: string]: number } = {};

        for (const vote of votes) {
            if (vote.length === 0) {
                continue;
            }

            const candidate = vote[0];
            if (!Object.keys(currCandidateToCount).includes(candidate)) {
                currCandidateToCount[candidate] = 0;
            }
            currCandidateToCount[candidate]++;
        }

        const sortedCandidateToCount =
            sortDescCandidateToCount(currCandidateToCount);

        setCandidateToCount(sortedCandidateToCount);
        setTotalVoteCount(
            Object.values(sortedCandidateToCount).reduce(
                (prev, n) => prev + n,
                0
            )
        );
    }, [votes]);

    const sortDescCandidateToCount = (obj: { [key: string]: number }) => {
        let candidateCountArr: any = [];

        for (const candidate in obj) {
            candidateCountArr.push([candidate, obj[candidate]]);
        }

        candidateCountArr = candidateCountArr.sort(
            (a: any, b: any) => b[1] - a[1]
        );

        console.log(candidateCountArr);

        const result: { [key: string]: number } = {};

        for (const pair of candidateCountArr) {
            result[pair[0]] = pair[1];
        }

        return result;
    };

    const resumeAnalysis = () => {
        const leastPointCount = Math.min(...Object.values(candidateToCount));
        const worstCandidates = Object.keys(candidateToCount).filter(
            (c) => candidateToCount[c] === leastPointCount
        );

        const newVotes = [...votes];

        if (worstCandidates.length === newVotes.length) {
            // TODO: Check 3.3.9
        }

        for (const candidate in candidateToCount) {
            if (worstCandidates.includes(candidate)) {
                delete candidateToCount[candidate];
            }
        }

        for (let i = 0; i < newVotes.length; i++) {
            if (worstCandidates.includes(newVotes[i][0])) {
                newVotes[i] = newVotes[i].slice(1);
            }
            newVotes[i] = newVotes[i].filter(
                (name) => !worstCandidates.includes(name)
            );
        }

        setVotes(newVotes);
    };

    return (
        <main className="w-full min-h-screen flex flex-col items-center justify-start gap-y-2">
            <div className="w-full h-fit flex flex-row items-center justify-center gap-x-4">
                <FileSelect setSelectedFilename={setFilename} />
            </div>
            {positions.length > 0 && (
                <>
                    <p>Choose position to analyze</p>
                    {positions.map((pos) => (
                        <Button
                            key={pos}
                            onClick={() => setSelectedPosition(pos)}
                            className="w-[300px]"
                        >
                            {pos}
                        </Button>
                    ))}
                </>
            )}
            {isLoading && <p>Loading...</p>}
            <p>Total Votes: {totalVoteCount}</p>
            {Object.keys(candidateToCount).map((candidate) => (
                <div key={candidate} className="w-full">
                    <p>{candidate}</p>
                    <Progress
                        value={
                            (candidateToCount[candidate] / totalVoteCount) * 100
                        }
                    />
                    <p>
                        {candidateToCount[candidate]} out of {totalVoteCount}
                    </p>
                </div>
            ))}
            <Button onClick={() => resumeAnalysis()}>Resume Analysis</Button>
        </main>
    );
}
