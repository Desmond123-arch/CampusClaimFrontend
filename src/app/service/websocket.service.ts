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
  private messageQueue: any[] = []; // Queue messages while connecting
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3 seconds

  constructor() {
    this.initializeConnection();
  }

  // Get connection state as Observable
  getConnectionState(): Observable<WebSocketState> {
    return this.connectionState$.asObservable();
  }

  // Check if WebSocket is connected
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

      console.log('🔄 Connecting to WebSocket:', wsUrl);

      this.socket$ = webSocket({
        url: wsUrl,
        openObserver: {
          next: () => {
            console.log("✅ WebSocket connection opened");
            this.connectionState$.next(WebSocketState.CONNECTED);
            this.reconnectAttempts = 0;
            
            // Send any queued messages
            this.processMessageQueue();
          }
        },
        closeObserver: {
          next: (event) => {
            console.log('🔒 WebSocket connection closed', event.code, event.reason);
            this.connectionState$.next(WebSocketState.DISCONNECTED);
            
            // Attempt to reconnect unless it was a normal closure
            if (event.code !== 1000 && event.code !== 1001) {
              this.attemptReconnect();
            }
          }
        }
      });

      this.socket$.subscribe({
        next: (message) => {
          console.log('📨 Message received:', message);
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
    console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(() => {
      this.connectWebSocket();
    }, this.reconnectInterval * this.reconnectAttempts); // Exponential backoff
  }

  private processMessageQueue() {
    if (this.messageQueue.length > 0) {
      console.log(`📤 Sending ${this.messageQueue.length} queued messages`);
      
      this.messageQueue.forEach(message => {
        this.sendMessageNow(message);
      });
      
      this.messageQueue = []; // Clear the queue
    }
  }

  // Send message immediately (assumes connection is ready)
  private sendMessageNow(message: any): boolean {
    if (this.socket$ && this.isConnected()) {
      try {
        this.socket$.next(message);
        console.log('📤 Message sent:', message);
        return true;
      } catch (error) {
        console.error('❌ Failed to send message:', error);
        return false;
      }
    }
    return false;
  }

  // Public method to send messages
  sendMessage(message: any): Promise<boolean> {
    return new Promise((resolve) => {
      // Validate message format for your backend
      if (!message.receiver_id || !message.message) {
        console.error('❌ Invalid message format. Required: receiver_id, message');
        resolve(false);
        return;
      }

      if (this.isConnected()) {
        // Send immediately if connected
        const success = this.sendMessageNow(message);
        resolve(success);
      } else if (this.connectionState$.value === WebSocketState.CONNECTING) {
        // Queue message if connecting
        console.log('⏳ Queueing message while connecting...');
        this.messageQueue.push(message);
        
        // Wait for connection or timeout
        const subscription = this.connectionState$.subscribe(state => {
          if (state === WebSocketState.CONNECTED) {
            subscription.unsubscribe();
            resolve(true);
          } else if (state === WebSocketState.ERROR) {
            subscription.unsubscribe();
            resolve(false);
          }
        });

        // Timeout after 10 seconds
        setTimeout(() => {
          subscription.unsubscribe();
          resolve(false);
        }, 10000);
      } else {
        // Not connected and not connecting
        console.error('❌ WebSocket is not connected');
        resolve(false);
      }
    });
  }

  // Get messages observable
  getMessages(): Observable<any> {
    if (this.socket$) {
      return this.socket$.asObservable();
    }
    
    // Return empty observable if not connected
    return new Observable(subscriber => {
      console.warn('⚠️ WebSocket not connected, returning empty observable');
      subscriber.complete();
    });
  }

  // Close connection
  closeConnection() {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
    this.connectionState$.next(WebSocketState.DISCONNECTED);
  }

  // Manual reconnect
  async reconnect() {
    console.log('🔄 Manual reconnect requested');
    this.closeConnection();
    this.reconnectAttempts = 0;
    await this.connectWebSocket();
  }

  // Get auth token
  async getAuthToken(): Promise<string | null> {
    try {
      const token = await Preferences.get({ key: "auth-token" });
      return token.value;
    } catch (error) {
      console.error('❌ Failed to get auth token:', error);
      return null;
    }
  }

  // Utility method to check message format
  isValidMessage(message: any): boolean {
    return message && 
           typeof message.receiver_id === 'string' && 
           typeof message.message === 'string' &&
           message.receiver_id.length > 0 &&
           message.message.length > 0;
  }
}