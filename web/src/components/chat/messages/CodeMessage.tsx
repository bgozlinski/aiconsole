// The AIConsole Project
//
// Copyright 2023 10Clouds
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { useCallback, useState } from 'react';

import { Spinner } from '@/components/chat/Spinner';
import { useAICStore } from '@/store/AICStore';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { AICCodeMessage, AICMessageGroup } from '@/types/types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { Button } from '../../system/Button';
import { duotoneDark as vs2015 } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { CodeOutput } from './CodeOutput';
import { EditableContentMessage } from './EditableContentMessage';

interface MessageProps {
  group: AICMessageGroup;
  message: AICCodeMessage;
  isStreaming: boolean;
}

export function CodeMessage({ group, message, isStreaming }: MessageProps) {
  const removeMessageFromGroup = useAICStore((state) => state.removeMessageFromGroup);
  const editMessageContent = useAICStore((state) => state.editMessageContent);

  const alwaysExecuteCode = useAICStore((state) => state.alwaysExecuteCode);

  const [folded, setFolded] = useState(alwaysExecuteCode);
  const doRun = useAICStore((state) => state.doRun);
  const enableAutoCodeExecution = useAICStore((state) => state.enableAutoCodeExecution);
  const isViableForRunningCode = useAICStore((state) => state.isViableForRunningCode);

  const handleAlwaysRunClick = () => {
    enableAutoCodeExecution();
    doRun(group.id, message.id);
  };

  const handleRunClick = () => {
    doRun(group.id, message.id);
  };

  const handleAcceptedContent = useCallback(
    (content: string) => {
      editMessageContent(group.id, message.id, content);
    },
    [message.id, group.id, editMessageContent],
  );

  const handleRemoveClick = useCallback(() => {
    removeMessageFromGroup(group.id, message.id);
  }, [message.id, group.id, removeMessageFromGroup]);

  return (
    <div className="flex justify-between items-center">
      <div className="p-5 rounded-md flex flex-col gap-5 bg-primary/5 flex-grow mr-4">
        <div className="cursor-pointer" onClick={() => setFolded((folded) => !folded)}>
          <div className="flex flex-row gap-2 items-center">
            {isStreaming ? (
              <div className="flex-grow flex flex-row gap-3 items-center">
                Working ... <Spinner />
              </div>
            ) : (
              <div className="flex-grow">{folded ? 'Check' : 'Hide'} the code</div>
            )}

            {folded && <ArrowDownIcon className="h-5 w-5" />}
            {!folded && <ArrowUpIcon className="h-5 w-5" />}
          </div>
        </div>

        {!folded && (
          <>
            <div className="flex flex-row w-full">
              <span className="w-20">Code: </span>
              <div className="flex-grow">
                <EditableContentMessage
                  initialContent={message.content}
                  isStreaming={isStreaming}
                  language={message.language}
                  handleAcceptedContent={handleAcceptedContent}
                  handleRemoveClick={handleRemoveClick}
                >
                  <SyntaxHighlighter
                    style={vs2015}
                    children={message.content}
                    language={message.language}
                    className="overflow-scroll max-w-3xl flex-grow rounded-md"
                  />
                </EditableContentMessage>
                {isViableForRunningCode(group.id, message.id) && !isStreaming && (
                  <div className="flex gap-4 pt-2">
                    <Button label="Run" onClick={handleRunClick} />

                    {!alwaysExecuteCode && (
                      <Button label="Always Run" onClick={handleAlwaysRunClick} variant="secondary" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {...message.outputs.map((output) => (
              <div key={output.id}>
                <CodeOutput group={group} message={message} output={output} isStreaming={isStreaming} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
