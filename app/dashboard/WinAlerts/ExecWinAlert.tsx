import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";

interface IProps {
    winner: string;
    selectedPosition: string;
}

const ExecWinAlert = ({ winner, selectedPosition }: IProps) => {
    return (
        <Alert>
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Race completed</AlertTitle>
            <AlertDescription>
                {winner} was elected as {selectedPosition}
            </AlertDescription>
        </Alert>
    );
};

export default ExecWinAlert;
