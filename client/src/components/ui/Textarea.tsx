import React, { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  wrapperStyle?: React.CSSProperties;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  style,
  className,
  wrapperStyle,
  ...props
}) => {
  return (
    <div style={{ marginBottom: "16px", width: "100%", ...wrapperStyle }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            color: "var(--text-muted)",
            fontSize: "14px",
          }}
        >
          {label}
        </label>
      )}
      <textarea
        className={className || ""}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          color: "var(--text)",
          fontSize: "1.2rem",
          lineHeight: "1.6",
          outline: "none",
          resize: "none",
          ...style,
        }}
        {...props}
      />
    </div>
  );
};

export default Textarea;
