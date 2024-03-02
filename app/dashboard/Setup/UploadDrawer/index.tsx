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
import { Button, buttonVariants } from "../../../../components/ui/button";
import UploadFile from "./UploadFile";

const UploadDrawer = () => {
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
                <DrawerFooter>
                    <UploadFile />
                    <DrawerClose>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default UploadDrawer;
