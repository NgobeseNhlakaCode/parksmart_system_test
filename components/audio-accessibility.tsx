"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Play, Pause, RotateCcw } from "lucide-react"

export function AudioAccessibility() {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const [currentText, setCurrentText] = useState("")
  const [readingSpeed, setReadingSpeed] = useState(1)
  const speechRef = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      speechRef.current = window.speechSynthesis
      
      // Check if audio mode was previously enabled
      const savedAudioMode = localStorage.getItem("parkSmartAudioMode")
      if (savedAudioMode === "true") {
        setIsAudioEnabled(true)
      }
    }
  }, [])

  const toggleAudioMode = () => {
    const newState = !isAudioEnabled
    setIsAudioEnabled(newState)
    localStorage.setItem("parkSmartAudioMode", newState.toString())
    
    if (newState) {
      speak("Audio accessibility mode enabled. You can now use voice commands and text-to-speech features.")
    } else {
      stopSpeaking()
      speak("Audio accessibility mode disabled.")
    }
  }

  const speak = (text: string) => {
    if (!speechRef.current || !isAudioEnabled) return

    // Stop any current speech
    stopSpeaking()

    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = readingSpeed
      utterance.pitch = 1
      utterance.volume = 1
      
      // Set voice to a clear English voice if available
      const voices = speechRef.current.getVoices()
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.includes('en'))
      
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.onstart = () => {
        setIsReading(true)
        setCurrentText(text)
      }

      utterance.onend = () => {
        setIsReading(false)
        setCurrentText("")
      }

      utterance.onerror = (event) => {
        // Handle specific error types gracefully
        if (event.error === 'canceled') {
          console.log('Speech was canceled by user')
        } else if (event.error === 'interrupted') {
          console.log('Speech was interrupted')
        } else if (event.error === 'audio-busy') {
          console.log('Audio system is busy, retrying...')
          // Retry after a short delay
          setTimeout(() => speak(text), 1000)
        } else if (event.error === 'audio-hardware') {
          console.log('Audio hardware error detected')
        } else if (event.error === 'network') {
          console.log('Network error occurred')
        } else if (event.error === 'not-allowed') {
          console.log('Speech synthesis not allowed')
        } else if (event.error === 'synthesis-failed') {
          console.log('Speech synthesis failed')
        } else {
          console.log('Speech synthesis error occurred:', event.error)
        }
        
        setIsReading(false)
        setCurrentText("")
      }

      utteranceRef.current = utterance
      speechRef.current.speak(utterance)
    } catch (error) {
      console.log('Error creating speech utterance:', error)
      setIsReading(false)
      setCurrentText("")
    }
  }

  const stopSpeaking = () => {
    if (speechRef.current) {
      speechRef.current.cancel()
    }
    setIsReading(false)
    setCurrentText("")
  }

  const pauseSpeaking = () => {
    if (speechRef.current) {
      speechRef.current.pause()
    }
  }

  const resumeSpeaking = () => {
    if (speechRef.current) {
      speechRef.current.resume()
    }
  }

  const readPageContent = () => {
    if (!isAudioEnabled) {
      speak("Please enable audio mode first")
      return
    }

    // Get all text content from the page
    const pageText = extractPageText()
    speak(pageText)
  }

  const extractPageText = (): string => {
    const mainContent = document.querySelector('main') || document.body
    const textElements = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, a, li')
    
    let text = "Welcome to ParkSmart. "
    
    textElements.forEach((element) => {
      const elementText = element.textContent?.trim()
      if (elementText && elementText.length > 0) {
        // Skip very short text and navigation elements
        if (elementText.length > 3 && !elementText.includes('Menu') && !elementText.includes('Close')) {
          text += elementText + ". "
        }
      }
    })
    
    return text.substring(0, 2000) + " End of page content."
  }

  const readCurrentElement = (element: HTMLElement) => {
    if (!isAudioEnabled) return
    
    const text = element.textContent?.trim()
    if (text && text.length > 0) {
      speak(text)
    }
  }

  const adjustSpeed = (direction: 'up' | 'down') => {
    if (direction === 'up' && readingSpeed < 2) {
      setReadingSpeed(prev => prev + 0.25)
    } else if (direction === 'down' && readingSpeed > 0.5) {
      setReadingSpeed(prev => prev - 0.25)
    }
  }

  // Add click handlers to important elements when audio mode is enabled
  useEffect(() => {
    if (!isAudioEnabled) return

    const addAudioHandlers = () => {
      const elements = document.querySelectorAll('button, a, h1, h2, h3, .card, .parking-lot-card')
      
      elements.forEach((element) => {
        element.addEventListener('click', () => {
          const text = element.textContent?.trim()
          if (text && text.length > 0 && text.length < 100) {
            speak(text)
          }
        })
      })
    }

    // Add handlers after a short delay to ensure DOM is ready
    const timer = setTimeout(addAudioHandlers, 1000)
    
    return () => {
      clearTimeout(timer)
      // Remove handlers when component unmounts
      const elements = document.querySelectorAll('button, a, h1, h2, h3, .card, .parking-lot-card')
      elements.forEach((element) => {
        element.removeEventListener('click', () => {})
      })
    }
  }, [isAudioEnabled])

  if (!speechRef.current) {
    return null // Don't render if speech synthesis is not supported
  }

  return (
    <div className="fixed bottom-4 right-20 z-50 space-y-2">
      {/* Audio Mode Toggle */}
      <Button
        onClick={toggleAudioMode}
        className={`rounded-full w-14 h-14 shadow-xl border-2 ${
          isAudioEnabled 
            ? "bg-green-600 hover:bg-green-700 border-green-500" 
            : "bg-white hover:bg-gray-100 border-gray-300 text-gray-700"
        }`}
        title="Toggle Audio Accessibility Mode"
        aria-label="Toggle audio accessibility mode for screen readers"
      >
        {isAudioEnabled ? (
          <Volume2 className="h-6 w-6 text-white" />
        ) : (
          <VolumeX className="h-6 w-6 text-green-600" />
        )}
      </Button>

      {/* Audio Controls (only visible when audio mode is enabled) */}
      {isAudioEnabled && (
        <div className="space-y-2">
          {/* Read Page Button */}
          <Button
            onClick={readPageContent}
            className="rounded-full w-12 h-12 shadow-xl bg-green-500 hover:bg-green-600 border-2 border-green-400"
            title="Read entire page content"
            aria-label="Read entire page content"
          >
            <Play className="h-5 w-5 text-white" />
          </Button>

          {/* Stop Reading Button */}
          {isReading && (
            <Button
              onClick={stopSpeaking}
              className="rounded-full w-12 h-12 shadow-xl bg-red-500 hover:bg-red-600 border-2 border-red-400"
              title="Stop reading"
              aria-label="Stop reading"
            >
              <Pause className="h-5 w-5 text-white" />
            </Button>
          )}

          {/* Speed Controls */}
          <div className="bg-white rounded-lg p-2 shadow-xl border-2 border-gray-300">
            <div className="text-xs text-center text-gray-600 mb-1">Speed</div>
            <div className="flex flex-col gap-1">
              <Button
                onClick={() => adjustSpeed('up')}
                className="w-8 h-6 text-xs bg-blue-500 hover:bg-blue-600"
                disabled={readingSpeed >= 2}
              >
                +
              </Button>
              <div className="text-xs text-center text-gray-700">
                {readingSpeed.toFixed(1)}x
              </div>
              <Button
                onClick={() => adjustSpeed('down')}
                className="w-8 h-6 text-xs bg-blue-500 hover:bg-blue-600"
                disabled={readingSpeed <= 0.5}
              >
                -
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Status Indicator */}
      {isAudioEnabled && (
        <div className="bg-green-600 text-white text-sm px-3 py-2 rounded-full shadow-xl border-2 border-green-500 font-medium">
          🔊 Audio Mode Active
        </div>
      )}

      {/* Current Reading Status */}
      {isReading && currentText && (
        <div className="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg shadow-xl border-2 border-blue-500 max-w-xs">
          <div className="font-medium mb-1">Currently Reading:</div>
          <div className="truncate">{currentText.substring(0, 50)}...</div>
        </div>
      )}
    </div>
  )
}
