import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface IProps {
    filelist: any[] | null;
    setFilename: (newName: string) => void;
    setSelectedPosition: (p: string) => void;
    setWinner: (w: string | null) => void;
    setVotingRounds: (
        round: {
            [key: string]: number;
        }[]
    ) => void;
    setSenateWinners: (w: string[]) => void;
    setCandidateToCount: (obj: { [key: string]: number }) => void;
}

const FileSelector = ({
    filelist,
    setFilename,
    setSelectedPosition,
    setWinner,
    setVotingRounds,
    setSenateWinners,
    setCandidateToCount,
}: IProps) => {
    return (
        <Select
            onValueChange={(filename) => {
                setFilename(filename);
                setSelectedPosition("");
                setWinner(null);
                setVotingRounds([]);
                setSenateWinners([]);
                setCandidateToCount({});
            }}
        >
            <SelectTrigger
                className="w-[300px]"
                aria-label="Select election to analyze"
            >
                <SelectValue placeholder="Select election to analyze" />
            </SelectTrigger>
            <SelectContent>
                {filelist &&
                    filelist.map((f) => (
                        <SelectItem key={f.id} value={f.name}>
                            {f.name}
                        </SelectItem>
                    ))}
            </SelectContent>
        </Select>
    );
};

export default FileSelector;
