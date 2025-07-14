import React from 'react'
import { render, screen, fireEvent } from "@testing-library/react"
import { useRouter } from "next/navigation"

import HeroSection from "./HeroSection"

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

describe("HeroSection", () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders the main heading", () => {
    expect.assertions(1)
    render(<HeroSection />)
    expect(screen.getByText(/Build Your Future/i)).toBeInTheDocument()
  })

  it("renders the robot image with alt text", () => {
    render(<HeroSection />)
    const img = screen.getByAltText(/AI Robot holding resume/i)
    expect(img).toBeInTheDocument()
  })

  it("renders the ellipse/spotlight behind the robot", () => {
    render(<HeroSection />)
    const ellipse = screen.getByTestId("hero-ellipse")
    expect(ellipse).toBeInTheDocument()
  })

  it("renders left and right text blocks", () => {
    render(<HeroSection />)
    expect(screen.getByText(/ATS-optimized resumes/i)).toBeInTheDocument()
    expect(screen.getByText(/Free, fast, and easy/i)).toBeInTheDocument()
  })

  it("renders the CTA button", () => {
    render(<HeroSection />)
    expect(screen.getByRole("button", { name: /Create New Document/i })).toBeInTheDocument()
  })

  it("has accessible alt text for images", () => {
    render(<HeroSection />)
    expect(screen.getByAltText(/AI Robot holding resume/i)).toBeInTheDocument()
  })

  it("uses full viewport height (h-screen)", () => {
    render(<HeroSection />)
    const section = document.querySelector('section')
    expect(section?.className).toMatch(/h-screen/)
  })

  it("renders at least one animated bubble blob", () => {
    render(<HeroSection />)
    // Look for a div with animate-bounce and rounded-full
    const bubbles = document.querySelectorAll('div.animate-bounce.rounded-full')
    expect(bubbles.length).toBeGreaterThan(0)
  })

  it("renders the Create New Document button", () => {
    render(<HeroSection />)
    expect(screen.getByRole("button", { name: /Create New Document/i })).toBeInTheDocument()
  })

  it("navigates to templates page with modal parameter when Create New Document is clicked", () => {
    render(<HeroSection />)
    const createNewDocumentButton = screen.getByRole("button", { name: /Create New Document/i })
    
    fireEvent.click(createNewDocumentButton)
    
    expect(mockPush).toHaveBeenCalledWith('/templates?modal=open')
  })

  it("renders the CTA button", () => {
    render(<HeroSection />)
    expect(screen.getByRole("button", { name: /Create New Document/i })).toBeInTheDocument()
  })

  it("has proper button styling for Create New Document button", () => {
    render(<HeroSection />)
    const createNewDocumentButton = screen.getByRole("button", { name: /Create New Document/i })
    
    expect(createNewDocumentButton).toHaveClass('border-2', 'border-slate-300', 'bg-white/80')
  })

  it("has proper accessibility attributes for Create New Document button", () => {
    render(<HeroSection />)
    const createNewDocumentButton = screen.getByRole("button", { name: /Create New Document/i })
    
    expect(createNewDocumentButton).toBeInTheDocument()
    // The button should be focusable
    createNewDocumentButton.focus()
    expect(document.activeElement).toBe(createNewDocumentButton)
  })

  it("has responsive design classes for button container", () => {
    render(<HeroSection />)
    const buttonContainer = document.querySelector('.flex.flex-col.sm\\:flex-row')
    
    expect(buttonContainer).toBeInTheDocument()
    expect(buttonContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'justify-center', 'items-center', 'gap-4')
  })

  it("button is keyboard accessible", () => {
    render(<HeroSection />)
    const createNewDocumentButton = screen.getByRole("button", { name: /Create New Document/i })
    
    createNewDocumentButton.focus()
    expect(document.activeElement).toBe(createNewDocumentButton)
  })
}) 