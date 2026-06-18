import { Screenshot } from "./Screenshot";
import styles from "./FeatureCard.module.css";

type Image = { src: string; alt: string };

type Props = {
  n: number;
  title: string;
  body: string;
  image?: Image;
};

export function FeatureCard({ n, title, body, image }: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.text}>
        <span className={styles.num}>{String(n).padStart(2, "0")}</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.body}>{body}</p>
      </div>
      {image && <Screenshot src={image.src} alt={image.alt} className={styles.visual} />}
    </article>
  );
}
