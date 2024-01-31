import UploadFile from "@/components/UploadFile";

export default function Home() {
    return (
        <main className="w-full flex flex-col items-center justify-start">
            <h1 className="text-lg">ASUC Tabulator</h1>
            <UploadFile />
        </main>
    );
}
