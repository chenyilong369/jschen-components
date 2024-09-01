export const transformEventName = (name: string) => {
  return 'on' + name[0].toUpperCase() + (name.length > 1 ? name.slice(1) : '')
}