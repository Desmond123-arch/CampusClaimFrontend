import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core'; // Add AfterViewChecked
import { Subscription } from 'rxjs';
import { WebsocketService, WebSocketState } from 'src/app/service/websocket.service';
import { ConversationService } from 'src/app/service/conversation.service';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
  standalone: false
})
export class MessagesPage implements OnInit, OnDestroy, AfterViewChecked {
  messages: any[] = [];
  newMessage: string = '';
  receiverId: string = '';
  connectionState: WebSocketState = WebSocketState.DISCONNECTED;
  conversations: any[] = [];
  selectedConversation: any = null;

  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;

  currentUserId: string = '';


  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  isDesktopOrTablet = this.platform.width() >= 768;
  private platformResizeSubscription: Subscription;

  constructor(
    private webSocketService: WebsocketService, 
    private conversationService: ConversationService, 
    private platform: Platform
  ) { 
    this.platformResizeSubscription = this.platform.resize.subscribe(() => {
      this.isDesktopOrTablet = this.platform.width() >= 768;
    });
  }

  ngOnInit() {
    this._getCurrentUserId();
    this.webSocketService.getConnectionState().subscribe(state => {
      this.connectionState = state;
      // console.log('Connection state:', state);
    });
    this.loadConversations();
  }

  ngOnDestroy() {
    if (this.platformResizeSubscription) {
      this.platformResizeSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private _getCurrentUserId(): void {
    Preferences.get({ key: 'user-id' }).then(result => {
      if (result.value) {
        this.currentUserId = result.value;
        this._subscribeToWebSocketMessages();
      }
    });
  }

  private _subscribeToWebSocketMessages(): void {
    this.webSocketService.getMessages().subscribe({
      next: (message) => {
        if (this.selectedConversation &&
            ((message.sender === this.currentUserId && message.receiver === this.selectedConversation.other_user_id) ||
             (message.receiver === this.currentUserId && message.sender === this.selectedConversation.other_user_id))) {
          this.messages.push(message);
        }
        this.loadConversations();
      },
      error: (err) => console.error('Socket error:', err)
    });
  }

  async loadConversations() {
    (await this.conversationService.getConversations()).subscribe({
      next: (response) => {
        this.conversations = response?.conversations || [];
        // console.log(this.conversations)
      },
      error: (err) => {
        console.error('Error loading conversations:', err);
        this.conversations = [];
      }
    });
  }

  selectConversation(conversation: any) {
    this.selectedConversation = conversation;
    this.receiverId = conversation.other_user_id;
    this.loadMessages(conversation.channel_id); 
  }

  backToConversations() {
    this.selectedConversation = null;
    this.messages = [];
  }

  async loadMessages(conversationId: string) {
    const userId = this.selectedConversation.other_user_id;
    (await this.conversationService.getMessages(userId)).subscribe({
      next: (response) => {
        this.messages = response?.messages || [];
        // console.log(this.messages)
      },
      error: (err) => {
        console.error('Error loading messages:', err);
        this.messages = [];
      }
    });
  }

  async sendChatMessage() {
    if (!this.newMessage.trim() || !this.receiverId) return;

    const message = {
      receiver_id: this.receiverId,
      message: this.newMessage.trim()
    };
    
    const success = await this.webSocketService.sendMessage(message);
    if (success) {
      this.newMessage = '';
    } else {
      console.error('Failed to send message');
    }
  }

  private scrollToBottom(): void {
    if (this.messagesContainer && this.messagesContainer.nativeElement) {
      try {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      } catch (err) { }
    }
  }

}