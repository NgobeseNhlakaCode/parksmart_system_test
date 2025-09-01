"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Eye } from "lucide-react"

export function ZoomMode() {
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  useEffect(() => {
    // Check if zoom mode was previously enabled
    const savedZoom = localStorage.getItem("parkSmartZoomMode")
    if (savedZoom === "true") {
      setIsZoomed(true)
      enableZoomMode()
    }
  }, [])

  const enableZoomMode = () => {
    document.body.style.zoom = "1.5"
    document.body.style.fontSize = "1.2em"
    document.body.style.lineHeight = "1.6"
    
    // Add high contrast mode
    document.body.classList.add("zoom-mode")
    
    // Add custom styles for better visibility
    const style = document.createElement("style")
    style.id = "zoom-mode-styles"
    style.textContent = `
      .zoom-mode {
        filter: contrast(1.2) brightness(1.1);
      }
      
      .zoom-mode * {
        font-size: 1.2em !important;
      }
      
      .zoom-mode button,
      .zoom-mode input,
      .zoom-mode select,
      .zoom-mode a {
        font-size: 1.1em !important;
        padding: 0.75em 1em !important;
      }
      
      .zoom-mode .card {
        padding: 1.5em !important;
      }
      
      .zoom-mode .text-sm {
        font-size: 1em !important;
      }
      
      .zoom-mode .text-xs {
        font-size: 0.9em !important;
      }
    `
    document.head.appendChild(style)
  }

  const disableZoomMode = () => {
    document.body.style.zoom = "1"
    document.body.style.fontSize = ""
    document.body.style.lineHeight = ""
    document.body.classList.remove("zoom-mode")
    
    // Remove custom styles
    const style = document.getElementById("zoom-mode-styles")
    if (style) {
      style.remove()
    }
  }

  const toggleZoomMode = () => {
    if (isZoomed) {
      disableZoomMode()
      setIsZoomed(false)
      localStorage.setItem("parkSmartZoomMode", "false")
    } else {
      enableZoomMode()
      setIsZoomed(true)
      localStorage.setItem("parkSmartZoomMode", "true")
    }
  }

  const increaseZoom = () => {
    if (zoomLevel < 2.5) {
      const newZoom = zoomLevel + 0.25
      setZoomLevel(newZoom)
      document.body.style.zoom = newZoom.toString()
    }
  }

  const decreaseZoom = () => {
    if (zoomLevel > 0.5) {
      const newZoom = zoomLevel - 0.25
      setZoomLevel(newZoom)
      document.body.style.zoom = newZoom.toString()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {/* Main Zoom Toggle */}
      <Button
        onClick={toggleZoomMode}
        className={`rounded-full w-14 h-14 shadow-xl border-2 ${
          isZoomed 
            ? "bg-blue-600 hover:bg-blue-700 border-blue-500" 
            : "bg-white hover:bg-gray-100 border-gray-300 text-gray-700"
        }`}
        title="Toggle Zoom Mode for Accessibility"
        aria-label="Toggle zoom mode for better accessibility"
      >
        <Eye className={`h-6 w-6 ${isZoomed ? "text-white" : "text-blue-600"}`} />
      </Button>

      {/* Zoom Controls (only visible when zoom mode is enabled) */}
      {isZoomed && (
        <div className="space-y-2">
          <Button
            onClick={increaseZoom}
            className="rounded-full w-12 h-12 shadow-xl bg-blue-500 hover:bg-blue-600 border-2 border-blue-400"
            title="Increase Zoom"
            aria-label="Increase zoom level"
          >
            <ZoomIn className="h-5 w-5 text-white" />
          </Button>
          
          <Button
            onClick={decreaseZoom}
            className="rounded-full w-12 h-12 shadow-xl bg-blue-500 hover:bg-blue-600 border-2 border-blue-400"
            title="Decrease Zoom"
            aria-label="Decrease zoom level"
          >
            <ZoomOut className="h-5 w-5 text-white" />
          </Button>
        </div>
      )}

      {/* Status Indicator */}
      {isZoomed && (
        <div className="bg-blue-600 text-white text-sm px-3 py-2 rounded-full shadow-xl border-2 border-blue-500 font-medium">
          🔍 Zoom Mode Active
        </div>
      )}
    </div>
  )
}
