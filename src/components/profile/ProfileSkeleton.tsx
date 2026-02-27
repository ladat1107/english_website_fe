/**
 * Khailingo - Profile Skeleton
 * Component skeleton loading cho trang Profile
 */

import { Skeleton } from '@/components/ui/skeleton';

export function ProfilePageSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
            {/* Hero Skeleton */}
            <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background pt-8 pb-24">
                <div className="container-custom">
                    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                        {/* Avatar Skeleton */}
                        <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full" />

                        {/* Info Skeleton */}
                        <div className="text-center sm:text-left space-y-3 flex-1">
                            <Skeleton className="h-8 w-48 mx-auto sm:mx-0" />
                            <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="container-custom py-8 sm:py-12 space-y-8 sm:space-y-12">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-xl" />
                    ))}
                </div>

                {/* Progress Section */}
                <div>
                    <Skeleton className="h-6 w-48 mb-4" />
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-32 rounded-xl" />
                        ))}
                    </div>
                </div>

                {/* Activity Section */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                        <Skeleton className="h-6 w-40 mb-4" />
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-20 rounded-xl" />
                            ))}
                        </div>
                    </div>
                    <div>
                        <Skeleton className="h-6 w-40 mb-4" />
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-20 rounded-xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ProfileStatsSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
        </div>
    );
}

export function ProfileProgressSkeleton() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
        </div>
    );
}

export function ProfileActivitySkeleton() {
    return (
        <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
        </div>
    );
}
