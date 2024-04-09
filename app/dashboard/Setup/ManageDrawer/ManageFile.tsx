"use client";

import { createClient } from "@/utils/supabase/client";
// import { Button } from "../../../../components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";

interface IProps {
    filelist: any[] | null;
    setFilelist: (f: any[] | null) => void;
}

const ManageFile = ({ filelist, setFilelist }: IProps) => {
    const supabase = createClient();

    const handleDelete = async (filename: string) => {
        const { data, error } = await supabase.storage
            .from("electionResults")
            .remove([`${filename}`]);

        if (!error)
            setFilelist(
                filelist ? filelist.filter((f) => f.name !== filename) : []
            );
    };

    return (
        <div className="w-full flex flex-col items-center justify-center gap-y-4">
            <div className="w-1/2 flex flex-col items-center justify-center gap-y-2">
                {filelist &&
                    filelist.map((f) => (
                        <div
                            key={f.name}
                            className="w-full flex items-center justify-between gap-x-4"
                        >
                            <p>{f.name}</p>
                            <div className="flex items-center justify-center gap-x-4">
                                {/* <Button variant="outline">
                                    Access: Admin Only
                                </Button> */}
                                <TrashIcon
                                    onClick={() => handleDelete(f.name)}
                                    cursor="pointer"
                                    color="hsl(0 84.2% 60.2%)"
                                    width={20}
                                    height={20}
                                />
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ManageFile;
