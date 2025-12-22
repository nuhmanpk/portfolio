"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { X, Sparkles } from "lucide-react";

interface SummaryItem {
    title: string;
    aiSummary?: string;
}

interface AISummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: SummaryItem[];
    sectionTitle: string;
}

export function AISummaryModal({
    isOpen,
    onClose,
    items,
    sectionTitle,
}: AISummaryModalProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [currentPhase, setCurrentPhase] = useState<"intro" | "content" | "done">("intro");

    const generateFullText = useCallback(() => {
        const intro = `🤖 *processing ${sectionTitle.toLowerCase()}...*\n\nAlright, let me break this down for you:\n\n`;

        const itemSummaries = items
            .filter((item) => item.aiSummary)
            .map((item, index) => `${index + 1}. **${item.title}**\n   ${item.aiSummary}`)
            .join("\n\n");

        const outro = `\n\n✨ That's the vibe! Any questions? Just kidding, I'm not a real LLM... or am I? 🤔`;

        return intro + itemSummaries + outro;
    }, [items, sectionTitle]);

    useEffect(() => {
        if (!isOpen) {
            setDisplayedText("");
            setCurrentPhase("intro");
            setIsTyping(false);
            return;
        }

        const fullText = generateFullText();
        let currentIndex = 0;
        setIsTyping(true);
        setCurrentPhase("content");

        const typeInterval = setInterval(() => {
            if (currentIndex < fullText.length) {
                setDisplayedText(fullText.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(typeInterval);
                setIsTyping(false);
                setCurrentPhase("done");
            }
        }, 15); // Typing speed

        return () => clearInterval(typeInterval);
    }, [isOpen, generateFullText]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const formatText = (text: string) => {
        // Simple markdown-like formatting
        return text
            .split("\n")
            .map((line, i) => {
                // Bold text
                let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>');
                // Italic text
                formatted = formatted.replace(/\*(.*?)\*/g, '<em class="text-muted-foreground italic">$1</em>');

                return (
                    <span key={i} className="block" dangerouslySetInnerHTML={{ __html: formatted }} />
                );
            });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="relative max-w-2xl w-full">
                            {/* Animated aura border */}
                            <div
                                className="absolute -inset-[2px] rounded-2xl opacity-75 animate-aura-pulse"
                                style={{
                                    background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #8b5cf6 100%)",
                                    backgroundSize: "200% 200%",
                                    animation: "gradient-rotate 3s ease infinite, aura-pulse 2s ease-in-out infinite",
                                }}
                            />

                            {/* Modal content */}
                            <div className="relative bg-background/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-border/50">
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            animate={{ rotate: isTyping ? 360 : 0 }}
                                            transition={{ duration: 2, repeat: isTyping ? Infinity : 0, ease: "linear" }}
                                        >
                                            <Sparkles className="h-6 w-6 text-purple-500" />
                                        </motion.div>
                                        <h2 className="text-xl font-bold text-primary">
                                            AI Summary: {sectionTitle}
                                        </h2>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={onClose}
                                        className="p-2 rounded-full hover:bg-muted transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </motion.button>
                                </div>

                                {/* Content */}
                                <div className="p-6 max-h-[60vh] overflow-y-auto">
                                    <div className="font-mono text-sm leading-relaxed text-foreground/90">
                                        {formatText(displayedText)}
                                        {isTyping && (
                                            <motion.span
                                                animate={{ opacity: [1, 0] }}
                                                transition={{ duration: 0.5, repeat: Infinity }}
                                                className="inline-block w-2 h-4 bg-purple-500 ml-1 align-middle"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="p-4 border-t border-border/50 flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">
                                        {isTyping ? "🤖 Generating..." : "✅ Summary complete"}
                                    </span>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onClose}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                                    >
                                        Close
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
