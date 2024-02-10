import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface IProps {
    filename: string;
    positions: string[];
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

const PositionSelector = ({
    filename,
    positions,
    setSelectedPosition,
    setWinner,
    setSenateWinners,
    setCandidateToCount,
    setVotingRounds,
}: IProps) => {
    return (
        <Card className="md:w-1/2 w-full">
            <CardHeader>
                <CardTitle>Step 2</CardTitle>
                <CardDescription>
                    Please select a position from {filename} to analyze.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
                <Select
                    onValueChange={(p) => {
                        setSelectedPosition(p);
                        setWinner(null);
                        setSenateWinners([]);
                        setCandidateToCount({});
                        setVotingRounds([]);
                    }}
                >
                    <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                        {positions.map((p) => (
                            <SelectItem key={p} value={p}>
                                {p}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>
    );
};

export default PositionSelector;
