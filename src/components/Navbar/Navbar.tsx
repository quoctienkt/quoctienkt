import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar({ id }: any) {
  return (
    <div id={id} className={styles.navbar}>
      <Link href="/apps/handwritingclassification">
        Hand-writing classification
      </Link>
      <Link href="/apps/sinhtumon">Sinh tử môn</Link>
    </div>
  );
}
