import { renderHook, fireEvent } from '@testing-library/react'
import { useClickOutside } from './useClickOutside'

describe('useClickOutside', () => {
  let element: HTMLElement
  let handler: jest.Mock

  beforeEach(() => {
    element = document.createElement('div')
    document.body.appendChild(element)
    handler = jest.fn()
  })

  afterEach(() => {
    document.body.removeChild(element)
    jest.clearAllMocks()
  })

  it('should call handler when clicking outside the element', () => {
    const ref = { current: element }
    renderHook(() => useClickOutside(ref, handler))

    // Create a separate element outside the ref element
    const outsideElement = document.createElement('div')
    document.body.appendChild(outsideElement)

    // Click outside the element
    fireEvent.click(outsideElement)

    expect(handler).toHaveBeenCalledTimes(1)

    document.body.removeChild(outsideElement)
  })

  it('should not call handler when clicking inside the element', () => {
    const ref = { current: element }
    renderHook(() => useClickOutside(ref, handler))

    // Click inside the element
    element.click()

    expect(handler).not.toHaveBeenCalled()
  })

  it('should not call handler when ref.current is null', () => {
    const ref = { current: null }
    renderHook(() => useClickOutside(ref, handler))

    // Click anywhere
    document.body.click()

    expect(handler).not.toHaveBeenCalled()
  })

  it('should handle touch events', () => {
    const ref = { current: element }
    renderHook(() => useClickOutside(ref, handler))

    // Touch outside the element
    fireEvent.touchStart(document.body)

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should clean up event listeners on unmount', () => {
    const ref = { current: element }
    const { unmount } = renderHook(() => useClickOutside(ref, handler))

    // Spy on document.removeEventListener
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener')

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function))

    removeEventListenerSpy.mockRestore()
  })

  it('should update handler when it changes', () => {
    const ref = { current: element }
    const newHandler = jest.fn()

    const { rerender } = renderHook(
      ({ handler }) => useClickOutside(ref, handler),
      { initialProps: { handler } }
    )

    // Create a separate element outside the ref element
    const outsideElement = document.createElement('div')
    document.body.appendChild(outsideElement)

    // Click outside to test old handler
    fireEvent.click(outsideElement)

    document.body.removeChild(outsideElement)
    expect(handler).toHaveBeenCalledTimes(1)

    // Rerender with new handler
    rerender({ handler: newHandler })

    // Click outside again to test new handler
    document.body.click()
    expect(newHandler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledTimes(1) // Old handler should not be called again
  })
})