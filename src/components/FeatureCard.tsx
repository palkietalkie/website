import { Placeholder } from "./Placeholder";
import styles from "./FeatureCard.module.css";

type Visual = { label: string; spec: string };

type Props = {
  n: number;
  title: string;
  body: string;
  visual?: Visual;
};

export function FeatureCard({ n, title, body, visual }: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.text}>
        <span className={styles.num}>{String(n).padStart(2, "0")}</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.body}>{body}</p>
      </div>
      {visual && (
        <Placeholder
          shape="square"
          label={visual.label}
          spec={visual.spec}
          className={styles.visual}
        />
      )}
    </article>
  );
}
