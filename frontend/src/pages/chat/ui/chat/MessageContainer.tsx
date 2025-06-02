import { useChatStore } from '../../../../store/chat.store';
import MessageHeader from './ui/MessageHeader';
import MessageInput from './ui/MessageInput';
import Messages from './ui/Messages';
import NoChatSelected from './ui/NoChatSelected';

const MessageContainer = () => {
  const { selectedUser} = useChatStore();

  if (selectedUser) {
    return (
      <div className="flex flex-col h-full w-full p-2 sm:p-4 bg-base-300 rounded-md">
        <MessageHeader />
        <div className="flex-1 overflow-y-auto">
          <Messages />
        </div>
        <div className="">
          <MessageInput />
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-1 w-full h-full items-center justify-center p-2 sm:p-4">
        <NoChatSelected />
      </div>
    );
  }
};

export default MessageContainer;