import Link from "next/link";
export function Footer() {
    return (
        <footer className="flex flex-col gap-4 justify-center items-between p-4 py-6 mt-4  leading-snug w-full">
            <div className="w-full border border-gray-200"></div>
            <p>Developed by Nilesh: <Link href="https://nileshkrpahari.xyz" className="underline">nileshkrpahari.xyz</Link></p>
        </footer>
    );
}