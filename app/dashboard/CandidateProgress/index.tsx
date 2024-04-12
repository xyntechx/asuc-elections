import { Progress } from "@/components/ui/progress";
import { ProgressGradual } from "@/components/ui/progress-gradual";
import { useEffect } from "react";
import CountUp from "react-countup";

interface IProps {
    candidate: string;
    candidateToCount: {
        [key: string]: number;
    };
    currQuota: number;
    votingRounds: {
        [key: string]: number;
    }[];
    isAdmin: boolean;
}

const CandidateProgress = ({
    candidate,
    candidateToCount,
    currQuota,
    votingRounds,
    isAdmin,
}: IProps) => {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-y-1">
            <div className="flex flex-row items-center justify-between w-full">
                <p>{candidate}</p>
                {isAdmin ? (
                    <p className="text-xs text-gray-500">
                        {Math.round(
                            (candidateToCount[candidate] + Number.EPSILON) * 100
                        ) / 100}{" "}
                        out of{" "}
                        {Math.round((currQuota + Number.EPSILON) * 100) / 100}
                    </p>
                ) : (
                    <CountUp
                        start={
                            votingRounds.length > 1
                                ? Math.round(
                                      (votingRounds[votingRounds.length - 2][
                                          candidate
                                      ] +
                                          Number.EPSILON) *
                                          100
                                  ) / 100
                                : 0
                        }
                        end={
                            Math.round(
                                (candidateToCount[candidate] + Number.EPSILON) *
                                    100
                            ) / 100
                        }
                        duration={5}
                        decimals={2}
                        suffix={` out of ${
                            Math.round((currQuota + Number.EPSILON) * 100) / 100
                        }`}
                        className="text-xs text-gray-500"
                    />
                )}
            </div>
            {isAdmin ? (
                <Progress
                    value={Math.min(
                        (candidateToCount[candidate] / currQuota) * 100,
                        100
                    )}
                />
            ) : (
                <ProgressGradual
                    value={Math.min(
                        (candidateToCount[candidate] / currQuota) * 100,
                        100
                    )}
                />
            )}
        </div>
    );
};

export default CandidateProgress;
