enum SidebarStatus {
  SHOWN = 'shown',
  HIDDEN = 'hidden'
}

export const isSidebarStatusShown = (sidebarStatus: string | undefined): boolean => {
  if (sidebarStatus === SidebarStatus.HIDDEN) {
    return false
  }

  return true
}

export default SidebarStatus