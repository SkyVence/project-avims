"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { useTranslations } from "next-intl"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"
import React from "react"

export function AppBreadcrumbs() {
  const pathname = usePathname()
  const t = useTranslations()

  // Don't render breadcrumbs on home page
  if (pathname === "/") {
    return (
      <Breadcrumb className="py-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" aria-label={t('navigation.home')}>
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  // Split the pathname into segments and remove empty strings
  const segments = pathname.split("/").filter(Boolean)

  // Generate breadcrumb items based on the pathname segments
  const breadcrumbItems = segments.map((segment, index) => {
    // Create the path for this breadcrumb item
    const href = `/${segments.slice(0, index + 1).join("/")}`

    // Check if this is the last segment (current page)
    const isLastSegment = index === segments.length - 1

    // Format the segment for display (capitalize and replace hyphens with spaces)
    const formattedSegment = segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())

    // Try to get translation for the segment, fallback to formatted segment
    const translationKey = `navigation.${segment.toLowerCase()}`
    const label = t.has(translationKey) ? t(translationKey) : formattedSegment

    return {
      href,
      label,
      isCurrent: isLastSegment,
    }
  })

  return (
    <Breadcrumb className="py-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" aria-label={t('navigation.home')}>
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>

        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.href}>
            <BreadcrumbItem>
              {item.isCurrent ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

