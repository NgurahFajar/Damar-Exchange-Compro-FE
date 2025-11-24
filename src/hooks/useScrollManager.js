const useScrollManager = (navigationItems, setActiveSection) => {
    const observerRef = useRef(null);
    const isScrollingRef = useRef(false);

    const scrollToSection = useCallback((sectionId, sectionRef) => {
        const targetId = sectionRef || sectionId;
        const element = document.getElementById(targetId);
        if (!element || isScrollingRef.current) return;

        isScrollingRef.current = true;

        const headerHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const startPosition = window.pageYOffset;
        const targetPosition = elementPosition + startPosition - headerHeight;

        const duration = 1000;
        const start = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Enhanced easing function for smoother animation
            const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
            const easedProgress = easeOutCubic(progress);

            const currentPosition = startPosition + (targetPosition - startPosition) * easedProgress;
            window.scrollTo(0, currentPosition);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                isScrollingRef.current = false;
                setActiveSection(sectionId);
            }
        };

        requestAnimationFrame(animate);
    }, [setActiveSection]);

    useEffect(() => {
        const options = {
            rootMargin: "-50% 0px",
            threshold: [0, 0.5, 1]
        };

        const handleIntersection = (entries) => {
            if (isScrollingRef.current) return;

            const visibleSections = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => {
                    const aDistance = Math.abs(0.5 - entry.intersectionRatio);
                    const bDistance = Math.abs(0.5 - entry.intersectionRatio);
                    return aDistance - bDistance;
                });

            if (visibleSections.length > 0) {
                const targetSection = visibleSections[0].target;
                const sectionId = navigationItems.find(
                    item => (item.sectionRef || item.id) === targetSection.id
                )?.id;

                if (sectionId) setActiveSection(sectionId);
            }
        };

        observerRef.current = new IntersectionObserver(handleIntersection, options);

        navigationItems.forEach(item => {
            const element = document.getElementById(item.sectionRef || item.id);
            if (element) observerRef.current.observe(element);
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [navigationItems, setActiveSection]);

    return { scrollToSection, isScrollingRef };
};
