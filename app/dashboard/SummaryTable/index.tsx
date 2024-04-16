interface IProps {
    selectedPosition: string;
    votingRounds: {
        [key: string]: number;
    }[];
    currQuota: number;
}

const Table = ({ selectedPosition, votingRounds, currQuota }: IProps) => {
    if (selectedPosition === "Senate") {
        return (
            <div className="grid grid-cols-3 gap-y-10 gap-x-10 w-full p-4 items-start">
                {votingRounds.map((round, i) => (
                    <div className="flex items-center justify-center flex-col w-full">
                        <h3 className="font-bold">Round {i + 1}</h3>
                        {Object.keys(round).map((name) => (
                            <div className="flex items-center justify-between flex-row w-full gap-x-10">
                                {round[name] > currQuota ||
                                i + 1 === votingRounds.length ? (
                                    <>
                                        <p className="font-bold text-green-500">
                                            {name}
                                        </p>
                                        <p className="font-bold text-green-500">
                                            {(
                                                Math.round(round[name] * 100) /
                                                100
                                            ).toFixed(2)}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p>{name}</p>
                                        <p>
                                            {(
                                                Math.round(round[name] * 100) /
                                                100
                                            ).toFixed(2)}
                                        </p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    } else {
        return (
            <div className="flex items-center justify-center flex-col gap-y-10 w-full p-4">
                {votingRounds.map((round, i) => (
                    <div className="flex items-center justify-center flex-col w-full md:w-1/3">
                        <h3 className="font-bold">Round {i + 1}</h3>
                        {Object.keys(round).map((name) => (
                            <div className="flex items-center justify-between flex-row w-full gap-x-10">
                                {round[name] > currQuota ? (
                                    <>
                                        <p className="font-bold text-green-500">
                                            {name}
                                        </p>
                                        <p className="font-bold text-green-500">
                                            {(
                                                Math.round(round[name] * 100) /
                                                100
                                            ).toFixed(2)}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p>{name}</p>
                                        <p>
                                            {(
                                                Math.round(round[name] * 100) /
                                                100
                                            ).toFixed(2)}
                                        </p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }
};

export default Table;
