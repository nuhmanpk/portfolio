"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        // Only show on desktop
        if (typeof window !== "undefined" && window.innerWidth < 768) {
            return;
        }

        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };

        const handleMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                target.classList.contains("cursor-pointer") ||
                target.closest(".cursor-pointer")
            ) {
                setIsHovering(true);
            }
        };

        const handleMouseLeave = () => {
            setIsHovering(false);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);
        const handleMouseOut = () => setIsVisible(false);

        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("mouseover", handleMouseEnter);
        window.addEventListener("mouseout", handleMouseLeave);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mouseleave", handleMouseOut);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("mouseover", handleMouseEnter);
            window.removeEventListener("mouseout", handleMouseLeave);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mouseleave", handleMouseOut);
        };
    }, []);

    // Don't render on mobile
    if (typeof window !== "undefined" && window.innerWidth < 768) {
        return null;
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Main cursor dot */}
                    <motion.div
                        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                        animate={{
                            x: mousePosition.x - (isHovering ? 20 : 6),
                            y: mousePosition.y - (isHovering ? 20 : 6),
                            scale: isClicking ? 0.8 : 1,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 1500,
                            damping: 40,
                            mass: 0.2,
                        }}
                    >
                        <motion.div
                            className="rounded-full bg-white"
                            animate={{
                                width: isHovering ? 40 : 12,
                                height: isHovering ? 40 : 12,
                            }}
                            transition={{ duration: 0.2 }}
                        />
                    </motion.div>

                    {/* Trailing ring */}
                    <motion.div
                        className="fixed top-0 left-0 pointer-events-none z-[9998]"
                        animate={{
                            x: mousePosition.x - 20,
                            y: mousePosition.y - 20,
                            opacity: isHovering ? 0 : 0.5,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 150,
                            damping: 15,
                            mass: 0.1,
                        }}
                    >
                        <div className="w-10 h-10 rounded-full border border-primary/50" />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
