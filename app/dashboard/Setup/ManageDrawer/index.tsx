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
import ManageFile from "./ManageFile";

interface IProps {
    filelist: any[] | null;
    setFilelist: (f: any[] | null) => void;
}

const ManageDrawer = ({ filelist, setFilelist }: IProps) => {
    return (
        <Drawer>
            <DrawerTrigger
                className={buttonVariants({ variant: "outline", width: 300 })}
            >
                Manage files
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Manage Election Results</DrawerTitle>
                    <DrawerDescription>
                        Manage the CSV files containing all the votes of an
                        election.
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="w-full flex items-center justify-center">
                    <ManageFile {...{ filelist, setFilelist }} />
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

export default ManageDrawer;
