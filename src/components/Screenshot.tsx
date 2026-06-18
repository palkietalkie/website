import Image from "next/image";
import styles from "./Screenshot.module.css";

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** Above-the-fold images (the hero) set this so Next preloads them eagerly — they're the LCP element. Off elsewhere, so below-the-fold shots lazy-load. */
  priority?: boolean;
};

// A real app screenshot rendered as a phone-sized image via next/image, so it's optimized (sized/format-negotiated) instead of shipping the full PNG. The captured screenshots are 1320x2868 (phone aspect); the intrinsic size sets the ratio and CSS scales it responsively.
export function Screenshot({ src, alt, className, priority = false }: Props) {
  return (
    <figure className={`${styles.frame} ${className ?? ""}`}>
      <Image
        className={styles.img}
        src={src}
        alt={alt}
        width={1320}
        height={2868}
        priority={priority}
        sizes="(max-width: 600px) 80vw, 280px"
      />
    </figure>
  );
}
