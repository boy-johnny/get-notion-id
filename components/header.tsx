import Link from "next/link";

export default function Header() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="https://www.notion.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
              <img
                src="/notion-icon.svg"
                alt="Notion Logo"
                className="w-full h-full"
              />
            </div>
          </Link>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900">
            Get Notion ID
          </h1>
        </div>
      </div>
    </nav>
  );
}
