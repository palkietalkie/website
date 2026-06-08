import styles from "./Placeholder.module.css";

type Shape = "phone" | "portrait" | "square" | "wide" | "audio";

type Props = {
  shape: Shape;
  label: string;
  spec: string;
  className?: string;
};

// Visible design-intent stub. Renders a labeled empty box where a real asset will go (screenshot, midjourney render, demo video, audio sample). Spec text describes exactly what to drop in. Stays in production until replaced — the placeholder is more honest than removing the slot and pretending the visual doesn't matter.
export function Placeholder({ shape, label, spec, className }: Props) {
  return (
    <figure className={`${styles.placeholder} ${styles[shape]} ${className ?? ""}`}>
      <div className={styles.label}>{label}</div>
      <figcaption className={styles.spec}>{spec}</figcaption>
    </figure>
  );
}
