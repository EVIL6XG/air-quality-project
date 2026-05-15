import { forwardRef } from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/cn"

const cardVariants = cva("rounded-xl shadow-sm", {
  variants: {
    variant: {
      default: "border border-border-subtle bg-surface-1",
      glass: "glass",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const Card = forwardRef(function Card(
  { className, variant, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
})

const CardHeader = forwardRef(function CardHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn("p-6 pb-0", className)} {...props} />
})

const CardBody = forwardRef(function CardBody(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn("p-6", className)} {...props} />
})

const CardFooter = forwardRef(function CardFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
})

const CardTitle = forwardRef(function CardTitle(
  { className, ...props },
  ref,
) {
  return (
    <h3
      ref={ref}
      className={cn(
        "font-display text-lg font-semibold leading-tight text-text-primary",
        className,
      )}
      {...props}
    />
  )
})

const CardDescription = forwardRef(function CardDescription(
  { className, ...props },
  ref,
) {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-text-secondary", className)}
      {...props}
    />
  )
})

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter
Card.Title = CardTitle
Card.Description = CardDescription

export { Card, CardHeader, CardBody, CardFooter, CardTitle, CardDescription }
