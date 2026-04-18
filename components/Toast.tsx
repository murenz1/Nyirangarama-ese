'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react'
import { clsx } from 'clsx'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
    message: string
    type?: ToastType
    duration?: number
    onClose: () => void
}

const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
}

const styles = {
    success: 'border-green-100 bg-green-50',
    error: 'border-red-100 bg-red-50',
    info: 'border-blue-100 bg-blue-50',
    warning: 'border-yellow-100 bg-yellow-50',
}

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(onClose, 300) // Wait for exit animation
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onClose])

    return (
        <div
            className={clsx(
                'fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg transition-all duration-300 transform',
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                styles[type]
            )}
        >
            {icons[type]}
            <p className="text-sm font-medium text-gray-900">{message}</p>
            <button
                onClick={() => {
                    setIsVisible(false)
                    setTimeout(onClose, 300)
                }}
                className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors"
            >
                <X className="w-4 h-4 text-gray-400" />
            </button>
        </div>
    )
}
