# Accessibility Guidelines

This document outlines the accessibility standards and best practices for the Resume Builder application.

## WCAG 2.1 AA Compliance

All components and pages must meet WCAG 2.1 AA standards. This includes:

### Perceivable
- **Text Alternatives**: All non-text content has text alternatives
- **Time-based Media**: Captions and audio descriptions where applicable
- **Adaptable**: Content can be presented in different ways without losing structure
- **Distinguishable**: Content is easy to see and hear

### Operable
- **Keyboard Accessible**: All functionality is available from a keyboard
- **Enough Time**: Users have enough time to read and use content
- **Seizures**: Content does not cause seizures or physical reactions
- **Navigable**: Users can navigate, find content, and determine where they are

### Understandable
- **Readable**: Text is readable and understandable
- **Predictable**: Pages operate in predictable ways
- **Input Assistance**: Users are helped to avoid and correct mistakes

### Robust
- **Compatible**: Content is compatible with current and future user tools

## Implementation Checklist

### Buttons and Interactive Elements
- [ ] All buttons have descriptive `aria-label` attributes
- [ ] Icon-only buttons have meaningful labels
- [ ] Loading states are announced to screen readers
- [ ] Disabled states are properly communicated
- [ ] Focus indicators are visible and meet contrast requirements

### Forms and Inputs
- [ ] All form inputs have associated labels using `htmlFor`
- [ ] Error messages are associated with their inputs
- [ ] Required fields are clearly marked
- [ ] Validation feedback is announced to screen readers
- [ ] Form groups use appropriate ARIA landmarks

### Navigation
- [ ] Skip links are available for keyboard users
- [ ] Navigation is logical and consistent
- [ ] Current page/location is clearly indicated
- [ ] Breadcrumbs are provided where appropriate

### Images and Media
- [ ] All images have meaningful `alt` text
- [ ] Decorative images have `alt=""` or `aria-hidden="true"`
- [ ] Complex images have detailed descriptions
- [ ] Video content has captions (if applicable)

### Color and Contrast
- [ ] Text contrast ratio meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- [ ] Color is not the only way to convey information
- [ ] High contrast mode is supported
- [ ] Focus indicators are visible in all color schemes

### Keyboard Navigation
- [ ] All interactive elements are reachable via keyboard
- [ ] Tab order is logical and intuitive
- [ ] Focus is trapped in modals
- [ ] Escape key closes modals and overlays
- [ ] Arrow keys work for custom components (dropdowns, sliders, etc.)

### Screen Reader Support
- [ ] Semantic HTML elements are used appropriately
- [ ] ARIA landmarks are used for page structure
- [ ] Live regions are used for dynamic content updates
- [ ] Headings are used in logical order
- [ ] Lists are properly marked up

## Testing

### Automated Testing
- Use axe-core or similar tools for automated accessibility testing
- Run accessibility audits in browser dev tools
- Test with keyboard navigation only
- Verify color contrast ratios

### Manual Testing
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Test with keyboard navigation only
- Test with high contrast mode enabled
- Test with different zoom levels (200% minimum)

### User Testing
- Include users with disabilities in testing
- Test with assistive technologies
- Gather feedback on accessibility issues

## Common Patterns

### Button with Icon
```tsx
<Button
  aria-label="Delete resume"
  onClick={handleDelete}
>
  <Trash2 className="h-4 w-4" aria-hidden="true" />
</Button>
```

### Form Input with Label
```tsx
<Label htmlFor="email">Email Address</Label>
<Input
  id="email"
  type="email"
  aria-describedby="email-error"
/>
{error && <p id="email-error" className="text-red-500">{error}</p>}
```

### Modal with Focus Management
```tsx
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Modal Title</h2>
  <button aria-label="Close modal" onClick={onClose}>×</button>
  {/* Modal content */}
</div>
```

### Loading State
```tsx
<Button disabled={loading} aria-label={loading ? 'Saving...' : 'Save'}>
  {loading ? (
    <>
      <Spinner aria-hidden="true" />
      Saving...
    </>
  ) : (
    'Save'
  )}
</Button>
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Checklist](https://webaim.org/standards/wcag/checklist)
- [axe-core Testing](https://github.com/dequelabs/axe-core)

## Reporting Issues

When reporting accessibility issues:
1. Describe the problem clearly
2. Include steps to reproduce
3. Specify the assistive technology used
4. Provide expected behavior
5. Include browser and OS information 