import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-right"
      hotkey={["altKey", "KeyT"]}
      expand={true}
      richColors
      closeButton
      {...props}
    />
  )
}

export { Toaster }
