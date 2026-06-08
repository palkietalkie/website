import { SignUp } from "@clerk/nextjs";
import styles from "../../auth.module.css";

export default function SignUpPage() {
  return (
    <div className={styles.wrap}>
      <SignUp />
    </div>
  );
}
