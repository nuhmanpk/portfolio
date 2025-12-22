"use client";
import { motion } from "framer-motion";
import React from "react";

interface AuraButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export function AuraButton({
    children,
    onClick,
    className = "",
}: AuraButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className={`
        relative p-1 cursor-pointer
        text-muted-foreground hover:text-primary
        transition-colors duration-200
        ${className}
      `}
        >
            {/* Aura glow effect - only visible on hover */}


            {/* Content */}
            <div className="relative z-10">{children}</div>
        </motion.button>
    );
}
