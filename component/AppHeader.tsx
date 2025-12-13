import React from 'react'

const AppHeader = () => {
  return (
   <div className="h-14 border-b bg-white flex items-center px-6">
  <span className="font-semibold text-lg">AskMyDocs</span>

  <div className="ml-auto flex gap-4 text-sm text-muted-foreground">
    <button>Upload</button>
    <button>Docs</button>
    <button>Chat</button>
  </div>
</div>
  )
}

export default AppHeader
