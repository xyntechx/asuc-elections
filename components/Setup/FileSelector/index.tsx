import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface IProps {
    filelist: any[] | null;
    setSelectedFilename: (newName: string) => void;
    setSelectedPosition: (p: string) => void;
    setWinner: (w: string | null) => void;
    setVotingRounds: (
        round: {
            [key: string]: number;
        }[]
    ) => void;
}

const FileSelector = ({
    filelist,
    setSelectedFilename,
    setSelectedPosition,
    setWinner,
    setVotingRounds,
}: IProps) => {
    return (
        <Select
            onValueChange={(filename) => {
                setSelectedFilename(filename);
                setSelectedPosition("");
                setWinner(null);
                setVotingRounds([]);
            }}
        >
            <SelectTrigger className="w-[300px]">
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
