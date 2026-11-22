import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Lenis from "lenis";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  SAINS_DATA,
  NOTES_DATA,
  CANVAS_DATA,
  PERSONAL_DETAILS,
  SOCIAL_LINKS,
  PROJETCT_PROUDMOST,
  PortfolioItem,
} from "@/constants";
import catImg from "@/assets/cat-staring.png";

const RECEIPT_TITLE = "Muhammad Syaddad";

const CATEGORY_LABELS: Record<PortfolioItem["category"], string> = {
  notes: "Notes",
  sains: "Science",
  canvas: "Canvas",
};

const CATEGORY_ORDER: PortfolioItem["category"][] = ["notes", "sains", "canvas"];

const toTime = (date?: string) => {
  if (!date) return NaN;
  return new Date(date).getTime();
};

// "YYYY-MM-DD" -> "DD:YY" (song-duration style). Parsed by string split to avoid timezone shift.
const formatReceiptDate = (date?: string): string => {
  const match = date?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return "--:--";
  const [, year, , day] = match;
  return `${day}:${year.slice(-2)}`;
};

// --- Motion: subtle receipt "printing" appear ---
const EASE = [0.22, 1, 0.36, 1] as const;
const ROW_STAGGER = 0.04;
const SECTION_STAGGER = 0.06;

const receiptVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE,
      delayChildren: 0.1,
      staggerChildren: SECTION_STAGGER,
    },
  },
};

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: SECTION_STAGGER } },
};

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: ROW_STAGGER } },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

// Only scaleX: .receipt-rule keeps its CSS opacity (.35).
// `custom` = optional explicit delay (seconds), used to sequence after the list.
const ruleVariants: Variants = {
  hidden: { scaleX: 0 },
  show: (delay?: number) => ({
    scaleX: 1,
    transition: {
      duration: 0.6,
      ease: EASE,
      ...(delay !== undefined ? { delay } : {}),
    },
  }),
};

// Fade-up with an explicit delay so totals/footer land after the list rows.
const afterListVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE, delay },
  }),
};

const ExternalLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="underline decoration-1 underline-offset-2 decoration-[#1c1a17]/40 hover:opacity-70 transition-opacity"
  >
    {children}
  </a>
);

// --- Graffiti tag header ---
// Static rotate/skew/offset live on a plain wrapper span so Motion's transform
// (scale) on the inner span never overwrites them.
const SPRAY_STAGGER = 0.15;

const tagVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: SPRAY_STAGGER } },
};

const sprayVariants: Variants = {
  hidden: { opacity: 0, scale: 1.15, filter: "blur(6px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE },
  },
};

const TAG_WORDS = [
  { text: "Muhammad", offset: "-0.35em", mt: "0" },
  { text: "Syaddad", offset: "0.45em", mt: "0.12em" },
] as const;

const catVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -6 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 6,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const GraffitiName: React.FC = () => (
  <motion.h1
    aria-label={RECEIPT_TITLE}
    variants={tagVariants}
    className="graffiti flex flex-col items-center whitespace-nowrap pt-[0.1em] pb-[0.5em]"
    style={{ fontSize: "clamp(2.5rem, 12vw, 5.5rem)" }}
  >
    <motion.img
      src={catImg}
      alt=""
      aria-hidden="true"
      variants={catVariants}
      className="pointer-events-none select-none mb-[0.15em]"
      style={{ width: "0.8em" }}
    />
    <span
      className="relative inline-block"
      style={{ transform: "rotate(-4deg)" }}
    >
      {TAG_WORDS.map((word) => (
        <span
          key={word.text}
          aria-hidden="true"
          className="relative block w-fit mx-auto"
          style={{
            color: "#111",
            transform: `translateX(${word.offset})`,
            marginTop: word.mt,
          }}
        >
          <motion.span variants={sprayVariants} className="inline-block">
            {word.text}
          </motion.span>
        </span>
      ))}
    </span>
  </motion.h1>
);

const HomePage: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Lenis smooth scroll (normal page scroll)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  // All items merged, newest first; missing/invalid dates go last.
  const items = useMemo(() => {
    return [...NOTES_DATA, ...SAINS_DATA, ...CANVAS_DATA].sort((a, b) => {
      const aTime = toTime(a.date);
      const bTime = toTime(b.date);
      const aBad = Number.isNaN(aTime);
      const bBad = Number.isNaN(bTime);
      if (aBad && bBad) return 0;
      if (aBad) return 1;
      if (bBad) return -1;
      return bTime - aTime;
    });
  }, []);

  const totalBreakdown = useMemo(
    () =>
      CATEGORY_ORDER.map((cat) => ({
        cat,
        count: items.filter((item) => item.category === cat).length,
      }))
        .filter(({ count }) => count > 0)
        .map(({ cat, count }) => `${CATEGORY_LABELS[cat]} ${count}`)
        .join(" · "),
    [items],
  );


  const contact = PERSONAL_DETAILS.find((d) => d.link?.startsWith("mailto:"));
  const whatIDo = PERSONAL_DETAILS.find((d) => d !== contact);

  const reduceMotion = useReducedMotion();
  // Moment the last list row starts + a short beat; totals/footer follow it.
  // (receipt delayChildren 0.1 + ol is 3rd section child + row stagger)
  const listEnd = 0.1 + 2 * SECTION_STAGGER + items.length * ROW_STAGGER + 0.15;

  const rowOpacity = (index: number) =>
    hoveredIndex === null || hoveredIndex === index
      ? "opacity-100"
      : "opacity-35";

  return (
    <div className="paper min-h-screen w-full font-serif">
      <motion.div
        className="max-w-[680px] box-content mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24"
        variants={receiptVariants}
        initial={reduceMotion ? false : "hidden"}
        animate="show"
      >
        {/* HEADER */}
        <motion.header variants={groupVariants}>
          <GraffitiName />
          <motion.div
            variants={groupVariants}
            className="mt-10 text-base leading-relaxed"
          >
            <motion.blockquote variants={fadeUpVariants} className="italic">
              “If you want to find the secrets of the universe, think in terms
              of energy, frequency and vibration.”
            </motion.blockquote>
            <motion.p variants={fadeUpVariants} className="mt-2 opacity-70">
              ― Nikola Tesla
            </motion.p>
          </motion.div>
        </motion.header>

        <motion.hr
          className="receipt-rule"
          style={{ originX: 0 }}
          variants={ruleVariants}
        />

        {/* ITEMS */}
        <motion.ol
          variants={listVariants}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {items.map((item, i) => (
            // motion.li owns the appear opacity; the inner div owns the hover
            // fade (Tailwind opacity class) so the two never fight.
            <motion.li
              key={`${item.category}-${item.slug}`}
              variants={fadeUpVariants}
              onMouseEnter={() => setHoveredIndex(i)}
            >
              <div
                className={`flex items-baseline gap-4 py-1.5 transition-opacity duration-300 ${rowOpacity(i)}`}
              >
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/${item.category}/${item.slug}`}
                    className="text-lg leading-snug hover:underline underline-offset-2 decoration-1"
                  >
                    {item.value}
                  </Link>
                  <span className="hidden sm:inline ml-2 text-sm opacity-55">
                    {CATEGORY_LABELS[item.category]}
                  </span>
                </div>
                <span className="shrink-0 text-right tabular-nums text-base opacity-80">
                  {formatReceiptDate(item.date)}
                </span>
              </div>
            </motion.li>
          ))}
        </motion.ol>

        <motion.hr
          className="receipt-rule"
          style={{ originX: 0 }}
          variants={ruleVariants}
          custom={listEnd}
        />

        {/* TOTALS */}
        <motion.div
          className="text-base leading-relaxed"
          variants={afterListVariants}
          custom={listEnd + 0.1}
        >
          <div className="flex justify-between gap-4">
            <span>Item count:</span>
            <span className="tabular-nums text-right">{items.length}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Total:</span>
            <span className="tabular-nums text-right">{totalBreakdown}</span>
          </div>
        </motion.div>

        <motion.hr
          className="receipt-rule"
          style={{ originX: 0 }}
          variants={ruleVariants}
          custom={listEnd + 0.2}
        />

        {/* FOOTER */}
        <motion.footer
          variants={afterListVariants}
          custom={listEnd + 0.3}
          className="grid grid-cols-[6.5rem_1fr] sm:grid-cols-[8rem_1fr] gap-x-4 gap-y-1 text-base leading-relaxed">
          {whatIDo && (
            <>
              <span>What I do:</span>
              <span className="text-right">{whatIDo.value}</span>
            </>
          )}
          {contact && (
            <>
              <span>Contact:</span>
              <span className="break-all text-right">
                <a
                  href={contact.link}
                  className="underline decoration-1 underline-offset-2 decoration-[#1c1a17]/40 hover:opacity-70 transition-opacity"
                >
                  {contact.value}
                </a>
              </span>
            </>
          )}
          <span>Social:</span>
          <span className="text-right">
            {SOCIAL_LINKS.map((s, i) => (
              <React.Fragment key={s.url}>
                {i > 0 && " · "}
                <ExternalLink href={s.url}>{s.label}</ExternalLink>
              </React.Fragment>
            ))}
          </span>
          <span>Project:</span>
          <span className="text-right">
            {PROJETCT_PROUDMOST.map((p, i) => (
              <React.Fragment key={p.url}>
                {i > 0 && " · "}
                <ExternalLink href={p.url}>{p.label}</ExternalLink>
              </React.Fragment>
            ))}
          </span>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default HomePage;
