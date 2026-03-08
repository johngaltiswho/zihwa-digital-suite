import styles from "./page.module.css";

const hrAppUrl = process.env.NEXT_PUBLIC_HR_APP_URL || "https://hr.zihwainsights.com";
const accountingAppUrl =
  process.env.NEXT_PUBLIC_ACCOUNTING_APP_URL || "https://ledger.zihwainsights.com";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.tag}>Zihwa Insights</p>
        <h1>Digital Operations for HR, Finance, and Compliance</h1>
        <p className={styles.subtitle}>
          We build focused internal products that reduce manual work, improve control, and give teams
          better visibility across critical workflows.
        </p>
      </section>

      <section className={styles.apps}>
        <article className={styles.card}>
          <p className={styles.cardTag}>Subdomain App</p>
          <h2>HR Operations</h2>
          <p>
            Candidate tracking, employee records, document collection, and deadline visibility for fast
            hiring and cleaner HR operations.
          </p>
          <a href={hrAppUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
            Open HR App
          </a>
        </article>

        <article className={styles.card}>
          <p className={styles.cardTag}>Subdomain App</p>
          <h2>AI Accounting Engine</h2>
          <p>
            AI-assisted accounting workflows to process documents, improve data quality, and generate
            actionable financial insights.
          </p>
          <a href={accountingAppUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
            Open Accounting App
          </a>
        </article>
      </section>

      <section className={styles.about}>
        <h3>What We Do</h3>
        <p>
          Zihwa Insights delivers practical software for business teams. Instead of one bloated platform,
          we build purpose-fit applications connected by shared standards and secure access.
        </p>
      </section>
    </main>
  );
}
