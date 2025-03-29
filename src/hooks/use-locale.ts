'use client'

import { useState, useEffect } from "react"

export function useLocale() {
    const [locale, setLocale] = useState('fr-FR')

    useEffect(() =>{
        const browserLocale = navigator.language || 'fr-FR'
        setLocale(browserLocale)
    }, [])

    return locale
}