import Analyze from "@/components/Analyze";
import UploadDrawer from "@/components/UploadDrawer";

export default function Home() {
    return (
        <main className="w-full min-h-screen flex flex-col items-center justify-start gap-y-2">
            <h1 className="text-lg font-bold">ASUC Elections Tabulator</h1>
            <div className="flex flex-col items-center justify-center w-full h-fit gap-y-2">
                <UploadDrawer />
                <p>Or</p>
                <Analyze />
            </div>
        </main>
    );
}
