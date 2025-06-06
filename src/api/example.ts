export const fetchExample = async (): Promise<{ text: string }> => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1')
    if (!res.ok) throw new Error('Failed to fetch')
    return res.json()
  }
  