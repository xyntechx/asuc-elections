import { Progress } from "@/components/ui/progress";

interface IProps {
    candidate: string;
    candidateToCount: {
        [key: string]: number;
    };
    currQuota: number;
}

const CandidateProgress = ({
    candidate,
    candidateToCount,
    currQuota,
}: IProps) => {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-y-1">
            <div className="flex flex-row items-center justify-between w-full">
                <p>{candidate}</p>
                <p className="text-xs text-gray-500">
                    {Math.round(
                        (candidateToCount[candidate] + Number.EPSILON) * 100
                    ) / 100}{" "}
                    out of{" "}
                    {Math.round((currQuota + Number.EPSILON) * 100) / 100}
                </p>
            </div>
            <Progress
                value={Math.min(
                    (candidateToCount[candidate] / currQuota) * 100,
                    100
                )}
            />
        </div>
    );
};

export default CandidateProgress;
