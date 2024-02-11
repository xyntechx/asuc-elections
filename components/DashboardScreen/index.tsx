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

interface ISenateVote {
    candidate: string;
    value: number | null;
}

const DashboardScreen = () => {
    const supabase = createClient();

    const [filename, setFilename] = useState("");
    const [fileblob, setFileblob] = useState<Blob | null>(null);
    const [csvColumns, setCSVColumns] = useState<string[]>([]);
    const [positions, setPositions] = useState<string[]>([]);

    const [selectedPosition, setSelectedPosition] = useState<string>("");
    const [execVotes, setExecVotes] = useState<string[][]>([]);
    const [senateVotes, setSenateVotes] = useState<ISenateVote[][]>([]);
    const [votingRounds, setVotingRounds] = useState<
        {
            [key: string]: number;
        }[]
    >([]);
    const [candidateToCount, setCandidateToCount] = useState<{
        [key: string]: number;
    }>({});
    const [totalVoteCount, setTotalVoteCount] = useState(0);
    const [currQuota, setCurrQuota] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);
    const [senateWinners, setSenateWinners] = useState<string[]>([]);
    const [newSenateWinners, setNewSenateWinners] = useState<string[]>([]);
    const [unfilledSenateSeatCount, setUnfilledSenateSeatCount] = useState(20);

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
            setCurrQuota(0);
            setWinner(null);
            setSenateWinners([]);
            setNewSenateWinners([]);
            setUnfilledSenateSeatCount(20);

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

                    if (selectedPosition === "Senate") {
                        const allVotes: ISenateVote[][] = [];

                        for (const vote of relevantVotes) {
                            const indivVote: ISenateVote[] = [];

                            for (let i = 0; i < vote.length; i++) {
                                const candidate = vote[i];

                                indivVote.push({
                                    candidate,
                                    value: i === 0 ? 1 : null, // vote value of 1 to first choice, temporarily null for the rest
                                });
                            }

                            allVotes.push(indivVote);
                        }

                        setSenateVotes(allVotes);
                    } else {
                        setExecVotes(relevantVotes);
                    }
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
        if (Object.keys(candidateToCount).length === 0) return;

        if (selectedPosition === "Senate") {
            // For senate races
            const newWinners = [];

            if (
                Object.keys(candidateToCount).length <= unfilledSenateSeatCount
            ) {
                setSenateWinners([
                    ...senateWinners,
                    ...Object.keys(candidateToCount),
                ]);

                setUnfilledSenateSeatCount(0);
                setCandidateToCount({});

                return;
            }

            for (const candidate in candidateToCount) {
                const points = candidateToCount[candidate];

                if (points >= currQuota) {
                    newWinners.push(candidate);
                }
            }

            setSenateWinners([...senateWinners, ...newWinners]);
            setNewSenateWinners(newWinners);
            setUnfilledSenateSeatCount(
                unfilledSenateSeatCount - newWinners.length
            );
        } else {
            // For executive races
            if (Object.keys(candidateToCount).length === 1) {
                setWinner(Object.keys(candidateToCount)[0]);
            }

            for (const candidate in candidateToCount) {
                const points = candidateToCount[candidate];

                if (points >= currQuota) {
                    setWinner(candidate);
                    return;
                }
            }
        }
    }, [candidateToCount, selectedPosition]);

    const handleSenateRace = () => {
        const currCandidateToCount: { [key: string]: number } = {};

        for (const vote of senateVotes) {
            if (vote.length === 0) {
                continue;
            }

            const currChoice = vote[0];
            if (
                !Object.keys(currCandidateToCount).includes(
                    currChoice.candidate
                )
            ) {
                currCandidateToCount[currChoice.candidate] = 0;
            }
            currCandidateToCount[currChoice.candidate] += currChoice.value
                ? currChoice.value
                : 0;
        }

        const sortedCandidateToCount =
            sortDescCandidateToCount(currCandidateToCount);

        setCandidateToCount(sortedCandidateToCount);

        if (votingRounds.length === 0) {
            const N = Object.values(sortedCandidateToCount).reduce(
                (prev, n) => prev + n,
                0
            );

            setTotalVoteCount(N);
            setCurrQuota(Math.floor(1 + N / (unfilledSenateSeatCount + 1)));
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
            const N = Object.values(sortedCandidateToCount).reduce(
                (prev, n) => prev + n,
                0
            );

            setTotalVoteCount(N);
            setCurrQuota((N + 1) / 2);
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
        if (newSenateWinners.length > 0) {
            // Transfer excess candidate votes to other candidates
            const newVotes = [...senateVotes];

            for (let i = 0; i < newVotes.length; i++) {
                if (newVotes[i].length === 0) {
                    continue;
                }

                if (newSenateWinners.includes(newVotes[i][0].candidate)) {
                    const V = newVotes[i][0].value ? newVotes[i][0].value! : 0;
                    const C = candidateToCount[newVotes[i][0].candidate];
                    const Q = currQuota;

                    newVotes[i] = newVotes[i].slice(1);

                    if (newVotes[i].length > 0)
                        newVotes[i][0].value = (V * (C - Q)) / C;
                }

                newVotes[i] = newVotes[i].filter(
                    (v) => !newSenateWinners.includes(v.candidate)
                );
            }

            setSenateVotes(newVotes);
        } else {
            // Eliminate worst candidate IFF nobody was elected in this round
            const leastPointCount = Math.min(
                ...Object.values(candidateToCount)
            );
            let worstCandidates = Object.keys(candidateToCount).filter(
                (c) => candidateToCount[c] === leastPointCount
            );

            const newVotes = [...senateVotes];

            worstCandidates = checkForAllTie(worstCandidates, newVotes, 0);

            for (let i = 0; i < newVotes.length; i++) {
                if (newVotes[i].length === 0) {
                    continue;
                }

                if (worstCandidates.includes(newVotes[i][0].candidate)) {
                    const voteValue = newVotes[i][0].value;

                    newVotes[i] = newVotes[i].slice(1);

                    if (newVotes[i].length > 0)
                        newVotes[i][0].value = voteValue;
                }
                newVotes[i] = newVotes[i].filter(
                    (v) => !worstCandidates.includes(v.candidate)
                );
            }

            setSenateVotes(newVotes);
        }
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
        newVotes: string[][] | ISenateVote[][],
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
        <>
            <h1 className="text-lg font-bold">ASUC Elections Tabulator</h1>
            <Setup
                {...{
                    setFilename,
                    setSelectedPosition,
                    setWinner,
                    setSenateWinners,
                    setCandidateToCount,
                    setVotingRounds,
                }}
            />
            {positions.length > 0 && (
                <PositionSelector
                    {...{
                        filename,
                        positions,
                        setSelectedPosition,
                        setWinner,
                        setSenateWinners,
                        setCandidateToCount,
                        setVotingRounds,
                    }}
                />
            )}

            {isLoading && <p>Loading...</p>}

            <div className="flex flex-col items-start justify-center md:w-1/2 w-full py-8 gap-y-4">
                {Object.keys(candidateToCount).length > 0 && (
                    <>
                        <Badge variant="outline">
                            {filename}: {selectedPosition}
                        </Badge>
                        <p>Total number of votes: {totalVoteCount}</p>
                        <p>Current quota to win: {currQuota}</p>
                        {selectedPosition === "Senate" && (
                            <p>
                                Number of seats left: {unfilledSenateSeatCount}
                            </p>
                        )}
                    </>
                )}
                {Object.keys(candidateToCount).map((candidate) => (
                    <div key={candidate} className="w-full">
                        <p>{candidate}</p>
                        <Progress
                            value={Math.min(
                                (candidateToCount[candidate] / currQuota) * 100,
                                100
                            )}
                        />
                        <p>
                            {candidateToCount[candidate]} out of {currQuota}
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
                {senateWinners.length > 0 &&
                    senateWinners.map((winner) => (
                        <Alert key={winner}>
                            <RocketIcon className="h-4 w-4" />
                            <AlertTitle>
                                Seat #{senateWinners.indexOf(winner) + 1} Filled
                            </AlertTitle>
                            <AlertDescription>
                                {winner} was elected as Senate
                            </AlertDescription>
                        </Alert>
                    ))}

                {selectedPosition !== "Senate" &&
                    votingRounds.length > 0 &&
                    !winner && (
                        <Button
                            onClick={() => resumeExecutiveAnalysis()}
                            className="w-full"
                        >
                            Resume Analysis
                        </Button>
                    )}

                {selectedPosition === "Senate" &&
                    votingRounds.length > 0 &&
                    unfilledSenateSeatCount > 0 && (
                        <Button
                            onClick={() => resumeSenateAnalysis()}
                            className="w-full"
                        >
                            Resume Analysis
                        </Button>
                    )}
            </div>
        </>
    );
};

export default DashboardScreen;
