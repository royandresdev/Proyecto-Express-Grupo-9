import type { FC } from "react"

interface MessageIAProps {
  msg: string
  timeStamp: string
}

const MessageIA: FC<MessageIAProps> = ({ msg, timeStamp }) => {
  return (
    <div className="bg-gradient-to-r from-[#6877e0] to-[#754da5] text-white p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <strong>ConverSAFe AI</strong>
        <span>{timeStamp}</span>
      </div>
      <p>{msg}</p>
    </div>
  )
}
export default MessageIA
