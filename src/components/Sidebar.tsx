import Link from "next/link";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <div className={styles.navbar}>
      <Link href="/apps/handwritingclassification">Hand-writing classification</Link>
      <Link href="/apps/sinhtumon">Sinh tử môn</Link>
    </div>
  )
}
