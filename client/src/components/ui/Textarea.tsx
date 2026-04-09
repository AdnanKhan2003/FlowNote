import React, { TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  wrapperClassName?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  className,
  wrapperClassName,
  ...props
}) => {
  return (
    <div className={cn("mb-4 w-full", wrapperClassName)}>
      {label && (
        <label className="block mb-2 text-text-muted text-sm font-medium">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "w-full bg-transparent border-none text-text text-[1.2rem] leading-relaxed outline-none resize-none px-0",
          className
        )}
        {...props}
      />
    </div>
  );
};

export default Textarea;
