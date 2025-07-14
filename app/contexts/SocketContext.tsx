import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useUserStore } from '~/store/userStore';

interface ChatMessage {
  id: number;
  message: string;
  sender: {
    user_id: number;
    username: string;
    email: string;
    level: number;
    profile_image_url: string;
    direction?: string;
    liquidation_amount?: number;
    acquire_bugs?: number;
  };
  created_at: string;
}

// 새로운 Liquidation 데이터 타입 (사용자 제공 형식에 맞춤)
interface LiquidationExchangeData {
  exchange: string;
  liquidation_usd: number;
  longLiquidation_usd: number;
  shortLiquidation_usd: number;
}

interface LiquidationResponse {
  code: string;
  data: LiquidationExchangeData[];
}

interface LiquidationData {
  time_range: string;
  data: LiquidationResponse;
}

interface SocketContextType {
  chatConnected: boolean;
  liquidationSocketConnected: boolean;
  connectedUserCount: number;
  chatItems: ChatMessage[];
  sendMessage: (message: string) => void;
  messageIdCounter: React.MutableRefObject<number>;
  liquidationData: LiquidationData[]; // 새로운 타입으로 변경
  cleanup: () => void; // 클린업 함수 추가
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const AppSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUserStore();
  const [chatConnected, setChatConnected] = useState(false);
  const [liquidationSocketConnected, setLiquidationSocketConnected] = useState(false);
  const [connectedUserCount, setConnectedUserCount] = useState(0);
  const [chatItems, setChatItems] = useState<ChatMessage[]>([]);
  const chatSocketRef = useRef<WebSocket | null>(null);
  const liquidationSocketRef = useRef<WebSocket | null>(null);
  const messageIdCounter = useRef(1);
  const [liquidationData, setLiquidationData] = useState<LiquidationData[]>([]);
  // 최대 메시지 개수 상수 정의
  const MAX_MESSAGES = 300;

  // WebSocket 클린업 함수
  const cleanupChatSocket = () => {
    if (chatSocketRef.current) {
      // 이벤트 리스너 제거
      chatSocketRef.current.removeEventListener('open', () => {});
      chatSocketRef.current.removeEventListener('message', () => {});
      chatSocketRef.current.removeEventListener('error', () => {});
      chatSocketRef.current.removeEventListener('close', () => {});
      
      // WebSocket 연결 종료
      if (chatSocketRef.current.readyState === WebSocket.OPEN || 
          chatSocketRef.current.readyState === WebSocket.CONNECTING) {
        chatSocketRef.current.close(1000, 'Component unmounting');
      }
      chatSocketRef.current = null;
    }
    setChatConnected(false);
  };

  const cleanupLiquidationSocket = () => {
    if (liquidationSocketRef.current) {
      // 이벤트 리스너 제거
      liquidationSocketRef.current.removeEventListener('open', () => {});
      liquidationSocketRef.current.removeEventListener('message', () => {});
      liquidationSocketRef.current.removeEventListener('error', () => {});
      liquidationSocketRef.current.removeEventListener('close', () => {});
      
      // WebSocket 연결 종료
      if (liquidationSocketRef.current.readyState === WebSocket.OPEN || 
          liquidationSocketRef.current.readyState === WebSocket.CONNECTING) {
        liquidationSocketRef.current.close(1000, 'Component unmounting');
      }
      liquidationSocketRef.current = null;
    }
    setLiquidationSocketConnected(false);
  };

  // 전체 클린업 함수
  const cleanup = () => {
    cleanupChatSocket();
    cleanupLiquidationSocket();
    
    // 상태 초기화
    setChatItems([]);
    setLiquidationData([]);
    setConnectedUserCount(0);
    messageIdCounter.current = 1;
    
    console.log('Socket context cleanup completed');
  };

  const identifyUser = () => {
    if (chatSocketRef.current?.readyState === WebSocket.OPEN && user.user_id !== -1 && String(user.user_id) !== "") {
      chatSocketRef.current.send(JSON.stringify({
        action: 'identify',
        data: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          level: user.level,
          profile_image_url: !user.profile_image_url ? '/images/blank_profile.webp' : user.profile_image_url
        }
      }));
    }
  };

  const processIncomingChatMessage = (data: any) => {
    if (!data || !data.data) {
      console.warn('Invalid message data received:', data);
      return;
    }

    if (data.action === 'recent_messages') {
      setConnectedUserCount(data.data.connected_user_count || 0);
      
      // messages 배열이 존재하는지 확인
      if (data.data.messages && Array.isArray(data.data.messages)) {
        // 메시지 ID가 없는 경우 할당
        const messagesWithId = data.data.messages.map((message: any) => {
          if (!message) return null; // null 메시지 건너뛰기
          return {
            ...message,
            id: message.id || messageIdCounter.current++,
            sender: {
              user_id: message.sender?.user_id || -1,
              username: message.sender?.username || 'Unknown',
              email: message.sender?.email || '',
              level: message.sender?.level || 1,
              profile_image_url: message.sender?.profile_image_url || '/images/blank_profile.webp',
              direction: message.sender?.direction,
              liquidation_amount: message.sender?.liquidation_amount,
              acquire_bugs: message.sender?.acquire_bugs,
            },
            message: message.message || '',
            created_at: message.created_at || new Date().toISOString(),
          };
        }).filter(Boolean); // null 값 제거
        
        // 최대 메시지 개수를 유지하기 위해 필요한 경우 오래된 메시지 제거
        setChatItems(prev => {
          const combinedMessages = [...prev, ...messagesWithId];
          // 메시지가 최대 개수를 초과하면 오래된 메시지를 제거
          return combinedMessages.length > MAX_MESSAGES 
            ? combinedMessages.slice(combinedMessages.length - MAX_MESSAGES) 
            : combinedMessages;
        });
      }
    } else if (data.action === 'new_message') {
      setConnectedUserCount(data.data.connected_user_count || 0);
      
      // message 또는 messages 객체 확인 (서버에서 messages로 보낼 수도 있음)
      const messageData = data.data.message || data.data.messages;
      if (messageData) {
        const newMessage = {
          ...messageData,
          id: messageData.id || messageIdCounter.current++,
          sender: {
            user_id: messageData.sender?.user_id || -1,
            username: messageData.sender?.username || 'Unknown',
            email: messageData.sender?.email || '',
            level: messageData.sender?.level || 1,
            profile_image_url: messageData.sender?.profile_image_url || '/images/blank_profile.webp',
            direction: messageData.sender?.direction,
            liquidation_amount: messageData.sender?.liquidation_amount,
            acquire_bugs: messageData.sender?.acquire_bugs,
          },
          message: messageData.message || '',
          created_at: messageData.created_at || new Date().toISOString(),
        };
        
        // 새 메시지를 추가하고 메시지가 최대 개수를 초과하면 가장 오래된 메시지를 제거
        setChatItems(prev => {
          const newMessages = [...prev, newMessage];
          const result = newMessages.length > MAX_MESSAGES ? newMessages.slice(1) : newMessages;
          return result;
        });
      } else {
        console.log('🔴 No message data found in new_message action. Available keys:', Object.keys(data.data));
      }
    }
  };

  const sendMessage = (message: string) => {
    if (chatSocketRef.current?.readyState === WebSocket.OPEN && message.trim()) {
      chatSocketRef.current.send(JSON.stringify({
        action: 'message',
        data: {
          text: message,
        }
      }));
      // Optimistic update
      const newMessage = {
        id: messageIdCounter.current++,
        message: message,
        sender: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          level: user.level,
          profile_image_url: !user.profile_image_url ? '/images/blank_profile.webp' : user.profile_image_url,
        },
        created_at: new Date().toISOString(),
      };
      
      // 새 메시지를 추가하고 메시지가 최대 개수를 초과하면 가장 오래된 메시지를 제거
      setChatItems(prev => {
        const newMessages = [...prev, newMessage];
        return newMessages.length > MAX_MESSAGES ? newMessages.slice(1) : newMessages;
      });
    }
  };

  // Chat WebSocket connection
  useEffect(() => {
    const socket = new WebSocket('ws://121.142.204.10:8080/ws/chat');
    chatSocketRef.current = socket;

    const handleOpen = () => {
      console.log('Connected to Chat WebSocket server');
      setChatConnected(true);
      identifyUser();
    };

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string);
        if (data.action === "data_updated") {
          const customEvent = new CustomEvent('socket_data_updated', { detail: data });
          window.dispatchEvent(customEvent);
          return;
        }
        processIncomingChatMessage(data);
      } catch (error) {
        console.error('🔴 Error parsing Chat WebSocket message:', error);
      }
    };

    const handleError = (event: Event) => {
      console.error('Chat WebSocket error:', event);
    };

    const handleClose = () => {
      setChatConnected(false);
    };

    socket.addEventListener('open', handleOpen);
    socket.addEventListener('message', handleMessage);
    socket.addEventListener('error', handleError);
    socket.addEventListener('close', handleClose);

    return () => {
      socket.removeEventListener('open', handleOpen);
      socket.removeEventListener('message', handleMessage);
      socket.removeEventListener('error', handleError);
      socket.removeEventListener('close', handleClose);
      
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close(1000, 'Component unmounting');
      }
    };
  }, []);

  // Liquidation WebSocket connection
  useEffect(() => {
    const socket = new WebSocket('ws://121.142.204.10:8080/ws/liquidation');
    liquidationSocketRef.current = socket;

    const handleOpen = () => {
      console.log('Connected to Liquidation WebSocket server');
      setLiquidationSocketConnected(true);
      socket.send("get_data"); 
    };

    const handleMessage = (event: MessageEvent) => {
      try {
        const newLiquidationEntry = JSON.parse(event.data as string) as LiquidationData;
        
        setLiquidationData(prevData => {
          // time_range에 따라 기존 데이터를 업데이트하거나 새로 추가
          const existingIndex = prevData.findIndex(item => item.time_range === newLiquidationEntry.time_range);
          
          if (existingIndex !== -1) {
            // 기존 time_range 데이터 업데이트
            const updatedData = [...prevData];
            updatedData[existingIndex] = newLiquidationEntry;
            return updatedData;
          } else {
            // 새로운 time_range 데이터 추가
            return [...prevData, newLiquidationEntry];
          }
        });

      } catch (error) {
        console.error('Error parsing Liquidation WebSocket message:', error);
      }
    };

    const handleError = (event: Event) => {
      console.error('Liquidation WebSocket error:', event);
      setLiquidationSocketConnected(false);
    };

    const handleClose = () => {
      setLiquidationSocketConnected(false);
    };

    socket.addEventListener('open', handleOpen);
    socket.addEventListener('message', handleMessage);
    socket.addEventListener('error', handleError);
    socket.addEventListener('close', handleClose);

    return () => {
      socket.removeEventListener('open', handleOpen);
      socket.removeEventListener('message', handleMessage);
      socket.removeEventListener('error', handleError);
      socket.removeEventListener('close', handleClose);
      
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close(1000, 'Component unmounting');
      }
    };
  }, []);

  // Re-identify when user changes for chat socket
  useEffect(() => {
    identifyUser();
  }, [user, chatConnected]); // chatConnected 상태도 의존성에 추가

  // 컴포넌트 언마운트 시 전체 클린업
  useEffect(() => {
    return cleanup;
  }, []);

  const value = {
    chatConnected,
    liquidationSocketConnected,
    connectedUserCount,
    chatItems,
    sendMessage,
    messageIdCounter,
    liquidationData,
    cleanup, // 클린업 함수를 컨텍스트에 노출
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}; 