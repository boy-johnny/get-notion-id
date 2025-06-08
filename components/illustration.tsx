import Link from "next/link";

export default function Illustration() {
  return (
    <div className="mt-12 md:mt-16 text-center">
      <Link
        href="https://www.notion.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="w-full max-w-sm md:max-w-md mx-auto">
          <img
            src="/illustration.png"
            alt="People working with computers illustration"
            className="w-full h-auto"
          />
        </div>
      </Link>
    </div>
  );
}
