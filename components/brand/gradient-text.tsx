import { cn } from "cn"

type Tag = "span" | "p" | "h1" | "h2" | "h3"

/**
 * Brand gradient on any text.
 * Use this wherever a heading or label should shift from orange to pink to blue.
 */
export function GradientText({
  as: Tag = "span",
  className,
  children,
}: {
  as?: Tag
  className?: string
  children: React.ReactNode
}) {
  return <Tag className={cn("text-gradient", className)}>{children}</Tag>
}
