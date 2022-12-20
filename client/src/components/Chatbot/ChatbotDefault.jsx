import React from 'react'
import ChatBotSimple from "react-simple-chatbot";

const ChatbotDefault = ({defaultStep}) => {
  return (
    <div>
      <ChatBotSimple
          steps={defaultStep}
          className={"chatbot"}
          floating={true}
          headerTitle={"StackOverflow's Customer Service"}
          enableMobileAutoFocus={true}
        />
    </div>
  )
}

export default ChatbotDefault
