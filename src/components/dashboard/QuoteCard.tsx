const QUOTES = [
  { text: "Progress, not perfection.", who: "Small steps every day add up to a bigger garden." },
  { text: "We are what we repeatedly do.", who: "Excellence, then, is not an act, but a habit." },
  { text: "Small habits, big changes.", who: "One check-off at a time." },
];

/** `seed` should be a small deterministic number (e.g. day-of-month) so the quote changes day to day without needing storage. */
export function QuoteCard({ seed }: { seed: number }) {
  const quote = QUOTES[((seed % QUOTES.length) + QUOTES.length) % QUOTES.length];

  return (
    <div
      className="rounded-[22px] p-6 flex flex-col justify-center gap-2 h-full
                 bg-gradient-to-br from-[#F5E3BD] to-[#EEE8D6] dark:from-[#37301B] dark:to-[#24311C]"
    >
      <p className="font-(family-name:--font-fraunces) italic text-lg text-[#21251A] dark:text-[#ECE8D8] m-0">
        {quote.text}
      </p>
      <span className="text-xs text-[#5C6150] dark:text-[#AFAB92]">{quote.who}</span>
    </div>
  );
}
