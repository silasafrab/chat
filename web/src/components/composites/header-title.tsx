import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Typography } from "../ui/typography/typography"

interface HeaderTitleProps {
  title: string,
  subtitle: string,
  button: string,
  buttonFn: () => void
}

export const HeaderTitle = ({ title, subtitle, button, buttonFn }: HeaderTitleProps) => {
  return (
    <Card className=" ">
      <CardContent className="flex justify-between">

        <div className="max-w-120">

          <Typography type="heading-l" >
            {title}
          </Typography>
          <Typography type="body-l" className="text-muted-foreground">
            {subtitle}
          </Typography>
        </div>
        <Button onClick={buttonFn}>
          {button}
        </Button>
      </CardContent>
    </Card>
  )
}