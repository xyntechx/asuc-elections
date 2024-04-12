import { useCountUp } from "use-count-up";
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
                        duration={10}
                        decimals={2}
                        suffix={` out of ${
                            Math.round((currQuota + Number.EPSILON) * 100) / 100
                        }`}
                        className="text-xs text-gray-500"
                    />
                )}
            </div>
            <ProgressBar
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
                        (candidateToCount[candidate] + Number.EPSILON) * 100
                    ) / 100
                }
                total={
                    currQuota > 0
                        ? Math.round((currQuota + Number.EPSILON) * 100) / 100
                        : 1
                }
                duration={isAdmin ? 1 : 10}
            />
        </div>
    );
};

export default CandidateProgress;

interface IProgressProps {
    start: number;
    end: number;
    total: number;
    duration: number;
}

const ProgressBar = ({ start, end, total, duration }: IProgressProps) => {
    const { value } = useCountUp({
        isCounting: true,
        start,
        end,
        duration,
        easing: "linear",
    });

    return (
        <div className="w-full h-[10px] bg-gray-300 rounded-md">
            <div
                className="h-full bg-black rounded-md"
                style={{
                    width: `${Math.min((Number(value) / total) * 100, 100)}%`,
                }}
            ></div>
        </div>
    );
};
