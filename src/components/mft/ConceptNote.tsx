import Link from "next/link";

// A small label on each concept page so the team can present it: which idea it
// is and which piece of class feedback it answers. Not part of the Etsy UI.
// `whole`: the entire page is new; otherwise the new parts carry a <New> outline.
export function ConceptNote({ code, title, answers, whole = false }: { code: string; title: string; answers: string; whole?: boolean }) {
  return (
    <div className="concept-note border-b border-amber-200 bg-amber-50 text-sm text-amber-950">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 sm:px-8">
        <span className="rounded bg-amber-200 px-1.5 py-0.5 font-mono text-xs font-semibold">{code}</span>
        <span className="font-semibold">{title}</span>
        <span className="text-amber-900">Answers: {answers}</span>
        <span className="rounded border border-dashed border-amber-500 px-1.5 py-0.5 text-xs font-semibold">
          {whole ? "Whole page is new" : "New parts are outlined"}
        </span>
        <Link href="/concepts" className="ml-auto underline">
          All concepts
        </Link>
      </div>
    </div>
  );
}
