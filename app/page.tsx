import UploadDrawer from "@/components/UploadDrawer";

export default function Home() {
    return (
        <main className="w-full min-h-screen flex flex-col items-center justify-center gap-y-4">
            <h1 className="text-lg font-bold">ASUC Tabulator</h1>
            <UploadDrawer />
        </main>
    );
}
