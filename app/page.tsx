"use client";

import { useEffect, useState } from "react";
import { parse } from "csv-parse";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";
import Setup from "@/components/Setup";
import PositionSelector from "@/components/PositionSelector";

export default function Home() {
    const supabase = createClient();

    const [filename, setFilename] = useState("");
    const [fileblob, setFileblob] = useState<Blob | null>(null);
    const [csvColumns, setCSVColumns] = useState<string[]>([]);
    const [positions, setPositions] = useState<string[]>([]);

    const [selectedPosition, setSelectedPosition] = useState<string>("");
    const [execVotes, setExecVotes] = useState<string[][]>([]);
    const [senateVotes, setSenateVotes] = useState<string[][]>([]);
    const [votingRounds, setVotingRounds] = useState<
        {
            [key: string]: number;
        }[]
    >([]);
    const [candidateToCount, setCandidateToCount] = useState<{
        [key: string]: number;
    }>({});
    const [totalVoteCount, setTotalVoteCount] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const downloadCSV = async () => {
            setIsLoading(true);

            const { data, error } = await supabase.storage
                .from("electionResults")
                .download(`${filename}`);

            setFileblob(data);
            setIsLoading(false);
        };

        if (filename.length > 0) {
            // Reset states
            setSelectedPosition("");
            setExecVotes([]);
            setSenateVotes([]);
            setVotingRounds([]);
            setCandidateToCount({});
            setTotalVoteCount(0);
            setWinner(null);

            downloadCSV();
        }
    }, [filename]);

    useEffect(() => {
        const getCSVColumns = async () => {
            setIsLoading(true);

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

            setIsLoading(false);
        };

        if (fileblob) getCSVColumns();
    }, [fileblob]);

    useEffect(() => {
        const getPositionsFromColumns = () => {
            setIsLoading(true);

            const uniquePositions = new Set<string>();

            for (const col of csvColumns) {
                // split by "-" that columns like "President - 1" and "President - 2" are regarded as the same position
                const splitCol = col.split(" - ");

                // All position columns have numerical indices at the right side of the split column head (e.g. "President - 1")
                if (!Number.isNaN(Number(splitCol[1]))) {
                    uniquePositions.add(splitCol[0]);
                }
            }

            setPositions(Array.from(uniquePositions));
            setIsLoading(false);
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
                    group_columns_by_name: true, // due to multiple columns of the same name
                    fromLine: 2, // exclude first line (headers)
                    cast: (columnValue, context) => {
                        if (
                            context.column.toString().split(" - ")[0] ===
                                selectedPosition &&
                            columnValue.length > 0
                        ) {
                            return columnValue.split("|")[0].trim(); // only return the nominee's name (no extra descriptions)
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
                                let votedFor: string;
                                try {
                                    votedFor = line[col].filter(
                                        (val: string | null) => val // return only the non-null values
                                    )[0];
                                } catch {
                                    // if line[col] is not an array, then just return line[col]
                                    votedFor = line[col];
                                }

                                if (votedFor)
                                    names.push(
                                        votedFor
                                            .split(" ")
                                            .map(
                                                (w) =>
                                                    w[0].toUpperCase() +
                                                    w.slice(1)
                                            )
                                            .join(" ")
                                    );
                            }
                        }
                        relevantVotes.push(names);
                    }

                    if (selectedPosition === "Senate")
                        setSenateVotes(relevantVotes);
                    else setExecVotes(relevantVotes);
                }
            );

            setIsLoading(false);
        };

        if (selectedPosition && csvColumns && fileblob) getVotesForPosition();
    }, [selectedPosition, csvColumns, fileblob]);

    useEffect(() => {
        if (execVotes.length > 0) handleExecutiveRace();
    }, [execVotes]);

    useEffect(() => {
        if (senateVotes.length > 0) handleSenateRace();
    }, [senateVotes]);

    useEffect(() => {
        if (Object.keys(candidateToCount).length === 1) {
            setWinner(Object.keys(candidateToCount)[0]);
        }

        const THRESHOLD = (totalVoteCount + 1) / 2;

        for (const candidate in candidateToCount) {
            const points = candidateToCount[candidate];

            if (points >= THRESHOLD) {
                setWinner(candidate);
                return;
            }
        }
    }, [candidateToCount]);

    const handleSenateRace = () => {
        const currCandidateToCount: { [key: string]: number } = {};

        for (const vote of senateVotes) {
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

        if (votingRounds.length === 0) {
            setTotalVoteCount(
                Object.values(sortedCandidateToCount).reduce(
                    (prev, n) => prev + n,
                    0
                )
            );
        }

        setVotingRounds([...votingRounds, sortedCandidateToCount]);
    };

    const handleExecutiveRace = () => {
        const currCandidateToCount: { [key: string]: number } = {};

        for (const vote of execVotes) {
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

        if (votingRounds.length === 0) {
            setTotalVoteCount(
                Object.values(sortedCandidateToCount).reduce(
                    (prev, n) => prev + n,
                    0
                )
            );
        }

        setVotingRounds([...votingRounds, sortedCandidateToCount]);
    };

    const sortDescCandidateToCount = (obj: { [key: string]: number }) => {
        let candidateCountArr: any = [];

        for (const candidate in obj) {
            candidateCountArr.push([candidate, obj[candidate]]);
        }

        candidateCountArr = candidateCountArr.sort(
            (a: any, b: any) => b[1] - a[1]
        );

        const result: { [key: string]: number } = {};

        for (const pair of candidateCountArr) {
            result[pair[0]] = pair[1];
        }

        return result;
    };

    const resumeSenateAnalysis = () => {
        console.log("Resume senate analysis");
    };

    const resumeExecutiveAnalysis = () => {
        const leastPointCount = Math.min(...Object.values(candidateToCount));
        let worstCandidates = Object.keys(candidateToCount).filter(
            (c) => candidateToCount[c] === leastPointCount
        );

        const newVotes = [...execVotes];

        worstCandidates = checkForAllTie(worstCandidates, newVotes, 0);

        for (let i = 0; i < newVotes.length; i++) {
            if (worstCandidates.includes(newVotes[i][0])) {
                newVotes[i] = newVotes[i].slice(1);
            }
            newVotes[i] = newVotes[i].filter(
                (name) => !worstCandidates.includes(name)
            );
        }

        setExecVotes(newVotes);
    };

    const checkForAllTie = (
        worstCandidates: string[],
        newVotes: string[][],
        index: number
    ): string[] => {
        if (worstCandidates.length === newVotes.length) {
            if (index === votingRounds.length) {
                // Choose a random candidate to eliminate
                return [
                    worstCandidates[
                        Math.floor(Math.random() * worstCandidates.length)
                    ],
                ];
            }

            const newLeastPointCount = Math.min(
                ...Object.values(votingRounds[index])
            );
            const newWorstCandidates = Object.keys(votingRounds[index]).filter(
                (c) => votingRounds[index][c] === newLeastPointCount
            );

            return checkForAllTie(newWorstCandidates, newVotes, index + 1);
        }

        return worstCandidates;
    };

    return (
        <main className="w-full min-h-screen flex flex-col items-center justify-start gap-y-2">
            <h1 className="text-lg font-bold">ASUC Elections Tabulator</h1>
            <Setup
                setSelectedFilename={setFilename}
                setSelectedPosition={setSelectedPosition}
                setWinner={setWinner}
                setVotingRounds={setVotingRounds}
            />
            {positions.length > 0 && (
                <PositionSelector
                    {...{
                        filename,
                        positions,
                        setSelectedPosition,
                        setWinner,
                        setVotingRounds,
                    }}
                />
            )}

            {isLoading && <p>Loading...</p>}

            {Object.keys(candidateToCount).length > 0 && (
                <div className="flex flex-col items-start justify-center md:w-1/2 w-full py-8 gap-y-4">
                    <Badge variant="outline">
                        {filename}: {selectedPosition}
                    </Badge>
                    {Object.keys(candidateToCount).map((candidate) => (
                        <div key={candidate} className="w-full">
                            <p>{candidate}</p>
                            <Progress
                                value={
                                    (candidateToCount[candidate] /
                                        totalVoteCount) *
                                    100
                                }
                            />
                            <p>
                                {candidateToCount[candidate]} out of{" "}
                                {totalVoteCount}
                            </p>
                        </div>
                    ))}
                    {winner && (
                        <Alert>
                            <RocketIcon className="h-4 w-4" />
                            <AlertTitle>Race completed</AlertTitle>
                            <AlertDescription>
                                {winner} won the race for {selectedPosition}
                            </AlertDescription>
                        </Alert>
                    )}
                    {votingRounds.length > 0 && !winner && (
                        <Button
                            onClick={() =>
                                selectedPosition === "Senate"
                                    ? resumeSenateAnalysis()
                                    : resumeExecutiveAnalysis()
                            }
                            className="w-full"
                        >
                            Resume Analysis
                        </Button>
                    )}
                </div>
            )}
        </main>
    );
}
