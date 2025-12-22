"use client";
import { motion } from "framer-motion";
import { Download, FileText, Check } from "lucide-react";
import { useState } from "react";

export function DownloadResume() {
    const [isDownloading, setIsDownloading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);

        // Simulate download delay for animation
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Trigger actual download
        const link = document.createElement("a");
        link.href = "/resume.pdf"; // Make sure to add resume.pdf to public folder
        link.download = "Nuhman_PK_Resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setIsDownloading(false);
        setIsComplete(true);

        // Reset after 3 seconds
        setTimeout(() => setIsComplete(false), 3000);
    };

    return (
        <motion.button
            onClick={handleDownload}
            disabled={isDownloading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
        relative overflow-hidden
        flex items-center gap-2 px-6 py-3
        rounded-lg font-medium
        transition-all duration-300
        ${isComplete
                    ? "bg-green-500 text-white"
                    : "bg-primary text-primary-foreground hover:shadow-lg"
                }
      `}
        >
            {/* Background animation */}
            {isDownloading && (
                <motion.div
                    className="absolute inset-0 bg-primary-foreground/20"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            )}

            {/* Icon */}
            <motion.div
                animate={isDownloading ? { y: [0, -5, 0] } : {}}
                transition={{ duration: 0.5, repeat: isDownloading ? Infinity : 0 }}
            >
                {isComplete ? (
                    <Check className="h-5 w-5" />
                ) : isDownloading ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <Download className="h-5 w-5" />
                    </motion.div>
                ) : (
                    <FileText className="h-5 w-5" />
                )}
            </motion.div>

            {/* Text */}
            <span className="relative z-10">
                {isComplete ? "Downloaded!" : isDownloading ? "Downloading..." : "Download Resume"}
            </span>
        </motion.button>
    );
}

// Floating version for fixed position
export function FloatingDownloadResume() {
    const [isDownloading, setIsDownloading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const link = document.createElement("a");
        link.href = "/resume.pdf";
        link.download = "Nuhman_PK_Resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setIsDownloading(false);
        setIsComplete(true);
        setTimeout(() => setIsComplete(false), 3000);
    };

    return (
        <motion.button
            onClick={handleDownload}
            disabled={isDownloading}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`
        fixed right-0 top-1/2 -translate-y-1/2 z-40
        flex items-center gap-2 px-4 py-3
        rounded-l-lg font-medium shadow-lg
        transition-colors duration-300
        ${isComplete
                    ? "bg-green-500 text-white"
                    : "bg-primary text-primary-foreground"
                }
      `}
        >
            {isComplete ? (
                <Check className="h-5 w-5" />
            ) : isDownloading ? (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Download className="h-5 w-5" />
                </motion.div>
            ) : (
                <Download className="h-5 w-5" />
            )}
            <span className="hidden md:inline text-sm">Resume</span>
        </motion.button>
    );
}
