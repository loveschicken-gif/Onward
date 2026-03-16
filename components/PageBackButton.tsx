"use client";

type PageBackButtonProps = {
  label?: string;
};

export default function PageBackButton({ label = "← Back" }: PageBackButtonProps) {
  const handleBack = () => {
    if (typeof window === "undefined") return;
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <button
      type="button"
      className="page-back-button"
      onClick={handleBack}
      aria-label="Go back to previous page"
    >
      {label}
    </button>
  );
}

