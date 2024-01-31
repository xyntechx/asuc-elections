"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Vote } from "@/utils";
import { useEffect, useState } from "react";
import { parse } from "csv-parse";
import { csvHeaders } from "@/utils";

interface IProps {
    fileContent: any;
    positions: string[];
}

const TableComponent = ({ fileContent, positions }: IProps) => {
    const [data, setData] = useState<Vote[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        parse(
            fileContent,
            {
                delimiter: ",",
                columns: csvHeaders,
                fromLine: 2, // exclude first line (headers)
                cast: (columnValue, context) => {
                    if (columnValue.includes("|")) {
                        return columnValue.split("|")[0].trim();
                    }

                    return columnValue;
                },
            },
            (error, result: Vote[]) => {
                if (error) {
                    console.error(error);
                }

                setData(result);
                setIsLoading(false);
            }
        );
    }, []);

    return !isLoading ? (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    {positions.map((p) => (
                        <TableHead>{p}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data &&
                    data.map((row) => (
                        <TableRow key={row.SubmissionId}>
                            <TableCell className="min-w-[100px]">
                                {row["SubmissionId"]}
                            </TableCell>
                            {positions.map((p) => (
                                <TableCell className="min-w-[150px]">
                                    {row[p as keyof Vote]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    ) : (
        <span className="loader" />
    );
};

export default TableComponent;
