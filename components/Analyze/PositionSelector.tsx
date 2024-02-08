import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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

import { Button } from "@/components/ui/button";

interface IProps {
    positions: string[];
    setSelectedPosition: (p: string) => void;
    setWinner: (w: string | null) => void;
    setVotingRounds: (
        round: {
            [key: string]: number;
        }[]
    ) => void;
}

const PositionSelector = ({
    positions,
    setSelectedPosition,
    setWinner,
    setVotingRounds,
}: IProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Step 2</CardTitle>
                <CardDescription>
                    Please select a position to analyze.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Select
                    onValueChange={(p) => {
                        setSelectedPosition(p);
                        setWinner(null);
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
