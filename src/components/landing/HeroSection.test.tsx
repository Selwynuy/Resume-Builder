import { render, screen } from "@testing-library/react"

import HeroSection from "./HeroSection"

describe("HeroSection", () => {
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
    expect(screen.getByText(/100% Free Forever/i)).toBeInTheDocument()
    expect(screen.getByText(/No Credit Card Required/i)).toBeInTheDocument()
    expect(screen.getByText(/ATS Optimized/i)).toBeInTheDocument()
  })

  it("renders the CTA button", () => {
    render(<HeroSection />)
    expect(screen.getByRole("button", { name: /Create my Resume/i })).toBeInTheDocument()
  })

  it("renders testimonial and trust badges", () => {
    render(<HeroSection />)
    expect(screen.getByText(/This resume builder got me hired/i)).toBeInTheDocument()
    expect(screen.getByText(/GDPR Compliant/i)).toBeInTheDocument()
    expect(screen.getByText(/Trusted by 10,000\+ users/i)).toBeInTheDocument()
    expect(screen.getByText(/Secure & Private/i)).toBeInTheDocument()
  })

  it("has accessible alt text for images", () => {
    render(<HeroSection />)
    expect(screen.getByAltText(/AI Robot holding resume/i)).toBeInTheDocument()
  })

  it("uses full viewport height (h-screen)", () => {
    render(<HeroSection />)
    const section = screen.getByRole('region', { hidden: true }) || document.querySelector('section')
    expect(section?.className).toMatch(/h-screen/)
  })

  it("renders at least one animated bubble blob", () => {
    render(<HeroSection />)
    // Look for a div with animate-bounce and rounded-full
    const bubbles = document.querySelectorAll('div.animate-bounce.rounded-full')
    expect(bubbles.length).toBeGreaterThan(0)
  })
}) 