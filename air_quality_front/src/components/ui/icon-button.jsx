import { forwardRef } from "react"

import { Button } from "./Button"

export const IconButton = forwardRef(function IconButton(
  { variant = "ghost", size = "icon", className, ...props },
  ref,
) {
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={className}
      {...props}
    />
  )
})
