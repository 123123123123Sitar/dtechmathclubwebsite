export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  titleClassName = "",
}) {
  return (
    <div className={`section-heading section-heading-${align}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className={titleClassName}>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
