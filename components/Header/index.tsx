import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-white p-4 flex justify-between shadow-lg">
            <Link className="text-sm font-bold" href="/" >S3 Bucket Explorer</Link>
            <Link className="text-sm" href="/settings">Settings</Link>
        </header>
    );
}