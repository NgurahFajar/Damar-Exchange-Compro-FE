import React, { memo } from 'react';
import { Coins, DollarSign, CircleDot, Sparkles, ChevronDown } from 'lucide-react';

const variants = {
    icon: {
        light: "flex items-center justify-center gap-4 py-7 lg:py-28 ",
        dark: "flex items-center justify-center gap-4 py-7 lg:py-28"
    },
    double: {
        light: "space-y-1 py-7 lg:py-28",
        dark: "space-y-1 py-7 lg:py-28"
    },
    dots: {
        light: "flex items-center justify-center gap-3 py-6",
        dark: "flex items-center justify-center gap-3 py-6"
    },
    gradient: {
        light: "py-7 lg:py-28 relative",
        dark: "py-7 lg:py-28 relative"
    },
    chevron: {
        light: "py-7 lg:py-28 relative overflow-hidden",
        dark: "py-7 lg:py-28 relative overflow-hidden"
    },
    fancy: {
        light: "py-7 lg:py-28 flex items-center justify-center gap-4",
        dark: "py-7 lg:py-28 flex items-center justify-center gap-4"
    }
};

const IconDivider = memo(({ isDark }) => (
    <div className="flex items-center w-full">
        <div className={`h-px flex-1 ${isDark ? 'bg-orange-500/30' : 'bg-orange-600/30'}`} />
        <div className="flex gap-3 px-4">
            <Coins className={`w-5 h-5 ${isDark ? 'text-orange-500/50' : 'text-orange-600/50'}`} />
            <DollarSign className={`w-5 h-5 ${isDark ? 'text-orange-500/50' : 'text-orange-600/50'}`} />
        </div>
        <div className={`h-px flex-1 ${isDark ? 'bg-orange-500/30' : 'bg-orange-600/30'}`} />
    </div>
));

const DoubleDivider = memo(({ isDark }) => (
    <div className="w-full">
        <div className={`h-px w-full ${isDark ? 'bg-orange-500/20' : 'bg-orange-600/20'}`} />
        <div className={`h-px w-full mt-1 ${isDark ? 'bg-orange-500/10' : 'bg-orange-600/10'}`} />
    </div>
));

const DotsDivider = memo(({ isDark }) => (
    <div className="flex items-center justify-center gap-3">
        {[...Array(5)].map((_, i) => (
            <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    isDark ? 'bg-orange-500/40' : 'bg-orange-600/40'
                }`}
                style={{ animationDelay: `${i * 200}ms` }}
            />
        ))}
    </div>
));

const GradientDivider = memo(({ isDark }) => (
    <div className="relative w-full h-px">
        <div className={`absolute inset-0 ${
            isDark
                ? 'bg-gradient-to-r from-transparent via-orange-500/30 to-transparent'
                : 'bg-gradient-to-r from-transparent via-orange-600/30 to-transparent'
        }`} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
    </div>
));

const ChevronDivider = memo(({ isDark }) => (
    <div className="flex flex-col items-center gap-2">
        <ChevronDown
            className={`w-6 h-6 animate-bounce ${
                isDark ? 'text-orange-500/50' : 'text-orange-600/50'
            }`}
        />
        <ChevronDown
            className={`w-6 h-6 -mt-4 animate-bounce ${
                isDark ? 'text-orange-500/30' : 'text-orange-600/30'
            }`}
            style={{ animationDelay: '150ms' }}
        />
    </div>
));

const FancyDivider = memo(({ isDark }) => (
    <div className="flex items-center w-full">
        <div className={`h-px flex-1 ${isDark ? 'bg-gradient-to-r from-transparent to-orange-500/30' : 'bg-gradient-to-r from-transparent to-orange-600/30'}`} />
        <div className="relative px-4">
            <Sparkles className={`w-6 h-6 ${isDark ? 'text-orange-500' : 'text-orange-600'} animate-pulse`} />
            <CircleDot className={`w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isDark ? 'text-orange-500/70' : 'text-orange-600/70'}`} />
        </div>
        <div className={`h-px flex-1 ${isDark ? 'bg-gradient-to-l from-transparent to-orange-500/30' : 'bg-gradient-to-l from-transparent to-orange-600/30'}`} />
    </div>
));

const SectionDivider = memo(({
                                 isDark = true,
                                 variant = 'simple',
                                 className = ''
                             }) => {
    const renderDivider = () => {
        switch (variant) {
            case 'icon':
                return <IconDivider isDark={isDark} />;
            case 'double':
                return <DoubleDivider isDark={isDark} />;
            case 'dots':
                return <DotsDivider isDark={isDark} />;
            case 'gradient':
                return <GradientDivider isDark={isDark} />;
            case 'chevron':
                return <ChevronDivider isDark={isDark} />;
            case 'fancy':
                return <FancyDivider isDark={isDark} />;
            default:
                return (
                    <div className={`h-px w-full ${
                        isDark ? 'bg-orange-500/20' : 'bg-orange-600/20'
                    }`} />
                );
        }
    };

    const variantClass = variants[variant]?.[isDark ? 'dark' : 'light'] || 'py-6';

    return (
        <div className={`w-full ${variantClass} ${className}`}>
            {renderDivider()}
        </div>
    );
});

// Add display names for debugging
IconDivider.displayName = 'IconDivider';
DoubleDivider.displayName = 'DoubleDivider';
DotsDivider.displayName = 'DotsDivider';
GradientDivider.displayName = 'GradientDivider';
ChevronDivider.displayName = 'ChevronDivider';
FancyDivider.displayName = 'FancyDivider';
SectionDivider.displayName = 'SectionDivider';

export default SectionDivider;