import { createJingleSample } from '@/lib/jingle-actions'

async function testServerAction() {
  'use server'
  
  const testData = {
    title: 'Test Server Action',
    description: 'Testing server action response format',
    business_type: 'Test',
    audio_url: 'https://example.com/test.mp3',
    cover_image_url: 'https://example.com/test.jpg'
  }
  
  return await createJingleSample(testData)
}

export default function TestServerActionPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Server Action Test</h1>
      <form action={testServerAction}>
        <button 
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Test Server Action
        </button>
      </form>
    </div>
  )
}