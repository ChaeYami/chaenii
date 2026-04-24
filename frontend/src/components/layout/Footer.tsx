export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <p className="text-center font-mono text-sm text-text-muted">
        &copy; 2026 Chaeyeon Seo &middot; All rights reserved &middot; Built with{" "}
        <a href="/admin" className="cursor-pointer">🤍</a>
      </p>
      <p
        className="mt-2 text-center font-mono text-xs text-text-muted"
        title="서비스 최적화를 위한 정기 점검입니다. 점검 시간 외엔 정상 운영됩니다."
        aria-label="서비스 점검 시간 안내: 매일 오전 3시부터 7시까지(한국 표준시). 서비스 최적화를 위한 정기 점검입니다."
      >
        <span className="whitespace-nowrap">🕒 서비스 점검 시간:</span>{" "}
        <span className="whitespace-nowrap">매일 03:00 ~ 07:00 KST</span>
      </p>
    </footer>
  );
}
