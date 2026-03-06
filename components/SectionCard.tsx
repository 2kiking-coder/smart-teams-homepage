export default function SectionCard({
  title,
  desc,
  children,
  className = "",
}: {
  title: string;
  desc?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={
        "rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] " +
        className
      }
    >
      <div className="mb-4">
        <div className="text-sm text-white/60">서비스개요</div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h2>
        {desc ? <p className="mt-2 text-white/70">{desc}</p> : null}
      </div>
      {children}
    </section>
  );
}