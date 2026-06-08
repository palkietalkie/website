import { SignIn } from "@clerk/nextjs";
import styles from "../../auth.module.css";

export default function SignInPage() {
  return (
    <div className={styles.wrap}>
      <SignIn />
    </div>
  );
}
