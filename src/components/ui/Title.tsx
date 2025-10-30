import { cn } from "@/lib/utils/utils";

interface TitleProps {
  title?: string;
  titleAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  classNameTitle?: string;
  subtitle?: string;
  subtitleAs?: "p" | "span" | "div";
  classNameSubtitle?: string;
}

export function Title({
  title,
  titleAs: Title = "h2",
  classNameTitle,
  subtitle,
  subtitleAs: Subtitle = "p",
  classNameSubtitle,
}: TitleProps) {
  const baseStyles = {
    title: "text-2xl font-bold pb-2",
    subtitle: "text-sm text-neutral-500 mt-1",
  };

  return (
    <>
      {title ? (
        <Title className={cn(baseStyles.title, classNameTitle)}>
          {title}
          {subtitle && (
            <Subtitle className={cn(baseStyles.subtitle, classNameSubtitle)}>
              {subtitle}
            </Subtitle>
          )}
        </Title>
      ) : null}
    </>
  );
}
