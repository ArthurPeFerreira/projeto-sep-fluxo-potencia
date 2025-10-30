import { Title } from "../Title";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="flex flex-col gap-2 border-b pb-4">
      <Title title={title} subtitle={description} />
      <div className="">{children}</div>
    </section>
  );
}
