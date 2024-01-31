import * as fs from "fs";
import * as path from "path";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import TableComponent from "../table";
import {
    pPositions,
    evpPositions,
    eavpPositions,
    aavpPositions,
    saPositions,
    tsrepPositions,
    senatePositions,
} from "@/utils";

interface IParams {
    params: {
        position:
            | "president"
            | "executive-vice-president"
            | "external-affairs-vice-president"
            | "academic-affairs-vice-president"
            | "student-advocate"
            | "transfer-student-representative"
            | "senate";
    };
}

const TablePage = ({ params }: IParams) => {
    const csvFilePath = path.resolve("public", "master-modified.csv");
    const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });

    let positionsArr = pPositions;

    switch (params.position) {
        case "president":
            positionsArr = pPositions;
            break;
        case "executive-vice-president":
            positionsArr = evpPositions;
            break;
        case "external-affairs-vice-president":
            positionsArr = eavpPositions;
            break;
        case "academic-affairs-vice-president":
            positionsArr = aavpPositions;
            break;
        case "student-advocate":
            positionsArr = saPositions;
            break;
        case "transfer-student-representative":
            positionsArr = tsrepPositions;
            break;
        case "senate":
            positionsArr = senatePositions;
            break;
    }

    return (
        <main className="flex flex-col items-center justify-center w-full p-10">
            <div className="w-full flex items-center justify-start pb-2">
                <Link
                    href="/votes"
                    className={buttonVariants({
                        variant: "outline",
                    })}
                >
                    &lt; Back
                </Link>
            </div>
            <TableComponent
                fileContent={fileContent}
                positions={positionsArr}
            />
        </main>
    );
};

export default TablePage;
