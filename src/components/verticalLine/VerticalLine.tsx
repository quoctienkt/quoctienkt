import { classes } from "@/utils/toggle";

type VerticalLineProps = {
  className?: string;
  background: string;
};

export function VerticalLine({ className, background }: VerticalLineProps) {
  return (
    <div
      className={classes(
        "w-0.5 h-full",
        className ?? "",
        background ?? "bg-white"
      )}
    ></div>
  );
}
