"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface IProps {
    setSelectedFilename: (newName: string) => void;
}

export default function FileSelect({ setSelectedFilename }: IProps) {
    const supabase = createClient();
    const [filelist, setFilelist] = useState<any[] | null>(null);

    useEffect(() => {
        const getData = async () => {
            const { data, error } = await supabase.storage
                .from("electionResults")
                .list("", {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: "name", order: "asc" },
                });

            setFilelist(data);
        };
        getData();
    }, []);

    return (
        <Select onValueChange={(filename) => setSelectedFilename(filename)}>
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
}
