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
    render(<HeroSection />)
    expect(screen.getByText(/Build your professional resume/i)).toBeInTheDocument()
    expect(screen.getByText(/in 5 easy steps/i)).toBeInTheDocument()
  })

  it("renders the robot image with alt text", () => {
    render(<HeroSection />)
    const img = screen.getByAltText(/AI Robot holding resume/i)
    expect(img).toBeInTheDocument()
  })

  it("renders the Build My Resume Now button", () => {
    render(<HeroSection />)
    expect(screen.getByRole("button", { name: /Build My Resume Now/i })).toBeInTheDocument()
  })

  it("navigates to templates page with modal parameter when Build My Resume Now is clicked", () => {
    render(<HeroSection />)
    const buildResumeButton = screen.getByRole("button", { name: /Build My Resume Now/i })
    fireEvent.click(buildResumeButton)
    expect(mockPush).toHaveBeenCalledWith('/templates?modal=open')
  })

  it("button is keyboard accessible", () => {
    render(<HeroSection />)
    const buildResumeButton = screen.getByRole("button", { name: /Build My Resume Now/i })
    buildResumeButton.focus()
    expect(document.activeElement).toBe(buildResumeButton)
  })
}) 