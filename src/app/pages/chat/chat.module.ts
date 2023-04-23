import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { ChatRoutingModule } from './chat-routing.module';

@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    ChatRoutingModule,
    CommonModule,
  ],
  providers: [],
})
export class ChatModule { }
