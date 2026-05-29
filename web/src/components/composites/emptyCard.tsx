import SvgEmptyFile from "../svg/SvgEmptyFile";
import SvgEmptySearch from "../svg/SvgEmptySearch";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Typography } from "../ui/typography/typography";

interface EmptyCardProps {
  variant: "file" | "search";
  title: string;
  description: string;
  button?: string;
  buttonFn?: () => void;
  embedded?: boolean;
}

export const EmptyCard = ({
  variant,
  title,
  description,
  button,
  buttonFn,
  embedded = false,
}: EmptyCardProps) => {
  const content = (
    <Card className="w-full">
      {variant === "file" && <SvgEmptyFile className="max-h-[250px]" />}
      {variant === "search" && <SvgEmptySearch className="max-h-[250px]" />}

      <div className="space-y-3">
        <Typography type="heading-s" className="text-center font-bold">
          {title}
        </Typography>
        <Typography
          type="body-m"
          className="text-center text-muted-foreground"
        >
          {description}{" "}
        </Typography>
      </div>

      {button && buttonFn && (
        <Button className="mt-3 w-fit mx-auto" onClick={buttonFn}>
          {button}
        </Button>
      )}
    </Card>
  );

  if (embedded) {
    return (
      <div className="flex flex-col items-center py-6">{content}</div>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center">{content}</CardContent>
    </Card>
  );
};