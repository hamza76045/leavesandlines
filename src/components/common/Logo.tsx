import Image from "next/image";

export function Logo({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg   ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.svg"
        alt="Leaves & Lines logo"
        fill
        sizes={`${size}px`}
        className="object-cover"
        loading="eager"
      />
    </div>
  );
}
