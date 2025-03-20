import { cn } from "@heroui/react";

type TitleProps = {
  text: string;
  className?: string;
}

export const Title = ({ text, className }: TitleProps) => {
  return (
    <h1 className={cn("text-2xl font-bold ::after:content-[''] ::after:block ::after:w-full ::after:h-[2px] ::after:bg-primary", className)}>{text}</h1>
  );
};
