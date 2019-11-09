export function set(id: string, data: JSON): void {
  return localStorage.setItem(id, JSON.stringify(data));
}

export function get(id: string): any {
  var item: string | null = localStorage.getItem(id);
  if (item) {
    return JSON.parse(item);
  } else {
    return item;
  }
}
