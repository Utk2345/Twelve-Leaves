import Image from "next/image";

const STAGES = [
  { label: "Day 1", note: "seed", src: "/plants/seed.png", width: 34, height: 27 },
  { label: "Day 9", note: "sprout", src: "/plants/sprout.png", width: 34, height: 34 },
  { label: "Day 23", note: "bloom", src: "/plants/bloom.png", width: 28, height: 38 },
];

export function GrowthStrip() {
  return (
    <div className="flex items-end gap-0">
      {STAGES.map((stage, i) => {
        const last = i === STAGES.length - 1;
        return (
          <div key={stage.label} className="flex items-end">
            <div className="flex flex-col items-center gap-2.5 w-[76px]">
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full shrink-0
                           ${last ? "bg-[#EEE8D6] dark:bg-[#24311C]" : "bg-[#FFFEFB] dark:bg-[#1C2717]"}
                           shadow-[0_10px_22px_-14px_rgba(40,36,20,0.3)]`}
              >
                <Image
                  src={stage.src}
                  alt=""
                  width={stage.width}
                  height={stage.height}
                  className="object-contain"
                  aria-hidden="true"
                />
              </div>
              <div className="text-center">
                <div className="font-[family-name:var(--font-fraunces)] italic text-[13px] text-[#21251A] dark:text-[#ECE8D8]">
                  {stage.note}
                </div>
                <div className="text-[11px] text-[#696856] dark:text-[#757058] mt-0.5">{stage.label}</div>
              </div>
            </div>
            {!last && (
              <div className="w-8 sm:w-12 h-px mb-[38px] border-t border-dashed border-[#D8D2C2] dark:border-[#3A4530]" />
            )}
          </div>
        );
      })}
    </div>
  );
}
