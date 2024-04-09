import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { buttonVariants } from "../../../../components/ui/button";
import UploadFile from "./UploadFile";

interface IProps {
    setFilelist: (f: any[] | null) => void;
}

const UploadDrawer = ({ setFilelist }: IProps) => {
    return (
        <Drawer>
            <DrawerTrigger
                className={buttonVariants({ variant: "outline", width: 300 })}
            >
                Upload election results
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Upload Election Results</DrawerTitle>
                    <DrawerDescription>
                        Upload the CSV file containing all the votes of an
                        election.
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="w-full flex items-center justify-center">
                    <UploadFile {...{ setFilelist }} />
                    <DrawerClose
                        className={buttonVariants({
                            variant: "outline",
                            width: 200,
                        })}
                    >
                        Close
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default UploadDrawer;
