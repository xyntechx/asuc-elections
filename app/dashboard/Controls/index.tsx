import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlayIcon, InfoCircledIcon } from "@radix-ui/react-icons";

interface IProps {
    filename: string;
    selectedPosition: string;
    totalVoteCount: number;
    currQuota: number;
    winner: string | null;
    unfilledSenateSeatCount: number;
    resumeExecutiveAnalysis: () => void;
    resumeSenateAnalysis: () => void;
    showTable: boolean;
    setShowTable: (showTable: boolean) => void;
}

const Controls = ({
    filename,
    selectedPosition,
    totalVoteCount,
    currQuota,
    winner,
    unfilledSenateSeatCount,
    resumeExecutiveAnalysis,
    resumeSenateAnalysis,
    showTable,
    setShowTable,
}: IProps) => {
    return (
        <>
            <div className="flex flex-row md:items-center items-start justify-start gap-x-4 w-fit">
                <Badge>
                    {selectedPosition} for {filename}
                </Badge>

                <Badge variant="outline">
                    Total vote count: {totalVoteCount}
                </Badge>

                <Badge
                    variant="outline"
                    className="flex flex-row items-center justify-center gap-x-1"
                >
                    <span>
                        Winning quota:{" "}
                        {Math.round((currQuota + Number.EPSILON) * 100) / 100}
                    </span>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <InfoCircledIcon />
                            </TooltipTrigger>
                            <TooltipContent>
                                {selectedPosition === "Senate" ? (
                                    <p className="w-[200px]">
                                        Quota of votes needed to win is given by
                                        the floor of (N / (S + 1)) + 1, where N
                                        is the number of valid first preference
                                        votes and S is the total number of seats
                                        needed to be filled in the election
                                        (S=20).
                                    </p>
                                ) : (
                                    <p className="w-[200px]">
                                        Quota of votes needed to win is given by
                                        (N + 1) / 2, where N is the number of
                                        valid first preference votes.
                                    </p>
                                )}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </Badge>

                {selectedPosition === "Senate" && (
                    <Badge variant="outline">
                        Seats to fill: {unfilledSenateSeatCount}
                    </Badge>
                )}
            </div>

            {selectedPosition !== "Senate" && !winner && (
                <Button
                    onClick={() => resumeExecutiveAnalysis()}
                    className="bg-blue-600 hover:bg-blue-600/90 flex flex-row items-center justify-center gap-x-2 md:w-fit w-full"
                >
                    <PlayIcon /> Resume
                </Button>
            )}

            {selectedPosition === "Senate" && unfilledSenateSeatCount > 0 && (
                <Button
                    onClick={() => resumeSenateAnalysis()}
                    className="bg-blue-600 hover:bg-blue-600/90 flex flex-row items-center justify-center gap-x-2 md:w-fit w-full"
                >
                    <PlayIcon /> Resume
                </Button>
            )}

            {((selectedPosition !== "Senate" && winner) ||
                (selectedPosition === "Senate" &&
                    unfilledSenateSeatCount === 0)) && (
                <>
                    {showTable ? (
                        <Button
                            onClick={() => setShowTable(!showTable)}
                            variant="destructive"
                            className="flex flex-row items-center justify-center gap-x-2 w-[100px]"
                        >
                            Close Table
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setShowTable(!showTable)}
                            className="bg-green-600 hover:bg-green-600/90 flex flex-row items-center justify-center gap-x-2 w-[100px]"
                        >
                            View Table
                        </Button>
                    )}
                </>
            )}
        </>
    );
};

export default Controls;
