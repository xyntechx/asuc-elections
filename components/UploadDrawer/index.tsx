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
import { Button, buttonVariants } from "../ui/button";
import UploadFile from "./UploadFile";

const UploadDrawer = () => {
    return (
        <Drawer>
            <DrawerTrigger className={buttonVariants({ variant: "default" })}>
                Upload
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
