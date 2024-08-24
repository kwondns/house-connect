import { RefObject, useEffect, useState } from 'react';

export function useObserver(element: RefObject<HTMLDivElement> | null) {
  const [isShow, setShow] = useState(false);
  useEffect(() => {
    if (!element?.current) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setShow(true);
          } else setShow(false);
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      },
    );
    observer.observe(element.current);
    return () => observer.disconnect();
  }, [element]);
  return isShow;
}
