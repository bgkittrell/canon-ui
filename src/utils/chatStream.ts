import { ref, readonly } from 'vue'
const resolveStream = async (
  data: { value: string },
  onChunk: Function,
  onStart: Function,
  onEnd: Function,
  stream: ReadableStream
) => {
  const reader = stream.pipeThrough(new TextDecoderStream()).getReader()
  let counter = 0
  while (counter++ < 1_000_000) {
    const stream = await reader.read()
    if (stream.done) break

    console.log('Stream')
    console.log(stream.value)
    const chunks = stream.value
      .split('\n')
      .filter((c) => c.trim() !== '')
      .map((c: string) => JSON.parse(c))

    for (const chunk of chunks) {
      if (chunk.event === 'thread.message.delta') {
        if (!chunk.data.delta) continue
        const content = chunk.data.delta.content[0]
        console.log(content)
        if (!content) continue
        onChunk(content.text.value)
      } else if (chunk.event === 'thread.message.created') {
        onStart()
      } else if (chunk.event === 'thread.message.completed') {
        onEnd()
      }
    }
  }
}

export const useChatStream = (
  stream: ReadableStream,
  onChunk: Function,
  onStart: Function,
  onEnd: Function
) => {
  const data = ref('')

  resolveStream(data, onChunk, onStart, onEnd, stream)

  return {
    data: readonly(data)
  }
}
