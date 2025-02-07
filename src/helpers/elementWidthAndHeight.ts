export function getElementWidthAndHeight(id: string) {
  const el = document.getElementById(id)

  if (!el) {
    return {
      width: 0,
      height: 0
    }
  }

  return {
    width: el.offsetWidth,
    height: el.offsetHeight
  }
}
