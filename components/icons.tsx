import type { ProductIcon } from "@/lib/site-data";

export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M3 8h9M8.5 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M5 11 11 5M5.5 5H11v5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** App-icon style product marks used on the product cards. */
export function ProductMark({
  icon,
  size = 44,
}: {
  icon: ProductIcon;
  size?: number;
}) {
  if (icon === "zeros") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect x="1" y="1" width="30" height="30" rx="5" fill="#141414" />
        <path
          d="M15.7354 8.44915C15.7354 10.9064 13.779 12.8983 11.3656 12.8983C8.95228 12.8983 6.99586 10.9064 6.99586 8.44915C6.99586 5.99195 8.95228 4 11.3656 4C13.779 4 15.7354 5.99195 15.7354 8.44915Z"
          fill="#FFF8FC"
        />
        <path
          d="M16.9839 24.5508C16.9839 27.008 18.9403 29 21.3537 29C23.767 29 25.7235 27.008 25.7235 24.5508C25.7235 22.0936 23.767 20.1017 21.3537 20.1017C18.9403 20.1017 16.9839 22.0936 16.9839 24.5508Z"
          fill="#FFF8FC"
        />
        <path
          d="M6.99586 17.9831C8.01608 15.9055 10.1248 14.5932 12.4061 14.5932C14.0465 14.5932 15.1517 16.751 14.7421 18.3684C14.3476 19.9265 14.2664 21.851 15.1112 23.9153C16.101 26.3342 14.3555 29 11.7818 29H10.9508C9.52484 29 8.18602 28.2631 7.49125 26.9952C7.23381 26.5254 6.98073 26.0376 6.78778 25.6102C6.70158 25.4192 6.61136 25.2 6.51987 24.964C5.64179 22.699 5.92629 20.1611 6.99586 17.9831Z"
          fill="#FFF8FC"
        />
        <path
          d="M24.8864 7.29379C23.8544 5.37782 21.9222 4.14197 19.779 4.02712C19.4421 4.00907 19.1044 4.01906 18.7691 4.05699L18.4929 4.08823C17.2733 4.22621 16.606 5.85261 17.0551 7.01535C17.6675 8.6009 18.0136 10.8058 16.9839 13.322C15.994 15.7409 17.7395 18.4068 20.3133 18.4068H20.9535C22.5819 18.4068 24.0506 17.4099 24.6769 15.8795L25.456 13.9756C26.2826 11.9557 26.1622 9.66259 25.1288 7.74387L24.8864 7.29379Z"
          fill="#FFF8FC"
        />
      </svg>
    );
  }
  // NammaTN — green app icon with a map pin
  return (
    <span
      className="grid shrink-0 place-items-center rounded-[5px]"
      style={{ width: size, height: size, backgroundColor: "#0d3d2c" }}
    >
      <svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 21.5s-6.5-6.13-6.5-10.5a6.5 6.5 0 1 1 13 0c0 4.37-6.5 10.5-6.5 10.5z"
          fill="#6ee7b7"
        />
        <circle cx="12" cy="11" r="2.4" fill="#0d3d2c" />
      </svg>
    </span>
  );
}
