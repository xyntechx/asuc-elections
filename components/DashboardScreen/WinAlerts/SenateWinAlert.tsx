import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";

interface IProps {
    winner: string;
    senateWinners: string[];
}

const SenateWinAlert = ({ winner, senateWinners }: IProps) => {
    return (
        <Alert>
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>
                Seat #{senateWinners.indexOf(winner) + 1} Filled
            </AlertTitle>
            <AlertDescription>{winner} was elected as Senator</AlertDescription>
        </Alert>
    );
};

export default SenateWinAlert;
