import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  id: string;
}

export function Icon({ id, className, ...props }: IconProps) {
  return (
    <svg
      className={className}
      fill="currentColor"      /* ← make fill inherit `color` */
      aria-hidden="true"
      {...props}
    >
      <use href={`/icon_definitions.svg#${id}`} />
    </svg>
  );
}