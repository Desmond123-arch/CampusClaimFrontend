import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

export enum WebSocketState {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR'
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$: WebSocketSubject<any> | null = null;
  private connectionState$ = new BehaviorSubject<WebSocketState>(WebSocketState.DISCONNECTED);
  private messageQueue: any[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3 seconds

  private messagesSubject = new Subject<any>();

  constructor() {
    this.initializeConnection();
  }

  getConnectionState(): Observable<WebSocketState> {
    return this.connectionState$.asObservable();
  }

  isConnected(): boolean {
    return this.connectionState$.value === WebSocketState.CONNECTED;
  }

  private async initializeConnection() {
    await this.connectWebSocket();
  }

  private async connectWebSocket(): Promise<void> {
    try {
      this.connectionState$.next(WebSocketState.CONNECTING);
      
      const token = await this.getAuthToken();
      
      if (!token) {
        console.error('❌ No auth token found');
        this.connectionState$.next(WebSocketState.ERROR);
        return;
      }

      const wsUrl = environment.api_url
        .replace('http://', 'ws://')
        .replace('https://', 'wss://') + `/ws?token=${token}`;


      this.socket$ = webSocket({
        url: wsUrl,
        openObserver: {
          next: () => {
            this.connectionState$.next(WebSocketState.CONNECTED);
            this.reconnectAttempts = 0;
            
            this.processMessageQueue();
          }
        },
        closeObserver: {
          next: (event) => {
            this.connectionState$.next(WebSocketState.DISCONNECTED);
            
            if (event.code !== 1000 && event.code !== 1001) {
              this.attemptReconnect();
            }
          }
        }
      });

      this.socket$.subscribe({
        next: (message) => {
          this.messagesSubject.next(message); // Broadcast the message
        },
        error: (err) => {
          console.error('🔥 WebSocket error:', err);
          this.connectionState$.next(WebSocketState.ERROR);
          this.attemptReconnect();
        }
      });

    } catch (error) {
      console.error('❌ Failed to connect WebSocket:', error);
      this.connectionState$.next(WebSocketState.ERROR);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      this.connectionState$.next(WebSocketState.ERROR);
      return;
    }

    this.reconnectAttempts++;
    
    setTimeout(() => {
      this.connectWebSocket();
    }, this.reconnectInterval * this.reconnectAttempts);
  }

  private processMessageQueue() {
    if (this.messageQueue.length > 0) {
      
      this.messageQueue.forEach(message => {
        this.sendMessageNow(message);
      });
      
      this.messageQueue = [];
    }
  }

  private sendMessageNow(message: any): boolean {
    if (this.socket$ && this.isConnected()) {
      try {
        this.socket$.next(message);
        return true;
      } catch (error) {
        console.error('❌ Failed to send message:', error);
        return false;
      }
    }
    return false;
  }

  sendMessage(message: any): Promise<boolean> {
    return new Promise((resolve) => {
      if (!message.receiver_id || !message.message) {
        console.error('❌ Invalid message format. Required: receiver_id, message');
        resolve(false);
        return;
      }

      if (this.isConnected()) {
        const success = this.sendMessageNow(message);
        resolve(success);
      } else if (this.connectionState$.value === WebSocketState.CONNECTING) {
        this.messageQueue.push(message);
        
        const subscription = this.connectionState$.subscribe(state => {
          if (state === WebSocketState.CONNECTED) {
            subscription.unsubscribe();
            resolve(true);
          } else if (state === WebSocketState.ERROR) {
            subscription.unsubscribe();
            resolve(false);
          }
        });

        setTimeout(() => {
          subscription.unsubscribe();
          resolve(false);
        }, 10000);
      } else {
        console.error('❌ WebSocket is not connected');
        resolve(false);
      }
    });
  }

  // Get messages observable
  getMessages(): Observable<any> {
    // console.log('WebSocketService: getMessages() called. Socket available:', !!this.socket$);
    return this.messagesSubject.asObservable();
  }

  closeConnection() {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
    this.connectionState$.next(WebSocketState.DISCONNECTED);
  }

  async reconnect() {
    // console.log('🔄 Manual reconnect requested');
    this.closeConnection();
    this.reconnectAttempts = 0;
    await this.connectWebSocket();
  }

  async getAuthToken(): Promise<string | null> {
    try {
      const token = await Preferences.get({ key: "auth-token" });
      return token.value;
    } catch (error) {
      console.error('❌ Failed to get auth token:', error);
      return null;
    }
  }

  isValidMessage(message: any): boolean {
    return message && 
           typeof message.receiver_id === 'string' && 
           typeof message.message === 'string' &&
           message.receiver_id.length > 0 &&
           message.message.length > 0;
  }
}