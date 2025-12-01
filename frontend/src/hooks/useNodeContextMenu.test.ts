import { renderHook, act } from '@testing-library/react'
import { useNodeContextMenu } from './useNodeContextMenu'

describe('useNodeContextMenu', () => {
  it('should initialize with closed menu', () => {
    const { result } = renderHook(() => useNodeContextMenu())

    expect(result.current.isOpen).toBe(false)
    expect(result.current.position).toEqual({ x: 0, y: 0 })
  })

  it('should open menu with specified position', () => {
    const { result } = renderHook(() => useNodeContextMenu())

    act(() => {
      result.current.openMenu(100, 200)
    })

    expect(result.current.isOpen).toBe(true)
    expect(result.current.position).toEqual({ x: 100, y: 200 })
  })

  it('should close menu', () => {
    const { result } = renderHook(() => useNodeContextMenu())

    // First open the menu
    act(() => {
      result.current.openMenu(100, 200)
    })

    expect(result.current.isOpen).toBe(true)

    // Then close it
    act(() => {
      result.current.closeMenu()
    })

    expect(result.current.isOpen).toBe(false)
    expect(result.current.position).toEqual({ x: 0, y: 0 })
  })

  it('should update position when opening menu multiple times', () => {
    const { result } = renderHook(() => useNodeContextMenu())

    act(() => {
      result.current.openMenu(100, 200)
    })

    expect(result.current.position).toEqual({ x: 100, y: 200 })

    act(() => {
      result.current.openMenu(300, 400)
    })

    expect(result.current.position).toEqual({ x: 300, y: 400 })
    expect(result.current.isOpen).toBe(true)
  })

  it('should return stable function references', () => {
    const { result, rerender } = renderHook(() => useNodeContextMenu())

    const initialOpenMenu = result.current.openMenu
    const initialCloseMenu = result.current.closeMenu

    // Trigger a rerender
    rerender()

    expect(result.current.openMenu).toBe(initialOpenMenu)
    expect(result.current.closeMenu).toBe(initialCloseMenu)
  })
})