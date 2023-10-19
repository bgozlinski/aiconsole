import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import SideBar from '@/components/SideBar';
import { CommandInput } from '@/components/inputs/CommandInput';
import { TopBar } from '@/components/TopBar';
import { Chat } from '@/components/Chat';

export function ChatPage() {
  const { chat_id } = useParams<{ chat_id: string | undefined }>();
  const navigate = useNavigate();
  const [autoScrolling, setAutoScrolling] = useState<boolean>(false);

  useEffect(() => {
    if (!chat_id) {
      navigate(`/chats/${uuidv4()}`);
    }
  }, [chat_id, navigate]);

  return (
    <div className="App flex flex-col h-screen fixed top-0 left-0 bottom-0 right-0 bg-gray-800/95 text-stone-400">
      <TopBar />

      <div className="flex flex-row h-full overflow-y-auto">
        <SideBar />
        {chat_id && (
          <div className="flex w-full flex-col justify-between downlight">
            <Chat
              chatId={chat_id}
              autoScrolling={autoScrolling}
              setAutoScrolling={setAutoScrolling}
            />

            <CommandInput
              className="flex-none"
              onSubmit={() => setAutoScrolling(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
