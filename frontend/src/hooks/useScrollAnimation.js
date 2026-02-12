import { useEffect } from "react";

const useScrollAnimation = (selector = ".reveal") => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selector]);
};

export default useScrollAnimation;
